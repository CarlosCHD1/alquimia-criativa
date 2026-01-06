
import React, { useState } from 'react';
import { generateAdCampaign } from '../services/geminiService';
import { creditService, COSTS } from '../services/creditService';
import { AdCampaignResult } from '../types';
import { Icons } from './Icons';

interface SequencerProps {
    onSaveHistory: (input: string, output: AdCampaignResult, imageBase64?: string) => void;
}

const Sequencer: React.FC<SequencerProps> = ({ onSaveHistory }) => {
    const [productInput, setProductInput] = useState('');
    const [styleInput, setStyleInput] = useState('High-End Commercial, Cinematic Lighting, 8k');
    const [videoCategory, setVideoCategory] = useState<'FILM' | 'AD' | 'EDU'>('FILM');
    const [loading, setLoading] = useState(false);
    const [campaign, setCampaign] = useState<AdCampaignResult | null>(null);
    const [refImage, setRefImage] = useState<{ data: string, mimeType: string, preview: string } | null>(null);

    const styles = [
        "Cyberpunk Neon Noir", "Luxury Minimalist", "Documentary Handheld",
        "Wes Anderson Symmetry", "Dark Moody HBO", "High Energy Sports", "Ethereal Dreamy"
    ];

    const handleGenerate = async () => {
        if (!productInput.trim()) return;

        const hasCredits = await creditService.deductCredits(COSTS.SEQUENCER);
        if (!hasCredits) {
            alert("Créditos insuficientes! Por favor, recarregue sua conta.");
            return;
        }

        setLoading(true);
        setCampaign(null);
        try {
            // @ts-ignore
            const result = await generateAdCampaign(productInput, styleInput, videoCategory, refImage);
            if (result) {
                setCampaign(result);
                onSaveHistory(productInput, result);
            }
        } catch (e) {
            console.error(e);
            alert("Erro ao gerar roteiro cinematográfico.");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const copyAllPrompts = (type: 'IMAGE' | 'VIDEO') => {
        if (!campaign) return;
        const allPrompts = campaign.scenes.map((scene, idx) =>
            `[SCENE ${scene.sceneNumber} - ${scene.type}]: ${type === 'IMAGE' ? scene.imagePrompt : scene.videoPrompt}`
        ).join('\n\n');
        copyToClipboard(allPrompts);
        alert(`Todos os prompts de ${type} copiados para o clipboard!`);
    };

    return (
        <div className="w-full h-full flex flex-col bg-base-black animate-in fade-in duration-500 overflow-hidden">

            {/* HEADER - STANDARDIZED */}
            <div className="h-16 px-6 border-b border-base-border flex items-center justify-between shrink-0 bg-base-black/50 backdrop-blur-sm z-20">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-neon to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-neon/20">
                        <Icons.Clapperboard className="text-black w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-base-content leading-none tracking-tight">Cine-Sequenciador</h2>
                        <span className="text-xs text-neutral-500 font-mono tracking-wider">ROTEIROS & STORYBOARDS</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-full">
                    <span className="flex h-2 w-2 rounded-full bg-neon animate-pulse"></span>
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">{videoCategory} MODE</span>
                </div>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">

                {/* LEFT: DIRECTOR'S CONTROLS */}
                <div className="lg:w-1/3 border-r border-base-border overflow-y-auto custom-scrollbar p-6 space-y-6 bg-base-black relative">

                    <div className="bg-base-card rounded-2xl border border-base-border p-5 shadow-lg space-y-5">

                        {/* Video Category Selector */}
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase text-neutral-500 font-bold tracking-wider flex items-center gap-2">
                                <Icons.Monitor className="w-4 h-4 text-neon" />
                                Formato de Vídeo
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { id: 'FILM', label: 'FILME' },
                                    { id: 'AD', label: 'PUBLICIDADE' },
                                    { id: 'EDU', label: 'EDUCAÇÃO' },
                                ].map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setVideoCategory(cat.id as any)}
                                        className={`text-[10px] py-2 rounded-lg border font-bold transition-all ${videoCategory === cat.id ? 'bg-neon text-black border-neon' : 'bg-black border-neutral-800 text-neutral-500 hover:text-white'}`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase text-neutral-500 font-bold tracking-wider flex items-center gap-2">
                                <Icons.Box className="w-4 h-4 text-neon" />
                                Conceito / Sinopse
                            </label>
                            <textarea
                                value={productInput}
                                onChange={(e) => setProductInput(e.target.value)}
                                placeholder="Ex: Comercial de um Whisky envelhecido, ambiente de bar jazz esfumaçado..."
                                className="w-full bg-base-black border border-neutral-800 rounded-xl p-3 text-sm text-base-content focus:border-neon focus:outline-none min-h-[120px] resize-none font-sans custom-scrollbar"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase text-neutral-500 font-bold tracking-wider flex items-center gap-2">
                                <Icons.Aperture className="w-4 h-4 text-neon" />
                                Estética & Direção
                            </label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {styles.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setStyleInput(s)}
                                        className={`text-[9px] px-2 py-1 rounded border transition-colors ${styleInput === s ? 'bg-neon text-black border-neon' : 'bg-black border-neutral-800 text-neutral-500 hover:text-white'}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                            <input
                                value={styleInput}
                                onChange={(e) => setStyleInput(e.target.value)}
                                placeholder="Estilo visual personalizado..."
                                className="w-full bg-base-black border border-neutral-800 rounded-lg p-2 text-xs text-base-content focus:border-neon focus:outline-none font-mono"
                            />
                        </div>

                        {/* REFERENCE IMAGE UPLOAD */}
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase text-neutral-500 font-bold tracking-wider flex items-center gap-2">
                                <Icons.Image className="w-4 h-4 text-neon" />
                                Referência (Personagem / Estilo)
                            </label>

                            {!refImage ? (
                                <label className="flex flex-col items-center justify-center w-full h-24 border border-dashed border-neutral-800 rounded-xl cursor-pointer hover:border-neon hover:bg-neutral-900/50 transition-all group">
                                    <Icons.Upload className="w-5 h-5 text-neutral-600 group-hover:text-neon mb-1" />
                                    <span className="text-[9px] text-neutral-500 font-mono">Upload Imagem Base</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = (ev) => {
                                                    const result = ev.target?.result as string;
                                                    setRefImage({
                                                        data: result.split(',')[1],
                                                        mimeType: file.type,
                                                        preview: result
                                                    });
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </label>
                            ) : (
                                <div className="relative w-full h-32 rounded-xl overflow-hidden border border-neon group">
                                    <img src={refImage.preview} alt="Ref" className="w-full h-full object-cover opacity-80" />
                                    <button
                                        onClick={() => setRefImage(null)}
                                        className="absolute top-2 right-2 p-1.5 bg-black/80 hover:bg-red-900/80 rounded-full text-white transition-colors"
                                    >
                                        <Icons.Trash className="w-3 h-3" />
                                    </button>
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-1.5 text-center">
                                        <span className="text-[9px] text-neon font-bold uppercase">Referência Ativa</span>
                                    </div>
                                </div>
                            )}
                        </div>



                        <button
                            onClick={handleGenerate}
                            disabled={loading || !productInput.trim()}
                            className={`
                          w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all
                          ${loading || !productInput.trim()
                                    ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                                    : 'bg-neon hover:bg-neon-light text-black shadow-[0_0_20px_rgba(255,95,0,0.3)]'}
                      `}
                        >
                            {loading ? <Icons.ScanLine className="animate-spin" /> : <Icons.Video />}
                            {loading ? 'ROTEIRIZANDO...' : 'ACTION! (GERAR 6 CENAS)'}
                        </button>
                    </div>

                    {campaign && (
                        <div className="bg-base-card border border-base-border rounded-xl p-4 space-y-4">
                            <h4 className="text-xs font-bold text-neutral-500 uppercase">Exportação em Lote</h4>
                            <button
                                onClick={() => copyAllPrompts('IMAGE')}
                                className="w-full py-2 bg-neutral-800 hover:bg-blue-900/30 hover:text-blue-400 text-neutral-300 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                            >
                                <Icons.Image className="w-4 h-4" /> Copiar Todos (Midjourney)
                            </button>
                            <button
                                onClick={() => copyAllPrompts('VIDEO')}
                                className="w-full py-2 bg-neutral-800 hover:bg-red-900/30 hover:text-red-400 text-neutral-300 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                            >
                                <Icons.Film className="w-4 h-4" /> Copiar Todos (Runway)
                            </button>
                        </div>
                    )}
                </div>

                {/* RIGHT: TIMELINE / STORYBOARD */}
                <div className="flex-1 bg-base-dark p-6 overflow-y-auto custom-scrollbar relative">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-neon/5 via-transparent to-transparent pointer-events-none"></div>

                    {campaign ? (
                        <div className="space-y-6 max-w-5xl mx-auto">
                            {/* Project Header */}
                            <div className="bg-gradient-to-r from-base-dark to-base-black border border-neutral-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-white tracking-tight">{campaign.projectTitle}</h3>
                                    <p className="text-sm text-neutral-400 font-mono mt-1">LOGLINE: {campaign.logline}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] text-neutral-500 font-bold uppercase">Visual Style</div>
                                    <div className="text-neon text-xs font-mono">{campaign.visualStyle}</div>
                                </div>
                            </div>

                            {/* Timeline Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                                {campaign.scenes.map((scene, idx) => (
                                    <div key={idx} className="group relative bg-black border border-neutral-800 rounded-xl overflow-hidden hover:border-neon/50 transition-all flex flex-col h-full shadow-lg">

                                        {/* Header Strip */}
                                        <div className="bg-neutral-900/80 p-3 flex justify-between items-center border-b border-neutral-800">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-neon text-black font-bold text-xs flex items-center justify-center">
                                                    {scene.sceneNumber}
                                                </div>
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${scene.type === 'TEASER' ? 'bg-purple-900/20 text-purple-400 border-purple-500/30' :
                                                    scene.type === 'ACTION' ? 'bg-red-900/20 text-red-400 border-red-500/30' :
                                                        scene.type === 'CLIMAX' ? 'bg-yellow-900/20 text-yellow-400 border-yellow-500/30' :
                                                            'bg-blue-900/20 text-blue-400 border-blue-500/30'
                                                    }`}>
                                                    {scene.type}
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-mono text-neutral-500">{scene.duration}</span>
                                        </div>

                                        {/* Director's Notes */}
                                        <div className="p-4 flex-1 space-y-4">
                                            <p className="text-xs text-neutral-300 italic">"{scene.description}"</p>

                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="bg-neutral-900 rounded p-2 border border-neutral-800">
                                                    <div className="text-[8px] text-neutral-500 uppercase font-bold mb-1 flex items-center gap-1"><Icons.Camera className="w-3 h-3" /> Shot</div>
                                                    <div className="text-[10px] text-white truncate" title={scene.shotType}>{scene.shotType}</div>
                                                </div>
                                                <div className="bg-neutral-900 rounded p-2 border border-neutral-800">
                                                    <div className="text-[8px] text-neutral-500 uppercase font-bold mb-1 flex items-center gap-1"><Icons.Aperture className="w-3 h-3" /> Lens</div>
                                                    <div className="text-[10px] text-white truncate" title={scene.cameraGear}>{scene.cameraGear}</div>
                                                </div>
                                                <div className="bg-neutral-900 rounded p-2 border border-neutral-800">
                                                    <div className="text-[8px] text-neutral-500 uppercase font-bold mb-1 flex items-center gap-1"><Icons.Sun className="w-3 h-3" /> Light</div>
                                                    <div className="text-[10px] text-white truncate" title={scene.lighting}>{scene.lighting}</div>
                                                </div>
                                                <div className="bg-neutral-900 rounded p-2 border border-neutral-800">
                                                    <div className="text-[8px] text-neutral-500 uppercase font-bold mb-1 flex items-center gap-1"><Icons.ArrowRight className="w-3 h-3" /> Cut</div>
                                                    <div className="text-[10px] text-white truncate" title={scene.transition}>{scene.transition}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Prompts Area */}
                                        <div className="border-t border-neutral-800">
                                            <div className="grid grid-cols-2 divide-x divide-neutral-800">
                                                <div className="p-3 hover:bg-neutral-900 transition-colors cursor-pointer group/prompt relative" onClick={() => copyToClipboard(scene.imagePrompt)}>
                                                    <div className="text-[9px] text-blue-400 font-bold uppercase mb-1 flex items-center gap-1">
                                                        <Icons.Image className="w-3 h-3" /> IMG
                                                    </div>
                                                    <p className="text-[10px] text-neutral-500 line-clamp-2 group-hover/prompt:text-white transition-colors">
                                                        {scene.imagePrompt}
                                                    </p>
                                                    <div className="absolute top-2 right-2 opacity-0 group-hover/prompt:opacity-100">
                                                        <Icons.Copy className="w-3 h-3 text-white" />
                                                    </div>
                                                </div>
                                                <div className="p-3 hover:bg-neutral-900 transition-colors cursor-pointer group/prompt relative" onClick={() => copyToClipboard(scene.videoPrompt)}>
                                                    <div className="text-[9px] text-red-400 font-bold uppercase mb-1 flex items-center gap-1">
                                                        <Icons.Film className="w-3 h-3" /> VIDEO
                                                    </div>
                                                    <p className="text-[10px] text-neutral-500 line-clamp-2 group-hover/prompt:text-white transition-colors">
                                                        {scene.videoPrompt}
                                                    </p>
                                                    <div className="absolute top-2 right-2 opacity-0 group-hover/prompt:opacity-100">
                                                        <Icons.Copy className="w-3 h-3 text-white" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Audio Cue Footer */}
                                        <div className="bg-neutral-900/50 p-2 border-t border-neutral-800 flex items-center gap-2">
                                            <Icons.Megaphone className="w-3 h-3 text-neutral-600" />
                                            <span className="text-[9px] text-neutral-500 font-mono truncate">{scene.audioCues}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full min-h-[500px] border border-dashed border-neutral-800 rounded-2xl flex flex-col items-center justify-center text-neutral-600 bg-base-black/50">
                            <div className="w-24 h-24 bg-neutral-900 rounded-full flex items-center justify-center mb-6 border border-neutral-800">
                                <Icons.Clapperboard className="w-10 h-10 opacity-20" />
                            </div>
                            <h3 className="text-xl font-bold text-neutral-500 mb-2">Sala de Roteiro Vazia</h3>
                            <p className="max-w-md text-sm text-center px-6">
                                Insira o conceito do seu filme ou comercial ao lado para gerar um storyboard técnico completo de 6 atos.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sequencer;
