
import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Icons } from './Icons';

const Auth: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
    const [errorMsg, setErrorMsg] = useState('');

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            if (mode === 'SIGNUP') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                alert('Cadastro realizado! Verifique seu email ou faça login.');
                setMode('LOGIN');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            }
        } catch (error: any) {
            setErrorMsg(error.message || 'Erro ao autenticar');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="fixed inset-0 z-0 opacity-20"
                style={{
                    backgroundImage: `linear-gradient(var(--border-base) 1px, transparent 1px), linear-gradient(90deg, var(--border-base) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}>
            </div>
            <div className="fixed top-0 right-0 w-[80vw] h-[80vw] bg-neon/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen opacity-50 translate-x-1/4 -translate-y-1/4"></div>


            <div className="w-full max-w-md bg-base-card border border-base-border rounded-2xl shadow-2xl p-8 relative z-10 animate-in fade-in zoom-in-95 duration-500">
                <div className="text-center mb-8 relative">
                    <button
                        onClick={() => window.location.reload()}
                        className="absolute -top-4 -left-4 p-2 text-neutral-500 hover:text-white transition-colors"
                        title="Voltar ao Início"
                    >
                        <Icons.ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-neon to-orange-500 bg-clip-text text-transparent mb-2">
                        Alquimia Criativa
                    </h1>
                    <p className="text-neutral-500 text-sm">Entre para forjar prompts de elite.</p>
                </div>

                {errorMsg && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl flex items-center gap-2">
                        <Icons.AlertTriangle className="w-4 h-4 shrink-0" />
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-base-content uppercase tracking-wider ml-1">Email</label>
                        <div className="relative group">
                            <Icons.User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-neon transition-colors" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                className="w-full bg-base-dark border border-base-border rounded-xl py-3 pl-11 pr-4 text-base-content placeholder:text-neutral-500 outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-base-content uppercase tracking-wider ml-1">Senha</label>
                        <div className="relative group">
                            <Icons.Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-neon transition-colors" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-base-dark border border-base-border rounded-xl py-3 pl-11 pr-4 text-base-content placeholder:text-neutral-500 outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`
              w-full py-4 rounded-xl font-bold text-black text-lg transition-all mt-6 shadow-lg hover:shadow-neon/20 hover:-translate-y-1
              ${loading ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed' : 'bg-neon hover:bg-neon-light'}
            `}
                    >
                        {loading ? 'PROCESSANDO...' : (mode === 'LOGIN' ? 'ENTRAR' : 'CRIAR CONTA')}
                    </button>

                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-base-border"></div>
                        <span className="flex-shrink-0 mx-4 text-xs text-neutral-500 uppercase">OU</span>
                        <div className="flex-grow border-t border-base-border"></div>
                    </div>

                    <button
                        type="button"
                        onClick={async () => {
                            setLoading(true);
                            const { error } = await supabase.auth.signInWithOAuth({
                                provider: 'google',
                                options: {
                                    redirectTo: window.location.origin,
                                    queryParams: {
                                        access_type: 'offline',
                                        prompt: 'consent',
                                    },
                                }
                            });
                            if (error) {
                                setErrorMsg(error.message);
                                setLoading(false);
                            }
                        }}
                        disabled={loading}
                        className="w-full py-3 rounded-xl font-bold text-base-content bg-base-dark border border-base-border hover:border-white transition-all flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Google
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-neutral-500">
                        {mode === 'LOGIN' ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                        <button
                            onClick={() => setMode(mode === 'LOGIN' ? 'SIGNUP' : 'LOGIN')}
                            className="ml-2 text-neon font-bold hover:underline outline-none"
                        >
                            {mode === 'LOGIN' ? 'Cadastre-se' : 'Faça Login'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;
