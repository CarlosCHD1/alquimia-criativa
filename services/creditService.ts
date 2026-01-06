import { supabase } from './supabaseClient';

export const COSTS = {
    GENERATOR: 1,
    PRODUCT_STUDIO: 1,
    BRAND_STUDIO: 1,
    SEQUENCER: 2,
    REVERSE_ENGINEER: 2,
    AGENT_BUILDER: 10,
};

export const creditService = {
    /**
     * Fetches the current credit balance for the authenticated user.
     */
    async getCredits(): Promise<number | null> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from('profiles')
            .select('credits')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error('Error fetching credits:', error);
            return null;
        }

        return data?.credits ?? 0;
    },

    /**
     * Attempts to deduct credits via a secure RPC call.
     * Returns true if successful, false otherwise.
     */
    async deductCredits(amount: number): Promise<boolean> {
        try {
            const { data, error } = await supabase.rpc('deduct_credits', { amount });

            if (error) {
                console.error('Error deducting credits:', error);
                return false;
            }

            // data contains the new balance, but we just need success confirmation here
            return true;
        } catch (err) {
            console.error('Unexpected error in deductCredits:', err);
            return false;
        }
    },

    /**
     * Subscribes to real-time credit updates.
     */
    subscribeToCredits(userId: string, callback: (newBalance: number) => void) {
        return supabase
            .channel('public:profiles')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'profiles',
                    filter: `id=eq.${userId}`,
                },
                (payload) => {
                    if (payload.new && typeof payload.new.credits === 'number') {
                        callback(payload.new.credits);
                    }
                }
            )
            .subscribe();
    }
};
