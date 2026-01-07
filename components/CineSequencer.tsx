import React, { useState, useRef } from 'react';
import { generateAdCampaign } from '../services/geminiService';
import { creditService, COSTS } from '../services/creditService';
import { AdCampaignResult, AdScene } from '../types';
import { Icons } from './Icons';

interface CineSequencerProps {
    onSaveHistory: (input: string, output: any) => void;
}

const CineSequencer: React.FC<CineSequencerProps> = ({ onSaveHistory }) => {
    // --- STATE ---
    const [idea, setIdea] = useState('');
    const [style, setStyle] = useState('Cinematic High-End');
    const [category, setCategory] = useState<'FILM' | 'AD' | 'EDU'>('FILM');

    // Assets
    const [refImage, setRefImage] = useState<{ data: string, mimeType: string, preview: string } | null>(null);
    const refInputRef = useRef<HTMLInputElement>(null);

    // Results
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AdCampaignResult | null>(null);

    // UI
    const [statusText, setStatusText] = useState('');

    const handleRefFile = (file: File) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setRefImage({
                    data: result.split(',')[1],
                    mimeType: file.type,
                    preview: result
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerate = async () => {
        if (!idea.trim()) return;

        const hasCredits = await creditService.deductCredits(COSTS.SEQUENCER);
        if (!hasCredits) {
            alert("Créditos insuficientes! Por favor, recarregue sua conta.");
            return;
        }

        setLoading(true);
        setStatusText('CONTRATANDO EQUIPE DE FILMAGEM...');
        setResult(null);

        try {
            const steps = [
                'ESCREVENDO ROTEIRO...',
                'DEFININDOÂNGULOS DE CÂMERA...',
                'AJUSTANDO ILUMINAÇÃO...',
                'CRIANDO PROMPTS DE VÍDEO...',
                'FINALIZANDO STORYBOARD...'
            ];

            // Fake progress for UX
            for (const step of steps) {
                setStatusText(step);
                await new Promise(r => setTimeout(r, 600));
            }

            const data = await generateAdCampaign(
                idea,
                style,
                category,
                refImage ? { data: refImage.data, mimeType: refImage.mimeType } : null
            );

            if (data) {
                setResult(data);
                onSaveHistory(`Cine-Sequencer: ${data.projectTitle}`, data);
            } else {
                alert("Falha ao gerar sequência. Tente novamente.");
            }

        } catch (error) {
            console.error(error);
            alert("Erro no servidor. Tente novamente.");
        } finally {
            setLoading(false);
            setStatusText('');
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="w-full h-full flex flex-col bg-base-black animate-in fade-in duration-500 overflow-hidden">

            {/* HEADER */}
            <div className="h-16 px-6 border-b border-base-border flex items-center justify-between shrink-0 bg-base-black/50 backdrop-blur-sm z-20">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <Icons.Film className="text-white w-4 h-4" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-base-content leading-none tracking-tight">Cine-Sequencer</h2>
                        <span className="text-xs text-neutral-500 font-mono tracking-wider">DIRETOR DE FOTOGRAFIA IA</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-base-dark border border-neutral-800 rounded-full">
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">OUTPUT: IMAGE + VIDEO</span>
                </div>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">

                {/* LEFT: CONTROLS */}
                <div className="lg:w-1/3 xl:w-1/4 border-r border-base-border overflow-y-auto custom-scrollbar p-6 space-y-6 bg-base-black">

                    {/* INPUTS */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-2">Ideia do Filme / Roteiro</label>
                            <textarea
                                value={idea}
                                onChange={(e) => setIdea(e.target.value)}
                                placeholder="Um detetive cyberpunk andando na chuva neon, encontra um robô..."
                                className="w-full h-32 bg-base-dark border border-base-border rounded-xl p-3 text-sm text-white focus:border-neon outline-none resize-none placeholder:text-neutral-600"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-2">Estilo Visual</label>
                            <input
                                type="text"
                                value={style}
                                onChange={(e) => setStyle(e.target.value)}
                                className="w-full bg-base-dark border border-base-border rounded-xl p-3 text-sm text-white focus:border-neon outline-none"
                            />
                            <div className="flex flex-wrap gap-2 mt-2">
                                {['Cinematic', 'Noir', 'Sci-Fi', 'Anime', 'Documentary'].map(s => (
                                    <button key={s} onClick={() => setStyle(s)} className="text-[10px] bg-neutral-800 px-2 py-1 rounded hover:bg-white hover:text-black transition-colors">{s}</button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-2">Categoria</label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['FILM', 'AD', 'EDU'] as const).map(c => (
                                    <button
                                        key={c}
                                        onClick={() => setCategory(c)}
                                        className={`py-2 rounded-lg text-xs font-bold transition-all ${category === c ? 'bg-white text-black' : 'bg-base-dark text-neutral-500 hover:text-white'}`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* REFERENCE IMAGE */}
                    <div className="space-y-2 pt-4 border-t border-neutral-800">
                        <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center justify-between">
                            <span>Referência de Personagem/Estilo</span>
                            {refImage && <button onClick={() => setRefImage(null)} className="text-red-500 hover:underline">Remover</button>}
                        </label>

                        <div
                            onClick={() => refInputRef.current?.click()}
                            className={`
                                w-full h-40 rounded-xl border-dashed border-2 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative transition-all
                                ${refImage ? 'border-neon' : 'border-neutral-800 hover:border-neutral-600 bg-base-dark'}
                            `}
                        >
                            {refImage ? (
                                <img src={refImage.preview} className="w-full h-full object-cover opacity-80" />
                            ) : (
                                <div className="text-center p-4">
                                    <Icons.ImagePlus className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                                    <span className="text-[10px] text-neutral-500 block">Clique para manter consistência</span>
                                </div>
                            )}
                        </div>
                        <input type="file" ref={refInputRef} onChange={(e) => e.target.files && handleRefFile(e.target.files[0])} className="hidden" accept="image/*" />
                        <p className="text-[10px] text-neutral-600">A IA tentará manter o personagem ou estilo desta imagem em TODAS as cenas geradas.</p>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading || !idea}
                        className={`
                            w-full py-4 rounded-xl font-bold text-sm tracking-wider shadow-lg transition-all flex items-center justify-center gap-2
                            ${loading || !idea ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:scale-[1.02] hover:shadow-purple-500/25'}
                        `}
                    >
                        {loading ? <Icons.Loader className="animate-spin w-4 h-4" /> : <Icons.Clapperboard className="w-4 h-4" />}
                        {loading ? statusText : 'GERAR STORYBOARD'}
                    </button>

                </div>

                {/* RIGHT: RESULTS */}
                <div className="flex-1 bg-base-dark p-6 overflow-y-auto custom-scrollbar relative">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-base-black to-base-black pointer-events-none"></div>

                    {!result && !loading && (
                        <div className="h-full flex flex-col items-center justify-center opacity-20 space-y-4">
                            <Icons.Film className="w-24 h-24 text-neutral-600" />
                            <h3 className="text-xl font-bold text-neutral-500">Aguardando Direção</h3>
                        </div>
                    )}

                    {result && (
                        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">

                            {/* TITLE CARD */}
                            <div className="text-center space-y-2 mb-10">
                                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">{result.projectTitle}</h1>
                                <p className="text-xl text-neutral-400 font-light italic">"{result.logline}"</p>
                                <span className="inline-block bg-neutral-800 px-3 py-1 rounded-full text-xs font-mono text-neutral-500 border border-neutral-700 mt-4">{result.visualStyle}</span>
                            </div>

                            {/* SCENES */}
                            <div className="grid gap-12">
                                {result.scenes.map((scene, idx) => (
                                    <div key={idx} className="group relative bg-black/40 border border-neutral-800 rounded-3xl overflow-hidden hover:border-purple-500/50 transition-all duration-300">

                                        {/* Scene Header */}
                                        <div className="bg-neutral-900/50 px-6 py-4 flex items-center justify-between border-b border-neutral-800">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-black text-lg shadow-lg shadow-white/10">
                                                    {scene.sceneNumber}
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-bold text-lg">{scene.type}</h3>
                                                    <span className="text-xs text-neutral-500 font-mono">{scene.shotType} • {scene.duration}</span>
                                                </div>
                                            </div>
                                            <div className="text-right hidden sm:block">
                                                <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">Câmera & Luz</div>
                                                <div className="text-xs text-purple-300">{scene.cameraGear} | {scene.lighting}</div>
                                            </div>
                                        </div>

                                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">

                                            {/* Narrative */}
                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-neutral-500 uppercase flex items-center gap-2">
                                                        <Icons.AlignLeft className="w-3 h-3" /> Narrativa Visual
                                                    </label>
                                                    <p className="text-neutral-300 leading-relaxed text-sm border-l-2 border-purple-500/30 pl-4 py-1">
                                                        {scene.description}
                                                    </p>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-neutral-500 uppercase flex items-center gap-2">
                                                        <Icons.Volume2 className="w-3 h-3" /> Áudio & Som
                                                    </label>
                                                    <p className="text-neutral-400 text-xs italic bg-neutral-900/50 p-3 rounded-lg border border-neutral-800/50">
                                                        {scene.audioCues}
                                                    </p>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-neutral-500 uppercase flex items-center gap-2">
                                                        <Icons.ArrowRight className="w-3 h-3" /> Transição
                                                    </label>
                                                    <span className="text-xs text-neutral-400 bg-neutral-900 px-2 py-1 rounded inline-block">
                                                        {scene.transition}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Prompts Action Area */}
                                            <div className="space-y-4 bg-neutral-900/30 p-4 rounded-2xl border border-neutral-800/50">

                                                {/* IMAGE PROMPT */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-[10px] font-bold text-green-400 uppercase flex items-center gap-1">
                                                            <Icons.Image className="w-3 h-3" /> Prompt de Imagem (Midjourney/Flux)
                                                        </label>
                                                        <button onClick={() => copyToClipboard(scene.imagePrompt)} className="text-[10px] bg-green-900/30 text-green-400 px-2 py-1 rounded hover:bg-green-400 hover:text-black transition-colors font-bold flex items-center gap-1">
                                                            <Icons.Copy className="w-3 h-3" /> COPIAR
                                                        </button>
                                                    </div>
                                                    <div className="bg-black/50 p-3 rounded-lg border border-white/5 h-24 overflow-y-auto custom-scrollbar">
                                                        <p className="text-[10px] font-mono text-neutral-400">{scene.imagePrompt}</p>
                                                    </div>
                                                </div>

                                                {/* VIDEO PROMPT */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-[10px] font-bold text-blue-400 uppercase flex items-center gap-1">
                                                            <Icons.Video className="w-3 h-3" /> Prompt de Vídeo (Runway/Kling)
                                                        </label>
                                                        <button onClick={() => copyToClipboard(scene.videoPrompt)} className="text-[10px] bg-blue-900/30 text-blue-400 px-2 py-1 rounded hover:bg-blue-400 hover:text-black transition-colors font-bold flex items-center gap-1">
                                                            <Icons.Copy className="w-3 h-3" /> COPIAR
                                                        </button>
                                                    </div>
                                                    <div className="bg-black/50 p-3 rounded-lg border border-white/5 h-24 overflow-y-auto custom-scrollbar">
                                                        <p className="text-[10px] font-mono text-neutral-400">{scene.videoPrompt}</p>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CineSequencer;
