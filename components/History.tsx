import React from 'react';
import { HistoryItem, AppMode, PromptResult, ReverseEngineeringResult, AdCampaignResult } from '../types';
import { Icons } from './Icons';

interface HistoryProps {
  history: HistoryItem[];
}

const History: React.FC<HistoryProps> = ({ history }) => {
  if (history.length === 0) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center text-neutral-600">
        <Icons.History className="w-16 h-16 mb-4 opacity-20" />
        <h2 className="text-2xl font-bold text-neutral-500">Sem Histórico</h2>
        <p className="text-neutral-600">Suas gerações aparecerão aqui.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-base-content mb-8 flex items-center gap-2">
        <Icons.History className="text-neon" /> Arquivo de Gerações
      </h2>

      <div className="grid gap-4">
        {history.slice().reverse().map((item) => (
          <div key={item.id} className="bg-base-card border border-base-border rounded-xl p-6 hover:border-neutral-600 transition-colors shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                {/* Fixed: Referencing AppMode.GENERATOR which is now defined in types.ts */}
                <div className={`p-2 rounded-lg ${item.mode === AppMode.GENERATOR ? 'bg-purple-900/30 text-purple-400' : 'bg-blue-900/30 text-blue-400'}`}>
                  {item.mode === AppMode.GENERATOR ? <Icons.Wand className="w-4 h-4" /> : <Icons.Aperture className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-base-content font-medium text-lg">
                    {item.input.startsWith('http') ? (
                      <div className="flex items-center gap-2">
                        <img src={item.input} alt="Reference" className="w-12 h-12 object-cover rounded-lg border border-neutral-700" />
                        <span className="text-sm text-neutral-400 italic">Imagem de Referência</span>
                      </div>
                    ) : (
                      item.input.length > 50 ? item.input.substring(0, 50) + '...' : item.input
                    )}
                  </h3>
                  <span className="text-xs text-neutral-500 font-mono">{new Date(item.timestamp).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="pl-0 md:pl-12">
              {/* Fixed: Improved the conditional rendering to handle different output shapes per mode */}
              {item.mode === AppMode.GENERATOR ? (
                <div className="space-y-3">
                  {(item.output as PromptResult[]).map((res: PromptResult, idx: number) => (
                    <div key={idx} className="bg-base-black border border-base-border rounded-lg p-3 group relative">
                      <div className="text-[10px] text-neutral-500 mb-1 font-mono uppercase flex justify-between">
                        <span>Variation {idx + 1}</span>
                        <button
                          onClick={() => navigator.clipboard.writeText(res.prompt)}
                          className="text-neon hover:text-white transition-colors"
                        >
                          Copy
                        </button>
                      </div>
                      <p className="text-xs text-neutral-300 font-mono leading-relaxed line-clamp-3 hover:line-clamp-none transition-all">
                        {res.prompt}
                      </p>
                    </div>
                  ))}
                </div>
              ) : item.mode === AppMode.REVERSE_ENGINEER ? (
                <div className="bg-base-black border border-base-border rounded-lg p-3">
                  <div className="text-[10px] text-neutral-500 mb-1 font-mono uppercase">Reverse Engineered DNA</div>
                  <p className="text-xs text-neutral-300 font-mono leading-relaxed line-clamp-4 hover:line-clamp-none transition-all">
                    {(item.output as ReverseEngineeringResult).detailedPrompt}
                  </p>
                </div>
              ) : item.mode === AppMode.PRODUCT_STUDIO ? (
                <div className="bg-base-black border border-base-border rounded-lg p-3">
                  <div className="text-[10px] text-neutral-500 mb-1 font-mono uppercase">Synthesized Style Prompt</div>
                  <p className="text-xs text-neutral-300 font-mono leading-relaxed line-clamp-4 hover:line-clamp-none transition-all">
                    {(item.output as any).prompt}
                  </p>
                </div>
              ) : item.mode === AppMode.AGENT_BUILDER ? (
                <div className="bg-base-black border border-base-border rounded-lg p-3">
                  <div className="text-[10px] text-neutral-500 mb-1 font-mono uppercase">Agent System Prompt</div>
                  <p className="text-xs text-neutral-300 font-mono leading-relaxed line-clamp-4 hover:line-clamp-none transition-all">
                    {item.output as string}
                  </p>
                </div>
              ) : item.mode === AppMode.SEQUENCER ? (
                <div className="bg-base-black border border-base-border rounded-lg p-3">
                  <div className="text-[10px] text-neutral-500 mb-1 font-mono uppercase">Storyboard: {(item.output as AdCampaignResult).projectTitle}</div>
                  <p className="text-xs text-neutral-300 font-mono leading-relaxed line-clamp-4 hover:line-clamp-none transition-all">
                    {(item.output as AdCampaignResult).logline}
                  </p>
                </div>
              ) : (
                <div className="bg-base-black border border-base-border rounded-lg p-3">
                  <p className="text-xs text-neutral-500 italic">Formato de saída não visualizável no histórico.</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;