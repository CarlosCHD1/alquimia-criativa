
import React, { useState, useRef } from 'react';
import { adaptPromptStyle, extractPaletteFromImage } from '../services/geminiService';
import { creditService, COSTS } from '../services/creditService';
import { CreativeCopy, ModularRefs, FocusMode } from '../types';
import { Icons } from './Icons';

interface ProductStudioProps {
    onSaveHistory: (input: string, output: any, imageBase64?: string) => void;
}

interface ProductImage {
    id: string;
    preview: string;
    mimeType: string;
}

type IntensityLevel = 'Low' | 'Medium' | 'High';

const ProductStudio: React.FC<ProductStudioProps> = ({ onSaveHistory }) => {
    // --- ASSETS STATE ---
    const [refImage, setRefImage] = useState<{ data: string, mimeType: string, preview: string } | null>(null);
    const [prodImages, setProdImages] = useState<ProductImage[]>([]);

    // --- MODULAR REFS ---
    const [modRefs, setModRefs] = useState<ModularRefs>({});

    // --- MANUAL COLORS STATE ---
    const [manualColors, setManualColors] = useState<string[]>([]);
    const [tempHex, setTempHex] = useState('#FF5F00');
    const [extractedPalettes, setExtractedPalettes] = useState<{ palettePrimary: string[], paletteSecondary: string[] } | null>(null);
    const [extractingColors, setExtractingColors] = useState(false);

    // --- SETTINGS STATE ---
    const [intensity, setIntensity] = useState<IntensityLevel>('Medium');
    const [focusMode, setFocusMode] = useState<FocusMode>('AUTO');
    const [styleFeedback, setStyleFeedback] = useState('');

    // --- PROCESSING STATE ---
    const [loadingAdaptation, setLoadingAdaptation] = useState(false);
    const [adaptationStatus, setAdaptationStatus] = useState<string>('PRONTO');
    const [adaptedPrompt, setAdaptedPrompt] = useState<string | null>(null);

    const refInputRef = useRef<HTMLInputElement>(null);
    const prodInputRef = useRef<HTMLInputElement>(null);

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

    const handleProdFiles = (files: FileList | null) => {
        if (!files) return;
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setProdImages(prev => [...prev, {
                        id: crypto.randomUUID(),
                        preview: e.target?.result as string,
                        mimeType: file.type
                    }]);
                };
                reader.readAsDataURL(file);
            }
        });
    };

    const handleColorRefFile = (file: File) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const base64 = (e.target?.result as string).split(',')[1];
                setModRefs(prev => ({ ...prev, colors: { data: base64, mimeType: file.type } }));
                setExtractingColors(true);
                try {
                    const result = await extractPaletteFromImage(base64, file.type);
                    if (result && result.palettePrimary) setExtractedPalettes(result);
                } catch (error) { console.error(error); } finally { setExtractingColors(false); }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAdapt = async () => {
        if (!refImage || prodImages.length === 0) return;

        const hasCredits = await creditService.deductCredits(COSTS.PRODUCT_STUDIO);
        if (!hasCredits) {
            alert("Créditos insuficientes! Por favor, recarregue sua conta.");
            return;
        }

        setLoadingAdaptation(true);
        setAdaptationStatus('EXTRAINDO DNA VISUAL...');

        try {
            const prodsData = prodImages.map(img => ({ data: img.preview.split(',')[1], mimeType: img.mimeType }));
            const steps = [
                'MAPEANDO GEOMETRIA E LUZ...',
                'ABSTRAINDO ELEMENTOS LITERAIS...',
                'IGNORANDO TEXTOS E MARCAS...',
                'CALCULANDO HARMONIA CROMÁTICA...',
                'FINALIZANDO SÍNTESE TÉCNICA...'
            ];

            for (const step of steps) {
                setAdaptationStatus(step);
                await new Promise(r => setTimeout(r, 700));
            }

            const prompt = await adaptPromptStyle(
                refImage.data, refImage.mimeType, prodsData, intensity,
                { headline: '', subheadline: '', cta: '' },
                modRefs, focusMode, manualColors, styleFeedback
            );
            setAdaptedPrompt(prompt);
            // Removed duplicate setAdaptedPrompt call
            onSaveHistory("Síntese de DNA Criativo", { prompt }, refImage.preview);
        } catch (e) {
            setAdaptationStatus('ERRO NA SÍNTESE');
        } finally {
            setLoadingAdaptation(false);
            setAdaptationStatus('PRONTO');
        }
    };

    return (
        <div className="w-full h-full flex flex-col bg-base-black animate-in fade-in duration-500 overflow-hidden">

            {/* HEADER */}
            <div className="h-16 px-6 border-b border-base-border flex items-center justify-between shrink-0 bg-base-black/50 backdrop-blur-sm z-20">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-neon to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-neon/20">
                        <Icons.Briefcase className="text-black w-4 h-4" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-base-content leading-none tracking-tight">Laboratório Criativo</h2>
                        <span className="text-xs text-neutral-500 font-mono tracking-wider">DNA & SÍNTESE GEOMÉTRICA</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-base-dark border border-neutral-800 rounded-full">
                    <Icons.Info className="w-3 h-3 text-neon" />
                    <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest">IA Anti-Texto Ativa</span>
                </div>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">

                {/* LEFT: THE LAB */}
                <div className="lg:w-1/2 xl:w-5/12 border-r border-base-border overflow-y-auto custom-scrollbar p-6 space-y-8 bg-base-black">

                    {/* 1. SUBJECT */}
                    <section className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                                <Icons.Box className="text-neon w-4 h-4" /> 1. O Sujeito (O Que Gerar)
                            </h3>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {prodImages.map((img) => (
                                <div key={img.id} className="aspect-square relative rounded-xl overflow-hidden border border-neutral-700">
                                    <img src={img.preview} className="w-full h-full object-cover" />
                                    <button onClick={() => setProdImages(p => p.filter(x => x.id !== img.id))} className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center text-red-500 transition-all">
                                        <Icons.Plus className="w-6 h-6 rotate-45" />
                                    </button>
                                </div>
                            ))}
                            <button onClick={() => prodInputRef.current?.click()} className="aspect-square rounded-xl border border-dashed border-neutral-700 hover:border-neon hover:bg-neon/5 flex flex-col items-center justify-center gap-1 text-neutral-500 hover:text-white transition-all">
                                <Icons.Plus className="w-6 h-6" />
                                <span className="text-[9px] font-bold uppercase">Add</span>
                            </button>
                        </div>
                        <input type="file" ref={prodInputRef} onChange={(e) => handleProdFiles(e.target.files)} className="hidden" multiple accept="image/*" />
                    </section>

                    {/* 2. GEOMETRY / LIGHT MATRIX */}
                    <section className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                                <Icons.Frame className="text-neon w-4 h-4" /> 2. Matriz de Composição & Luz
                            </h3>
                        </div>

                        <div
                            onClick={() => refInputRef.current?.click()}
                            className={`
                        w-full h-48 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer relative overflow-hidden transition-all group
                        ${refImage ? 'border-neon' : 'border-neutral-800 hover:border-neutral-600 bg-base-dark'}
                      `}
                        >
                            {refImage ? (
                                <>
                                    <img src={refImage.preview} className="w-full h-full object-cover opacity-60 grayscale brightness-50 transition-all group-hover:grayscale-0" />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="bg-black/80 text-neon px-3 py-1 rounded-full text-[10px] font-bold border border-neon/30">MATRIZ ATIVA</span>
                                        <span className="text-[9px] text-white mt-2 opacity-0 group-hover:opacity-100 transition-opacity">A IA ignorará textos e o sujeito desta imagem.</span>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center space-y-2">
                                    <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center mx-auto">
                                        <Icons.Upload className="w-4 h-4 text-neutral-500" />
                                    </div>
                                    <p className="text-xs font-bold text-neutral-400">Arraste a Matriz Visual</p>
                                    <p className="text-[10px] text-neutral-600">Extração de Luz, Ângulo e Efeitos apenas.</p>
                                </div>
                            )}
                        </div>
                        <input type="file" ref={refInputRef} onChange={(e) => e.target.files && handleRefFile(e.target.files[0])} className="hidden" accept="image/*" />

                        <div className="pt-1">
                            <label className="text-[9px] font-bold text-neutral-500 uppercase flex items-center gap-1 mb-1.5 ml-1">
                                <Icons.Pen className="w-3 h-3" /> Refinamento do Estilo
                            </label>
                            <textarea
                                value={styleFeedback}
                                onChange={(e) => setStyleFeedback(e.target.value)}
                                placeholder="Ex: 'Mantenha o bloom intenso', 'Dê foco no material metálico', 'Luz lateral dramática'..."
                                className="w-full bg-base-black border border-base-border rounded-lg p-3 text-xs text-base-content focus:border-neon outline-none resize-none h-20 placeholder:text-neutral-700"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="bg-neutral-900/50 p-3 rounded-xl border border-neutral-800">
                                <label className="text-[9px] text-neutral-500 font-bold block mb-2 uppercase">Rigidez Geométrica</label>
                                <div className="flex gap-1">
                                    {['Low', 'Medium', 'High'].map((l) => (
                                        <button key={l} onClick={() => setIntensity(l as any)} className={`flex-1 py-1.5 rounded text-[9px] font-bold transition-all ${intensity === l ? 'bg-neon text-black shadow-lg scale-105' : 'bg-base-card text-neutral-500 hover:text-base-content'}`}>
                                            {l}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-neutral-900/50 p-3 rounded-xl border border-neutral-800">
                                <label className="text-[9px] text-neutral-500 font-bold block mb-2 uppercase">Óptica da Lente</label>
                                <select value={focusMode} onChange={(e) => setFocusMode(e.target.value as any)} className="w-full bg-base-card text-base-content text-[10px] font-bold py-1.5 px-2 rounded border border-neutral-700 focus:border-neon outline-none">
                                    <option value="AUTO">IA AUTO</option>
                                    <option value="SHALLOW">Macro (Foco Seletivo)</option>
                                    <option value="DEEP">Wide (Profundidade Total)</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* 3. COLORS */}
                    <section className="space-y-3 pt-2 border-t border-neutral-800">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <Icons.Droplet className="text-pink-400 w-4 h-4" /> 3. Paleta Cromática & Efeitos
                            </h3>
                            <label className="text-[9px] bg-neutral-800 hover:bg-white hover:text-black px-2 py-0.5 rounded cursor-pointer transition-colors font-bold">
                                Extrair DNA de Cor
                                <input type="file" className="hidden" onChange={(e) => e.target.files && handleColorRefFile(e.target.files[0])} accept="image/*" />
                            </label>
                        </div>

                        <div className="bg-base-card border border-neutral-800 rounded-xl p-4">
                            {extractingColors ? (
                                <div className="flex items-center gap-2 text-[10px] text-neon animate-pulse p-2 mb-3 bg-neon/5 border border-neon/20 rounded">
                                    <Icons.ScanLine className="w-3 h-3 animate-spin" /> Mapeando espectro de cores...
                                </div>
                            ) : extractedPalettes && (
                                <div className="space-y-2 p-2 bg-neutral-900/50 rounded border border-neutral-800 mb-3">
                                    <div onClick={() => setManualColors(extractedPalettes.palettePrimary.slice(0, 5))} className="cursor-pointer group">
                                        <div className="flex h-4 rounded overflow-hidden mb-1 group-hover:ring-1 ring-neon transition-all">
                                            {extractedPalettes.palettePrimary.slice(0, 5).map((hex, i) => (<div key={i} className="flex-1" style={{ backgroundColor: hex }}></div>))}
                                        </div>
                                        <span className="text-[8px] text-neutral-500 group-hover:text-neon uppercase font-bold">Vibe Principal (Aplicar)</span>
                                    </div>
                                    <div onClick={() => setManualColors(extractedPalettes.paletteSecondary.slice(0, 5))} className="cursor-pointer group mt-2">
                                        <div className="flex h-4 rounded overflow-hidden mb-1 group-hover:ring-1 ring-neon transition-all">
                                            {extractedPalettes.paletteSecondary.slice(0, 5).map((hex, i) => (<div key={i} className="flex-1" style={{ backgroundColor: hex }}></div>))}
                                        </div>
                                        <span className="text-[8px] text-neutral-500 group-hover:text-neon uppercase font-bold">Vibe Atmosférica (Aplicar)</span>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-wrap gap-2 items-center">
                                {manualColors.map((c, i) => (
                                    <div key={i} className="w-8 h-8 rounded-full border border-white/10 relative group shadow-lg" style={{ backgroundColor: c }}>
                                        <button onClick={() => setManualColors(prev => prev.filter((_, idx) => idx !== i))} className="absolute -top-1 -right-1 bg-red-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                                    </div>
                                ))}
                                {manualColors.length < 5 && (
                                    <div className="flex items-center gap-1">
                                        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-neutral-700 bg-neutral-800">
                                            <input type="color" value={tempHex} onChange={(e) => setTempHex(e.target.value.toUpperCase())} className="absolute inset-0 opacity-0 cursor-pointer" />
                                            <div className="w-full h-full" style={{ backgroundColor: tempHex }}></div>
                                        </div>
                                        <button onClick={() => !manualColors.includes(tempHex) && setManualColors(prev => [...prev, tempHex])} className="text-[10px] bg-neutral-800 px-3 py-1.5 rounded text-neutral-400 hover:text-white font-bold transition-colors">+</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                </div>

                {/* RIGHT: THE RESULT */}
                <div className="flex-1 bg-base-dark flex flex-col p-6 relative">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-neon/10 via-transparent to-transparent pointer-events-none"></div>

                    <div className="mb-6 flex-shrink-0">
                        <button
                            onClick={handleAdapt}
                            disabled={loadingAdaptation || !refImage || prodImages.length === 0}
                            className={`
                          w-full py-5 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-2xl transition-all
                          ${loadingAdaptation
                                    ? 'bg-neutral-800 text-neutral-500 cursor-wait'
                                    : (!refImage || prodImages.length === 0)
                                        ? 'bg-neutral-800 text-neutral-600 opacity-50 cursor-not-allowed'
                                        : 'bg-neon hover:bg-neon-light text-black hover:shadow-[0_0_40px_rgba(255,95,0,0.5)] transform hover:-translate-y-1'}
                      `}
                        >
                            {loadingAdaptation ? <Icons.ScanLine className="w-5 h-5 animate-spin" /> : <Icons.Zap className="w-5 h-5 fill-black" />}
                            {loadingAdaptation ? 'SINTETIZANDO DNA...' : 'SINTETIZAR MATRIZ CRIATIVA'}
                        </button>
                        {loadingAdaptation && (
                            <div className="mt-2 text-center text-[10px] font-mono text-neon animate-pulse tracking-widest">{adaptationStatus}</div>
                        )}
                    </div>

                    <div className="flex-1 bg-base-card rounded-xl border border-neutral-800 overflow-hidden flex flex-col shadow-2xl relative group">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-white/5">
                            <div className="flex items-center gap-2">
                                <Icons.Terminal className="w-4 h-4 text-neon" />
                                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">DNA_RESULT.PROMPT</span>
                            </div>
                            {adaptedPrompt && (
                                <button onClick={() => navigator.clipboard.writeText(adaptedPrompt)} className="text-[10px] text-neon hover:text-white flex items-center gap-2 bg-neon/10 px-3 py-1.5 rounded-full border border-neon/20 transition-all">
                                    <Icons.Copy className="w-3 h-3" /> COPIAR PROMPT
                                </button>
                            )}
                        </div>

                        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                            {adaptedPrompt ? (
                                <div className="animate-in fade-in slide-in-from-bottom-2">
                                    <p className="font-mono text-sm text-neutral-300 whitespace-pre-wrap leading-loose selection:bg-neon selection:text-black">
                                        {adaptedPrompt}
                                    </p>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center opacity-10 text-center space-y-4 grayscale">
                                    <Icons.ScanEye className="w-16 h-16 text-neutral-500" />
                                    <div>
                                        <h4 className="text-lg font-bold text-neutral-400 uppercase tracking-tighter">Motor de Síntese</h4>
                                        <p className="text-xs text-neutral-600 mt-1 max-w-[250px]">Abstração total de imagens de referência para foco em estilo e efeitos puros.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProductStudio;
