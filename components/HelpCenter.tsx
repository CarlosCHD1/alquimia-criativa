
import React, { useState } from 'react';
import { Icons } from './Icons';

const HelpCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'TUTORIALS' | 'TIPS' | 'CONFIG'>('TUTORIALS');

  const tutorials = [
    {
      title: 'Engenharia Reversa Visual',
      desc: 'Como transformar qualquer imagem em um blueprint técnico de prompt.',
      steps: [
        'Faça upload de uma imagem de referência no menu "Engenharia Reversa".',
        'Use o campo "Foco da Análise" para pedir detalhes específicos (ex: apenas a luz).',
        'Analise a aba "Anatomia" para entender quais tokens criaram aquele efeito.',
        'Copie o "Prompt Otimizado" e leve-o para o Gerador para criar variações.'
      ],
      icon: Icons.Aperture
    },
    {
      title: 'Laboratório de Branding',
      desc: 'Sintetizando o DNA de uma marca em mockups realistas.',
      steps: [
        'Suba o seu logo original no Laboratório Criativo.',
        'Suba uma imagem de matriz (ex: uma foto de bar de luxo) para extrair o clima.',
        'Selecione as cores da paleta na seção 3.',
        'O motor IA vai ignorar o texto da matriz e inserir seu logo organicamente na cena.'
      ],
      icon: Icons.Briefcase
    },
    {
      title: 'Sequenciador Narrativo',
      desc: 'Criando roteiros consistentes para Runway ou Luma.',
      steps: [
        'Descreva o conceito geral do comercial ou curta-metragem.',
        'Escolha um estilo visual pré-definido (ex: Cyberpunk Noir).',
        'A IA gerará 6 cenas com prompts de Imagem (base) e Vídeo (movimento).',
        'Copie os prompts de vídeo e use em ferramentas de animação para manter a continuidade.'
      ],
      icon: Icons.Film
    }
  ];

  const quickTips = [
    {
      tag: 'ILUMINAÇÃO',
      title: 'Tokens de Volumetria',
      content: 'Use "God rays", "Volumetric fog" e "Tyndall effect" para criar feixes de luz dramáticos em cenas escuras.',
      color: 'text-orange-400'
    },
    {
      tag: 'CÂMERA',
      title: 'Abertura de Lente',
      content: 'Para fundos desfocados profissionais, adicione "f/1.8 aperture" ou "bokeh" ao final do prompt de sujeito.',
      color: 'text-blue-400'
    },
    {
      tag: 'REALISMO',
      title: 'Micro-Detalhes',
      content: 'Tokens como "surface imperfections", "dust particles" e "film grain" removem o aspecto plástico da IA.',
      color: 'text-green-400'
    },
    {
      tag: 'COMPOSIÇÃO',
      title: 'Regra dos Terços',
      content: 'Adicione "rule of thirds composition" ou "asymmetric balance" para evitar que o sujeito fique sempre centralizado.',
      color: 'text-purple-400'
    }
  ];

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-500 pb-20">

      {/* HEADER */}
      <div className="border-b border-base-border pb-8">
        <h2 className="text-4xl font-bold text-base-content flex items-center gap-4">
          <Icons.GraduationCap className="text-neon w-10 h-10" />
          Central de Inteligência
        </h2>
        <p className="text-neutral-500 mt-2 text-lg">Manuais, diagnósticos e técnicas avançadas para forjar o impossível.</p>
      </div>

      {/* TABS */}
      <div className="flex bg-base-card p-1.5 rounded-2xl border border-base-border w-fit">
        {[
          { id: 'TUTORIALS', label: 'Tutoriais Guiados', icon: Icons.ListVideo },
          { id: 'TIPS', label: 'Cofre de Dicas', icon: Icons.Zap },
          { id: 'CONFIG', label: 'Status do Sistema', icon: Icons.Terminal },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all
              ${activeTab === tab.id
                ? 'bg-neon text-black shadow-lg shadow-neon/20'
                : 'text-neutral-500 hover:text-base-content hover:bg-base-dark'}
            `}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* CONTENT: TUTORIALS */}
      {activeTab === 'TUTORIALS' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4">
          {tutorials.map((tut, i) => (
            <div key={i} className="bg-base-card border border-base-border rounded-2xl overflow-hidden group hover:border-neon/50 transition-all flex flex-col">
              <div className="p-6 border-b border-neutral-800 bg-neutral-900/30">
                <tut.icon className="w-8 h-8 text-neon mb-4" />
                <h3 className="text-xl font-bold text-base-content">{tut.title}</h3>
                <p className="text-sm text-neutral-500 mt-2">{tut.desc}</p>
              </div>
              <div className="p-6 space-y-4 flex-1">
                {tut.steps.map((step, si) => (
                  <div key={si} className="flex gap-3">
                    <span className="text-xs font-mono text-neon bg-neon/10 w-5 h-5 rounded-full flex items-center justify-center shrink-0 border border-neon/20">{si + 1}</span>
                    <p className="text-xs text-neutral-400 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CONTENT: TIPS */}
      {activeTab === 'TIPS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in slide-in-from-bottom-4">
          {quickTips.map((tip, i) => (
            <div key={i} className="bg-base-black border border-neutral-800 p-6 rounded-2xl hover:border-neon/30 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
                <Icons.Sparkles className={`w-10 h-10 ${tip.color}`} />
              </div>
              <span className={`text-[10px] font-bold ${tip.color} tracking-widest uppercase mb-2 block`}>{tip.tag}</span>
              <h4 className="text-base-content font-bold mb-3">{tip.title}</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">{tip.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* CONTENT: CONFIG */}
      {activeTab === 'CONFIG' && (
        <div className="bg-base-card border border-base-border rounded-2xl p-8 animate-in slide-in-from-bottom-4 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
                <Icons.ScanLine className="text-neon" /> Diagnóstico de Conexão
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-neutral-800">
                  <span className="text-xs text-neutral-500 font-mono">API_KEY_STATUS</span>
                  <span className="text-xs text-green-500 font-mono font-bold flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    CONNECTED
                  </span>
                </div>
                <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-neutral-800">
                  <span className="text-xs text-neutral-500 font-mono">CORE_ENGINE</span>
                  <span className="text-xs text-neon font-mono font-bold">GEMINI-3-PRO-PREVIEW</span>
                </div>
                <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-neutral-800">
                  <span className="text-xs text-neutral-500 font-mono">VISION_MODULE</span>
                  <span className="text-xs text-neon font-mono font-bold">FLASH-VISION-ACTIVE</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
                <Icons.Help className="text-neon" /> Precisa de Suporte?
              </h3>
              <div className="bg-neon/5 border border-neon/20 rounded-xl p-5 space-y-4">
                <p className="text-xs text-neutral-400 leading-relaxed">
                  O **NeonForge** é uma ferramenta experimental de engenharia de prompt. Se encontrar falhas na análise de imagem ou gerações inconsistentes, tente limpar seu histórico.
                </p>
                <div className="flex gap-3">
                  <button className="flex-1 py-2 bg-neon text-black rounded-lg text-xs font-bold hover:bg-neon-light transition-colors">Abrir FAQ Técnico</button>
                  <button className="flex-1 py-2 bg-neutral-800 text-white rounded-lg text-xs font-bold hover:bg-neutral-700 transition-colors">Relatar Bug</button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-800">
            <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4">Notas da Versão v1.3.5</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
              <li className="text-[10px] text-neutral-600 flex items-center gap-2"><div className="w-1 h-1 bg-neon"></div> Suporte a imagens de referência 4K no Laboratório.</li>
              <li className="text-[10px] text-neutral-600 flex items-center gap-2"><div className="w-1 h-1 bg-neon"></div> Novo motor de síntese de iluminação para vídeo.</li>
              <li className="text-[10px] text-neutral-600 flex items-center gap-2"><div className="w-1 h-1 bg-neon"></div> Otimização de latência na engenharia reversa.</li>
              <li className="text-[10px] text-neutral-600 flex items-center gap-2"><div className="w-1 h-1 bg-neon"></div> Implementação da Central de Ajuda interativa.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpCenter;
