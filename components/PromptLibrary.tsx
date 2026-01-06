import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Icons } from './Icons';
import { toast } from 'sonner';

interface LibraryPrompt {
    id: string;
    title: string;
    concept: string;
    content: string;
    style: string;
    category: string;
    tags: string[];
    likes_count: number;
    is_verified: boolean;
    created_at: string;
    user_vote?: boolean; // Virtual field
}

export default function PromptLibrary({ onReuse }: { onReuse: (prompt: LibraryPrompt) => void }) {
    const [prompts, setPrompts] = useState<LibraryPrompt[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState<string | null>(null);

    useEffect(() => {
        fetchPrompts();
    }, [filterCategory]);

    const fetchPrompts = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('library_prompts')
                .select('*')
                .eq('is_public', true)
                .order('likes_count', { ascending: false });

            if (filterCategory) {
                query = query.eq('category', filterCategory);
            }

            const { data, error } = await query;
            if (error) throw error;
            setPrompts(data || []);
        } catch (err: any) {
            console.error('Library fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async (id: string, currentLikes: number) => {
        try {
            await supabase.rpc('toggle_vote_prompt', { target_prompt_id: id });
            // Optimistic update
            setPrompts(prompts.map(p => {
                if (p.id === id) {
                    // Logic is simplified; real app would verify if user already liked
                    // For now we just re-fetch or increment for visual feedback
                    return { ...p, likes_count: p.likes_count + 1 };
                }
                return p;
            }));
            fetchPrompts(); // Sync real state
        } catch (err) {
            toast.error('Erro ao votar');
        }
    };

    const categories = ['General', 'Portrait', 'Landscape', 'Character', 'Abstract', '3D Render', 'Logo'];

    return (
        <div className="w-full max-w-[1600px] mx-auto p-6 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                        <Icons.Book className="text-neon" /> Biblioteca de Prompts
                    </h2>
                    <p className="text-neutral-400">Explore e reutilize os melhores prompts da comunidade.</p>
                </div>

                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto custom-scrollbar">
                    <button
                        onClick={() => setFilterCategory(null)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${filterCategory === null
                                ? 'bg-neon/10 border-neon text-neon'
                                : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                            }`}
                    >
                        Todos
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilterCategory(cat)}
                            className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${filterCategory === cat
                                    ? 'bg-neon/10 border-neon text-neon'
                                    : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Icons.Loader className="w-8 h-8 text-neon animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {prompts.map(prompt => (
                        <div key={prompt.id} className="group bg-base-card border border-base-border rounded-xl p-5 hover:border-neon/50 transition-all flex flex-col h-full relative overflow-hidden">
                            {prompt.is_verified && (
                                <div className="absolute top-0 right-0 bg-neon text-black text-[10px] font-bold px-2 py-1 rounded-bl-lg flex items-center gap-1 z-10">
                                    <Icons.Zap className="w-3 h-3" /> VERIFICADO
                                </div>
                            )}

                            <div className="mb-4">
                                <div className="text-[10px] text-neon mb-1 font-mono uppercase">{prompt.category}</div>
                                <h3 className="text-lg font-bold text-white line-clamp-1" title={prompt.title || prompt.concept}>
                                    {prompt.title || prompt.concept}
                                </h3>
                                <p className="text-xs text-neutral-500 line-clamp-2 mt-1">{prompt.styles || 'Estilo Automático'}</p>
                            </div>

                            <div className="flex-1 bg-black/20 rounded-lg p-3 text-sm text-neutral-300 font-mono mb-4 overflow-hidden relative">
                                <div className="line-clamp-4">{prompt.content}</div>
                                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-base-card to-transparent"></div>
                            </div>

                            <div className="flex items-center justify-between border-t border-white/5 pt-4">
                                <button
                                    onClick={() => handleVote(prompt.id, prompt.likes_count)}
                                    className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-red-500 transition-colors"
                                >
                                    <Icons.Heart className="w-4 h-4" /> {prompt.likes_count}
                                </button>

                                <button
                                    onClick={() => onReuse(prompt)}
                                    className="bg-white/5 hover:bg-neon hover:text-black text-white text-xs px-3 py-1.5 rounded-lg transition-all font-semibold flex items-center gap-2"
                                >
                                    <Icons.Zap className="w-3 h-3" /> Reutilizar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
