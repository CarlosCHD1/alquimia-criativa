import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Icons } from './Icons';

interface AdminStats {
    total_users: number;
    total_revenue: number;
    users: any[];
    recent_transactions: any[];
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);

    // Modal States
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newUser, setNewUser] = useState({ email: '', password: '', name: '' });
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        checkAdmin();
    }, []);

    const checkAdmin = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email === 'carloshenriquedionisio@gmail.com') {
            setIsAdmin(true);
            fetchStats();
        } else {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const { data, error } = await supabase.rpc('get_admin_dashboard_stats');
            if (error) throw error;
            setStats(data);
        } catch (err: any) {
            console.error('Admin fetch error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch('https://mukuljlqhwvzaofnlcyg.supabase.co/functions/v1/admin-actions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({
                    action: 'create_user',
                    payload: { email: newUser.email, password: newUser.password, fullName: newUser.name }
                })
            });

            if (!res.ok) throw new Error('Failed to create user');

            alert('Usuário criado com sucesso!');
            setIsCreateOpen(false);
            setNewUser({ email: '', password: '', name: '' });
            fetchStats(); // Refresh list
        } catch (err: any) {
            alert('Erro: ' + err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateStatus = async (userId: string, currentStatus: string, currentTags: string[]) => {
        const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
        if (!confirm(`Deseja alterar status para ${newStatus.toUpperCase()}?`)) return;

        try {
            const { error } = await supabase.rpc('admin_update_profile', {
                target_user_id: userId,
                new_status: newStatus,
                new_tags: currentTags || []
            });
            if (error) throw error;
            fetchStats();
        } catch (err: any) {
            alert('Erro ao atualizar: ' + err.message);
        }
    };

    if (!isAdmin && !loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
                <Icons.Lock className="w-16 h-16 text-neutral-600" />
                <h1 className="text-2xl font-bold text-white">Acesso Negado</h1>
                <p className="text-neutral-400">Esta área é restrita para administradores.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Icons.Loader className="w-8 h-8 text-neon animate-spin" />
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-base-content flex items-center gap-2">
                        <Icons.User className="text-neon" /> Painel Admin
                    </h2>
                    <p className="text-neutral-400">CRM de Usuários e Vendas.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="bg-neon text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-neon/90 transition-colors"
                    >
                        <Icons.User className="w-4 h-4" /> Novo Usuário
                    </button>
                    <div className="bg-neutral-900/50 px-4 py-2 rounded-lg border border-neutral-800 text-xs text-neutral-500 font-mono flex items-center">
                        Admin: carloshenriquedionisio@gmail.com
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-base-card border border-base-border p-6 rounded-2xl shadow-lg relative overflow-hidden group">
                    <h3 className="text-neutral-400 font-medium text-sm uppercase tracking-wider mb-2">Total Usuários</h3>
                    <p className="text-4xl font-bold text-white">{stats?.total_users}</p>
                    <p className="text-xs text-green-400 mt-2 flex items-center gap-1"><Icons.Zap className="w-3 h-3" /> Base ativa</p>
                </div>
                <div className="bg-base-card border border-base-border p-6 rounded-2xl shadow-lg relative overflow-hidden group">
                    <h3 className="text-neutral-400 font-medium text-sm uppercase tracking-wider mb-2">Receita Total</h3>
                    <p className="text-4xl font-bold text-white">R$ {stats?.total_revenue?.toFixed(2)}</p>
                    <p className="text-xs text-green-400 mt-2">Vendas aprovadas</p>
                </div>
                <div className="bg-base-card border border-base-border p-6 rounded-2xl shadow-lg relative overflow-hidden group">
                    <h3 className="text-neutral-400 font-medium text-sm uppercase tracking-wider mb-2">Transações Recentes</h3>
                    <p className="text-4xl font-bold text-white">{stats?.recent_transactions.length}</p>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-base-card border border-base-border rounded-2xl overflow-hidden shadow-lg h-[600px] flex flex-col">
                <div className="p-6 border-b border-base-border flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">Usuários Cadastrados</h3>
                    <span className="text-xs text-neutral-500">{stats?.users.length} registros</span>
                </div>
                <div className="overflow-auto flex-1 custom-scrollbar">
                    <table className="w-full text-left">
                        <thead className="bg-base-black text-neutral-400 text-xs uppercase font-medium sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4 bg-base-black">Usuário</th>
                                <th className="px-6 py-4 bg-base-black">Email</th>
                                <th className="px-6 py-4 bg-base-black">Créditos</th>
                                <th className="px-6 py-4 bg-base-black">Status</th>
                                <th className="px-6 py-4 bg-base-black">Tags</th>
                                <th className="px-6 py-4 bg-base-black text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {stats?.users.map((user) => (
                                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-neutral-800 overflow-hidden flex items-center justify-center border border-neutral-700">
                                                {user.avatar_url ? (
                                                    <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-xs font-bold text-neutral-500">
                                                        {(user.first_name?.[0] || user.email[0]).toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <div className="text-white font-medium text-sm">{user.first_name} {user.last_name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-neutral-300 text-sm">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neon/10 text-neon text-xs font-bold border border-neon/20">
                                            <Icons.Zap className="w-3 h-3" /> {user.credits}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${user.status === 'blocked' ? 'bg-red-900/50 text-red-500' : 'bg-green-900/50 text-green-500'
                                            }`}>
                                            {user.status === 'blocked' ? 'BLOQUEADO' : 'ATIVO'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-1 flex-wrap max-w-[150px]">
                                            {user.tags?.map((tag: string, i: number) => (
                                                <span key={i} className="text-[10px] bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-400 border border-neutral-700">
                                                    {tag}
                                                </span>
                                            ))}
                                            <button className="text-[10px] text-neutral-500 hover:text-white">+</button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleUpdateStatus(user.id, user.status, user.tags)}
                                                className={`p-1.5 rounded-lg transition-colors ${user.status === 'blocked'
                                                        ? 'bg-green-900/20 text-green-500 hover:bg-green-900/40'
                                                        : 'bg-red-900/20 text-red-500 hover:bg-red-900/40'
                                                    }`}
                                                title={user.status === 'blocked' ? 'Desbloquear' : 'Bloquear'}
                                            >
                                                {user.status === 'blocked' ? <Icons.Zap className="w-4 h-4" /> : <Icons.Lock className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create User Modal */}
            {isCreateOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-base-card border border-base-border w-full max-w-md rounded-2xl shadow-2xl p-6">
                        <h3 className="text-xl font-bold text-white mb-4">Novo Usuário Manual</h3>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-neutral-400 mb-1">Nome Completo</label>
                                <input
                                    type="text"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    className="w-full bg-base-black border border-neutral-800 rounded-lg p-2 text-white focus:border-neon outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-neutral-400 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    className="w-full bg-base-black border border-neutral-800 rounded-lg p-2 text-white focus:border-neon outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-neutral-400 mb-1">Senha Provisória</label>
                                <input
                                    type="text"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    className="w-full bg-base-black border border-neutral-800 rounded-lg p-2 text-white focus:border-neon outline-none font-mono"
                                    required
                                    placeholder="Ex: Alquimia123!"
                                />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button type="button" onClick={() => setIsCreateOpen(false)} className="flex-1 bg-neutral-800 text-white rounded-lg p-2 hover:bg-neutral-700">Cancelar</button>
                                <button type="submit" disabled={actionLoading} className="flex-1 bg-neon text-black rounded-lg p-2 font-bold hover:bg-neon/90 disabled:opacity-50">
                                    {actionLoading ? 'Criando...' : 'Criar Usuário'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
