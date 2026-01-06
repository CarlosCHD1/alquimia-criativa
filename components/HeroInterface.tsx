import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';

export const HeroInterface: React.FC = () => {
    const [typedText, setTypedText] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedPrompts, setGeneratedPrompts] = useState<string[]>([]);

    // Animation phases: 'typing' | 'generating' | 'display' | 'reset'
    const [phase, setPhase] = useState<'typing' | 'generating' | 'display' | 'reset'>('typing');

    const CONCEPT = "Um astronauta solitário explorando as ruínas de uma cidade cyberpunk inundada, reflexos de neon na água, atmosfera melancólica e cinematográfica...";

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        if (phase === 'typing') {
            if (typedText.length < CONCEPT.length) {
                timeout = setTimeout(() => {
                    setTypedText(CONCEPT.slice(0, typedText.length + 1));
                }, 50); // Typing speed
            } else {
                timeout = setTimeout(() => setPhase('generating'), 1000);
            }
        } else if (phase === 'generating') {
            setIsGenerating(true);
            timeout = setTimeout(() => {
                setIsGenerating(false);
                setPhase('display');
                setGeneratedPrompts([
                    "/imagine prompt: cinematic shot of a lonely astronaut in flooded cyberpunk ruins, water reflections, neon lights, gloom, 8k, unreal engine 5 --ar 16:9 --v 6.0",
                    "technical composition: rule of thirds, low angle shot, anamorphic lens flare, volumetric fog, ray tracing, iso 100, f/1.8",
                    "mood: melancholic, dystopian, isolation, blade runner style, wet texture, hyperrealistic details"
                ]);
            }, 1500); // Generation delay
        } else if (phase === 'display') {
            timeout = setTimeout(() => {
                setPhase('reset');
            }, 5000); // Display duration
        } else if (phase === 'reset') {
            setTypedText('');
            setGeneratedPrompts([]);
            setPhase('typing');
        }

        return () => clearTimeout(timeout);
    }, [typedText, phase]);

    return (
        <div className="w-full h-full bg-[#050505] flex select-none overflow-hidden rounded-b-3xl">
            {/* LEFT SIDEBAR - CONTROLS */}
            <div className="w-[32%] border-r border-white/5 bg-[#080808] p-4 flex flex-col gap-6 overflow-hidden relative">

                {/* Branding */}
                <div className="flex items-center gap-2 mb-2">
                    <Icons.Zap className="w-4 h-4 text-neon" />
                    <span className="font-bold text-sm text-white tracking-wide">Alquimia Forge</span>
                </div>

                {/* TIPO DE MÍDIA */}
                <div className="space-y-2">
                    <label className="text-[10px] font-mono text-neon uppercase tracking-widest">Tipo de Mídia</label>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-neon text-black text-[10px] font-bold p-2 rounded flex flex-col items-center justify-center gap-1 border border-neon shadow-[0_0_10px_rgba(255,95,0,0.3)]">
                            <Icons.Image className="w-4 h-4" />
                            Imagem
                        </div>
                        <div className="bg-[#111] text-neutral-500 text-[10px] font-medium p-2 rounded flex flex-col items-center justify-center gap-1 border border-white/5">
                            <Icons.Video className="w-4 h-4" />
                            Video
                        </div>
                        <div className="bg-[#111] text-neutral-500 text-[10px] font-medium p-2 rounded flex flex-col items-center justify-center gap-1 border border-white/5">
                            <Icons.Box className="w-4 h-4" />
                            Asset 3D
                        </div>
                        <div className="bg-[#111] text-neutral-500 text-[10px] font-medium p-2 rounded flex flex-col items-center justify-center gap-1 border border-white/5">
                            <Icons.Layout className="w-4 h-4" />
                            Textura
                        </div>
                    </div>
                </div>

                {/* ESTILO ARTÍSTICO */}
                <div className="space-y-2">
                    <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">Estilo Artístico</label>
                    <div className="bg-[#0A0A0A] border border-white/5 rounded p-2 text-[11px] text-neutral-300 font-mono flex items-center justify-between">
                        <span>Cyberpunk, Cinematic...</span>
                    </div>
                </div>

                {/* TOM CRIATIVO */}
                <div className="space-y-2">
                    <label className="text-[10px] font-mono text-neon uppercase tracking-widest">Tom Criativo</label>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-neon text-black text-[10px] font-bold py-1.5 px-2 rounded text-center">Cinematic</div>
                        <div className="bg-[#111] text-neutral-500 text-[10px] font-medium py-1.5 px-2 rounded text-center border border-white/5">Photorealistic</div>
                        <div className="bg-[#111] text-neutral-500 text-[10px] font-medium py-1.5 px-2 rounded text-center border border-white/5">Artistic</div>
                        <div className="bg-[#111] text-neutral-500 text-[10px] font-medium py-1.5 px-2 rounded text-center border border-white/5">Surreal</div>
                    </div>
                </div>

                {/* SLIDERS */}
                <div className="mt-auto space-y-4 pt-4 border-t border-white/5">
                    <div className="space-y-2">
                        <div className="flex justify-between text-[9px] uppercase tracking-wider text-neutral-400">
                            <span>Direção de Composição</span>
                            <span className="bg-white/10 px-1 rounded text-white">16:9</span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="w-3/4 h-full bg-neutral-600"></div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-[9px] uppercase tracking-wider text-neon">
                            <span>Ângulo</span>
                            <span>Nível dos Olhos</span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden relative">
                            <div className="w-1/2 h-full bg-neon"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-y-1/2 w-2 h-2 bg-neon rounded-full shadow-[0_0_5px_#FF5F00]"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT - WORKSPACE */}
            <div className="flex-1 bg-[#050505] p-6 flex flex-col relative w-[68%]">
                {/* GRID BACKGROUND */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

                <div className="relative z-10 flex flex-col h-full gap-4">
                    <label className="text-[10px] font-mono text-neon uppercase tracking-widest mb-1 block">Conceito Base</label>

                    {/* INPUT AREA */}
                    <div className="flex-1 bg-[#0A0A0A] border border-white/5 rounded-xl p-4 font-mono text-sm leading-relaxed text-neutral-300 shadow-inner relative overflow-hidden group">
                        {/* Text typing */}
                        <span className="text-white/80">{typedText}</span>
                        {phase === 'typing' && <span className="inline-block w-2 H-4 bg-neon ml-1 animate-pulse align-middle">|</span>}

                        {/* Placeholder if empty */}
                        {typedText === '' && <span className="text-neutral-700 italic">Descreva sua ideia de forma simples...</span>}

                        {/* GENERATED CONTENT OVERLAY */}
                        {(phase === 'display' || isGenerating) && (
                            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm z-20 p-6 transition-opacity duration-500 overflow-hidden">
                                {isGenerating ? (
                                    <div className="h-full flex flex-col items-center justify-center gap-4">
                                        <div className="relative w-16 h-16">
                                            <div className="absolute inset-0 border-t-2 border-neon rounded-full animate-spin"></div>
                                            <div className="absolute inset-2 border-r-2 border-white/20 rounded-full animate-spin reverse"></div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Icons.Sparkles className="w-6 h-6 text-neon animate-pulse" />
                                            </div>
                                        </div>
                                        <div className="text-neon font-mono text-xs tracking-widest uppercase animate-pulse">Forjando Prompts...</div>
                                    </div>
                                ) : (
                                    <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-700">
                                        <div className="flex items-center gap-2 text-neon text-xs uppercase tracking-widest font-bold mb-4">
                                            <Icons.Check className="w-4 h-4" />
                                            Prompts Forjados com Sucesso
                                        </div>
                                        <div className="space-y-3">
                                            {generatedPrompts.map((prompt, i) => (
                                                <div key={i} className="bg-white/5 border border-white/10 p-3 rounded-lg text-[11px] font-mono text-green-400/90 leading-relaxed border-l-2 border-l-neon/50">
                                                    <span className="text-white/30 mr-2 select-none">0{i + 1}</span>
                                                    {prompt}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* BOTTOM SECTION */}
                    <div className="mt-auto space-y-4">
                        {/* DNA DO ESTILO */}
                        <div className="flex gap-4">
                            <div className="w-16 h-16 bg-[#0E0E0E] rounded-lg border border-white/5 border-dashed flex flex-col items-center justify-center text-neutral-600 gap-1">
                                <Icons.ImagePlus className="w-4 h-4" />
                                <span className="text-[8px] uppercase">Ref.</span>
                            </div>
                            <div className="flex-1 space-y-2">
                                <label className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                                    <Icons.ScanLine className="w-3 h-3" /> DNA do Estilo
                                </label>
                                <div className="h-9 bg-[#0A0A0A] border border-white/5 rounded flex items-center px-3 text-[10px] text-neutral-600 italic">
                                    Suba uma imagem para extrair estilo...
                                </div>
                            </div>
                        </div>

                        {/* ACTION BUTTON */}
                        <button
                            className={`w-full py-4 rounded-lg font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)]
                                ${phase === 'generating'
                                    ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                                    : 'bg-white/5 hover:bg-neon hover:text-black text-white border border-white/10 hover:border-neon hover:shadow-[0_0_30px_rgba(255,95,0,0.4)]'}
                            `}
                        >
                            <Icons.Wand className={`w-4 h-4 ${phase === 'generating' ? 'animate-spin' : ''}`} />
                            Forjar Prompts
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
