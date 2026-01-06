
import React, { useState } from 'react';
import { Icons } from './Icons';

interface PrdData {
    productName: string;
    problem: string;
    targetAudience: string;
    coreFeatures: string;
    successMetrics: string;
}

const PrdGenerator: React.FC = () => {
    const [data, setData] = useState<PrdData>({
        productName: '',
        problem: '',
        targetAudience: '',
        coreFeatures: '',
        successMetrics: ''
    });
    const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
    const [copied, setCopied] = useState(false);

    const handleInputChange = (field: keyof PrdData, value: string) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const generatePerfectPrompt = () => {
        const prompt = `
# ACT AS A WORLD-CLASS SENIOR PRODUCT MANAGER (EX-GOOGLE/AMAZON)

Your goal is to write a **Product Requirements Document (PRD)** of the highest possible standard for the following product idea.
This document must be rigorous, clear, and actionable for engineering, design, and QA teams.

## 1. PRODUCT CONTEXT
- **Product Name:** ${data.productName}
- **The Core Problem:** ${data.problem}
- **Target Audience:** ${data.targetAudience}

## 2. INSTRUCTIONS FOR THE PRD
Produce a comprehensive PRD using industry-standard formatting. Include the following sections with extreme detail:

### A. Executive Summary
- A high-level pitch (Elevator Pitch).
- Why this, why now? (Market timing).

### B. User Personas & User Journeys
- Define 2-3 detailed personas (Name, Role, Pain Points).
- Create a Step-by-Step User Journey Map for the "Happy Path".

### C. Functional Requirements (The Core)
- Break down the provided features into detailed User Stories.
- **Format:** "As a [User], I want to [Action], so that [Benefit]."
- **Acceptance Criteria:** For each story, list 3-5 bullet points of "Given/When/Then" (Gherkin syntax optional but preferred for clarity).
- **Core Features Input:** ${data.coreFeatures}

### D. Non-Functional Requirements
- Performance (Latency, Load).
- Security (Auth, Data Privacy).
- Scalability & Reliability.

### E. Success Metrics (KPIs)
- Define North Star Metric.
- Define Secondary Metrics (Retention, Acquisition, Engagement).
- **Metrics Input:** ${data.successMetrics}

### F. Risks & Mitigations
- Technical, Business, and Operational risks with contingency plans.

## 3. TONE AND STYLE
- **Tone:** Professional, Assertive, Data-Driven.
- **Format:** Markdown with clear headings, tables for requirements, and bolding for emphasis.
- **Quality Bar:** Nothing vague. Avoid words like "fast", use "under 200ms". Avoid "easy to use", use "maximum of 3 distinct clicks".

---
**OUTPUT THE PRD BELOW:**
    `.trim();
        setGeneratedPrompt(prompt);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedPrompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-base-border pb-6 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-base-content flex items-center gap-3">
                        <Icons.FileText className="text-neon w-8 h-8" />
                        Gerador de PRD de Excelência
                    </h2>
                    <p className="text-neutral-500 mt-1">Transforme ideias abstratas em especificações de produto de nível "Big Tech".</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-neon border border-neon/30 bg-neon/5 px-3 py-1 rounded-lg">
                    <Icons.Sparkles className="w-4 h-4" />
                    WORLD-CLASS PM FRAMEWORK
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                {/* INPUT FORM */}
                <div className="bg-base-card border border-base-border rounded-2xl p-8 space-y-6 shadow-xl h-fit">
                    <h2 className="text-2xl font-bold text-white mb-4">Definição do Produto</h2>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-neutral-300">Nome do Produto (ou Codinome)</label>
                            <input
                                type="text"
                                className="w-full bg-base-black border border-neutral-700 rounded-xl p-4 text-white focus:border-neon focus:ring-1 focus:ring-neon transition-all outline-none"
                                placeholder="Ex: Alquimia Pay"
                                value={data.productName}
                                onChange={(e) => handleInputChange('productName', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-neutral-300">O Problema (A Dor)</label>
                            <textarea
                                className="w-full bg-base-black border border-neutral-700 rounded-xl p-4 text-white focus:border-neon focus:ring-1 focus:ring-neon transition-all outline-none h-24 resize-none"
                                placeholder="Qual problema específico estamos resolvendo? Por que as soluções atuais falham?"
                                value={data.problem}
                                onChange={(e) => handleInputChange('problem', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-neutral-300">Público-Alvo</label>
                            <input
                                type="text"
                                className="w-full bg-base-black border border-neutral-700 rounded-xl p-4 text-white focus:border-neon focus:ring-1 focus:ring-neon transition-all outline-none"
                                placeholder="Ex: Freelancers de Design Gráfico no Brasil"
                                value={data.targetAudience}
                                onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-neutral-300">Features Principais (Bullet Points)</label>
                            <textarea
                                className="w-full bg-base-black border border-neutral-700 rounded-xl p-4 text-white focus:border-neon focus:ring-1 focus:ring-neon transition-all outline-none h-32 resize-none"
                                placeholder="- Cadastro via Google&#10;- Dashboard financeiro&#10;- Geração de faturas em PDF"
                                value={data.coreFeatures}
                                onChange={(e) => handleInputChange('coreFeatures', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-neutral-300">Métricas de Sucesso (Opcional)</label>
                            <input
                                type="text"
                                className="w-full bg-base-black border border-neutral-700 rounded-xl p-4 text-white focus:border-neon focus:ring-1 focus:ring-neon transition-all outline-none"
                                placeholder="Ex: 1000 usuários ativos no primeiro mês"
                                value={data.successMetrics}
                                onChange={(e) => handleInputChange('successMetrics', e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        onClick={generatePerfectPrompt}
                        className="w-full bg-neon hover:bg-neon/90 text-black font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                    >
                        <Icons.Sparkles className="w-5 h-5" />
                        Gerar Prompt de PRD
                    </button>
                </div>

                {/* OUTPUT DISPLAY */}
                <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 relative flex flex-col h-full min-h-[600px]">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white">Prompt Gerado</h2>
                        <button
                            onClick={copyToClipboard}
                            disabled={!generatedPrompt}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${copied
                                ? 'bg-green-500 text-black'
                                : 'bg-neutral-800 text-white hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed'
                                }`}
                        >
                            {copied ? <Icons.Check className="w-4 h-4" /> : <Icons.Copy className="w-4 h-4" />}
                            {copied ? 'Copiado!' : 'Copiar'}
                        </button>
                    </div>

                    <div className="flex-1 bg-black rounded-xl p-6 overflow-y-auto custom-scrollbar border border-neutral-800 relative group">
                        {generatedPrompt ? (
                            <pre className="whitespace-pre-wrap text-neutral-300 font-mono text-sm leading-relaxed">
                                {generatedPrompt}
                            </pre>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-600 gap-4">
                                <Icons.FileText className="w-16 h-16 opacity-20" />
                                <p>Preencha os dados e clique em Gerar</p>
                            </div>
                        )}
                    </div>

                    <p className="mt-4 text-xs text-neutral-500 text-center">
                        Este prompt força a IA a adotar uma persona sênior, eliminando alucinações genéricas e focando em requisitos técnicos testáveis.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrdGenerator;
