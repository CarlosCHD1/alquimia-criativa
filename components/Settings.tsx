import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { Icons } from './Icons';

export default function Settings() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    // Form State
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Avatar State
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    // Feedback State
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        getProfile();
    }, []);

    const getProfile = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                setUser(user);
                setEmail(user.email || '');

                // Fetch specific profile data
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('first_name, last_name, avatar_url')
                    .eq('id', user.id)
                    .single();

                if (profile) {
                    setFirstName(profile.first_name || '');
                    setLastName(profile.last_name || '');
                    setAvatarUrl(profile.avatar_url || null);
                }
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            setAvatarUrl(publicUrl);

            // Auto update profile with new avatar
            const { error: updateError } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    avatar_url: publicUrl,
                    updated_at: new Date(),
                });

            if (updateError) throw updateError;

            setMessage({ type: 'success', text: 'Avatar atualizado!' });

        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setUploading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);

        try {
            // 1. Update Password (if provided)
            if (password) {
                const { error: passError } = await supabase.auth.updateUser({ password: password });
                if (passError) throw passError;
            }

            // 2. Update Email (if changed)
            if (email !== user.email) {
                const { error: emailError } = await supabase.auth.updateUser({ email: email });
                if (emailError) throw emailError;
            }

            // 3. Update Profile Data (Names)
            const updates = {
                id: user.id,
                first_name: firstName,
                last_name: lastName,
                updated_at: new Date(),
            };

            const { error: profileError } = await supabase
                .from('profiles')
                .upsert(updates);

            if (profileError) throw profileError;

            setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });

            // Clear password field for security
            setPassword('');
            // Refresh data
            await getProfile();

        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Erro ao atualizar perfil.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold text-base-content flex items-center gap-2">
                    <Icons.Settings className="text-neon" /> Configurações
                </h2>
                <p className="text-neutral-400">Gerencie suas informações pessoais e segurança.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Profile Form */}
                <div className="bg-base-card border border-base-border rounded-2xl p-8 shadow-lg">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Icons.User className="w-5 h-5 text-neon" /> Perfil de Usuário
                    </h3>

                    {/* Avatar Selection */}
                    <div className="flex items-center gap-6 mb-8">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-neon/50 bg-neutral-800 flex items-center justify-center">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <Icons.User className="w-10 h-10 text-neutral-500" />
                                )}
                                {uploading && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <Icons.Loader className="w-6 h-6 text-neon animate-spin" />
                                    </div>
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 p-1.5 bg-neon text-black rounded-full cursor-pointer hover:bg-neon-light transition-colors shadow-lg">
                                <Icons.Camera className="w-4 h-4" />
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={uploadAvatar}
                                    disabled={uploading}
                                />
                            </label>
                        </div>
                        <div>
                            <p className="text-white font-medium">Foto de Perfil</p>
                            <p className="text-xs text-neutral-400">JPG, PNG ou GIF. Max 2MB.</p>
                        </div>
                    </div>

                    <form onSubmit={handleUpdateProfile} className="space-y-6">

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-neutral-300">Nome</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full bg-base-dark border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon transition-colors"
                                    placeholder="Seu nome"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-neutral-300">Sobrenome</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full bg-base-dark border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon transition-colors"
                                    placeholder="Seu sobrenome"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-neutral-300">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-base-dark border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon transition-colors"
                                placeholder="seu@email.com"
                            />
                            <p className="text-xs text-neutral-500">Se alterar o email, você precisará confirmar no novo endereço.</p>
                        </div>

                        <div className="space-y-2 pt-4 border-t border-neutral-800">
                            <label className="text-sm font-semibold text-neutral-300 flex items-center gap-2">
                                <Icons.Lock className="w-4 h-4 text-neon" /> Nova Senha
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-base-dark border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon transition-colors"
                                placeholder="Deixe em branco para manter a atual"
                            />
                        </div>

                        {message && (
                            <div className={`p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-900/20 text-green-400 border border-green-900/50' : 'bg-red-900/20 text-red-400 border border-red-900/50'}`}>
                                {message.text}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${loading ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed' : 'bg-neon hover:bg-neon-light text-black shadow-lg shadow-neon/20 hover:-translate-y-1'}`}
                        >
                            {loading ? 'Salvando...' : 'Salvar Alterações'}
                        </button>

                    </form>
                </div>

                {/* Info / Plan Card (Placeholder) */}
                <div className="space-y-6">
                    <div className="bg-base-card border border-base-border rounded-2xl p-8 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-32 bg-neon/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Icons.Zap className="w-5 h-5 text-neon" /> Plano Atual
                        </h3>
                        <div className="bg-base-black rounded-xl p-6 border border-neutral-800 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-neutral-400">Plano</span>
                                <span className="text-neon font-bold uppercase tracking-wider">Pro Creator</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-neutral-400">Status</span>
                                <span className="text-green-400 font-bold bg-green-400/10 px-2 py-0.5 rounded text-xs">ATIVO</span>
                            </div>
                            <div className="h-px bg-neutral-800 my-2"></div>
                            <p className="text-xs text-neutral-500">Gerenciamento de assinatura é feito através da plataforma de pagamento.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
