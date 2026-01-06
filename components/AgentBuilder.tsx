
import React, { useState } from 'react';
import { generateAgentSystemPrompt } from '../services/geminiService';
import { creditService, COSTS } from '../services/creditService';
import { Icons } from './Icons';

interface AgentBuilderProps {
    onSaveHistory: (input: string, output: string, imageBase64?: string) => void;
}

const AgentBuilder: React.FC<AgentBuilderProps> = ({ onSaveHistory }) => {
    // Inputs
    const [role, setRole] = useState('');
    const [context, setContext] = useState('');
    const [tasks, setTasks] = useState('');
    const [tools, setTools] = useState('');
    const [constraints, setConstraints] = useState('');

    // Output
    const [generatedSystemPrompt, setGeneratedSystemPrompt] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!role.trim() && !tasks.trim()) return;

        const hasCredits = await creditService.deductCredits(COSTS.AGENT_BUILDER);
        if (!hasCredits) {
            alert("Créditos insuficientes! Por favor, recarregue sua conta.");
            return;
        }

        setLoading(true);
        try {
            const result = await generateAgentSystemPrompt({
                role,
                context,
                tasks,
                tools,
                constraints
            });
            setGeneratedSystemPrompt(result);
            onSaveHistory(`Agent Builder: ${role}`, result);
        } catch (e) {
            console.error(e);
            alert("Erro ao gerar prompt de agente.");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedSystemPrompt);
    };

    return (
        <div className="w-full max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500 pb-12">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-base-border pb-6 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-base-content flex items-center gap-3">
                        <Icons.Agent className="text-neon w-8 h-8" />
                        Arquiteto de Agentes
                    </h2>
                    <p className="text-neutral-500 mt-1">Crie System Prompts robustos e estruturados para n8n, LangChain e AutoGPT.</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-neon border border-neon/30 bg-neon/5 px-3 py-1 rounded-lg">
                    <Icons.Workflow className="w-4 h-4" />
                    FRAMEWORK: ROLE-CONTEXT-TASK
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">

                {/* LEFT: INPUTS */}
                <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">

                    {/* ROLE */}
                    <div id="agent-type-select" className="bg-base-card border border-base-border rounded-xl p-5 shadow-lg group focus-within:border-neon/50 transition-colors">
                        <label className="text-xs font-bold text-neon uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Icons.User className="w-4 h-4" />
                            1. Papel & Persona
                        </label>
                        <textarea
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            placeholder="Ex: Especialista em Suporte Técnico Nível 2, empático mas direto, focado em resolver problemas de rede..."
                            className="w-full bg-base-black border border-base-border rounded-lg p-3 text-sm text-base-content focus:outline-none focus:border-neon/50 resize-none h-24 custom-scrollbar placeholder:text-neutral-600"
                        />
                        <p className="text-[10px] text-neutral-500 mt-2">Quem é o agente? Qual seu tom de voz e expertise?</p>
                    </div>

                    {/* CONTEXT */}
                    <div id="knowledge-base" className="bg-base-card border border-base-border rounded-xl p-5 shadow-lg group focus-within:border-neon/50 transition-colors">
                        <label className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Icons.Book className="w-4 h-4" />
                            2. Contexto & Conhecimento
                        </label>
                        <textarea
                            value={context}
                            onChange={(e) => setContext(e.target.value)}
                            placeholder="Ex: Você trabalha para a empresa XYZ. Você tem acesso à base de conhecimento de 2024. O usuário é um cliente enterprise..."
                            className="w-full bg-base-black border border-base-border rounded-lg p-3 text-sm text-base-content focus:outline-none focus:border-blue-500/50 resize-none h-24 custom-scrollbar placeholder:text-neutral-600"
                        />
                        <p className="text-[10px] text-neutral-500 mt-2">Onde ele está inserido? O que ele sabe (e o que não sabe)?</p>
                    </div>

                    {/* TASKS */}
                    <div className="bg-base-card border border-base-border rounded-xl p-5 shadow-lg group focus-within:border-neon/50 transition-colors">
                        <label className="text-xs font-bold text-green-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Icons.ListVideo className="w-4 h-4" />
                            3. Tarefas & Lógica
                        </label>
                        <textarea
                            value={tasks}
                            onChange={(e) => setTasks(e.target.value)}
                            placeholder="Ex: 1. Receber o ticket. 2. Classificar urgência. 3. Se for crítico, escalar. 4. Se não, responder com solução da base..."
                            className="w-full bg-base-black border border-base-border rounded-lg p-3 text-sm text-base-content focus:outline-none focus:border-green-500/50 resize-none h-32 custom-scrollbar placeholder:text-neutral-600"
                        />
                        <p className="text-[10px] text-neutral-500 mt-2">O passo a passo lógico que o agente deve seguir.</p>
                    </div>

                    {/* TOOLS */}
                    <div className="bg-base-card border border-base-border rounded-xl p-5 shadow-lg group focus-within:border-neon/50 transition-colors">
                        <label className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Icons.Briefcase className="w-4 h-4" />
                            4. Ferramentas (Tools)
                        </label>
                        <textarea
                            value={tools}
                            onChange={(e) => setTools(e.target.value)}
                            placeholder="Ex: Google Sheets (leitura/escrita), Gmail API, Web Search, Calculadora..."
                            className="w-full bg-base-black border border-base-border rounded-lg p-3 text-sm text-base-content focus:outline-none focus:border-purple-500/50 resize-none h-20 custom-scrollbar placeholder:text-neutral-600"
                        />
                        <p className="text-[10px] text-neutral-500 mt-2">Quais ferramentas o agente pode/deve invocar?</p>
                    </div>

                    {/* CONSTRAINTS */}
                    <div className="bg-base-card border border-base-border rounded-xl p-5 shadow-lg group focus-within:border-neon/50 transition-colors">
                        <label className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Icons.Info className="w-4 h-4" />
                            5. Notas & Restrições
                        </label>
                        <textarea
                            value={constraints}
                            onChange={(e) => setConstraints(e.target.value)}
                            placeholder="Ex: Nunca invente dados. Responda sempre em JSON. Seja formal. Máximo de 50 palavras..."
                            className="w-full bg-base-black border border-base-border rounded-lg p-3 text-sm text-base-content focus:outline-none focus:border-red-500/50 resize-none h-20 custom-scrollbar placeholder:text-neutral-600"
                        />
                        <p className="text-[10px] text-neutral-500 mt-2">O que ele NÃO deve fazer? Regras de formatação?</p>
                    </div>

                    <button
                        id="compile-btn"
                        onClick={handleGenerate}
                        disabled={loading || !role}
                        className={`
                w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all
                ${loading || !role
                                ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                                : 'bg-neon hover:bg-neon-light text-black shadow-[0_0_20px_rgba(255,95,0,0.4)]'}
                `}
                    >
                        {loading ? <Icons.ScanLine className="animate-spin" /> : <Icons.Sparkles className="fill-black" />}
                        {loading ? 'COMPILANDO SISTEMA...' : 'GERAR SYSTEM PROMPT'}
                    </button>
                </div>

                {/* RIGHT: OUTPUT */}
                <div className="h-full flex flex-col">
                    <div className="bg-base-dark border border-base-border rounded-2xl flex flex-col h-full shadow-inner overflow-hidden relative">

                        {/* Output Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-base-border bg-base-card/50">
                            <div className="flex items-center gap-2">
                                <Icons.Terminal className="w-4 h-4 text-neon" />
                                <span className="text-xs font-mono text-neutral-400">SYSTEM_INSTRUCTION.md</span>
                            </div>
                            {generatedSystemPrompt && (
                                <button
                                    onClick={copyToClipboard}
                                    className="text-xs text-neon hover:text-white flex items-center gap-1 bg-neon/10 px-2 py-1 rounded hover:bg-neon/20 transition-colors border border-neon/20"
                                >
                                    <Icons.Copy className="w-3 h-3" /> COPIAR
                                </button>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                            {generatedSystemPrompt ? (
                                <div className="prose prose-invert prose-sm max-w-none">
                                    <pre className="whitespace-pre-wrap font-mono text-sm text-neutral-300 bg-transparent border-none p-0">
                                        {generatedSystemPrompt}
                                    </pre>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center opacity-20 text-center p-6 space-y-4">
                                    <div className="w-20 h-20 rounded-full border border-neutral-700 flex items-center justify-center">
                                        <Icons.Bot className="w-10 h-10 text-neutral-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-neutral-400 mb-1">Aguardando Input</h4>
                                        <p className="text-xs text-neutral-600 max-w-[250px]">
                                            Preencha os campos estruturais ao lado para gerar uma instrução de sistema profissional para seu Agente.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Decoration */}
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-neon via-purple-500 to-blue-500 opacity-20"></div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AgentBuilder;
