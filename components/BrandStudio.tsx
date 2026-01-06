
import React, { useState, useRef } from 'react';
import { generateCreativePrompts, extractPaletteFromImage } from '../services/geminiService';
import { creditService, COSTS } from '../services/creditService';
import { PromptResult } from '../types';
import { Icons } from './Icons';

interface BrandStudioProps {
    onSaveHistory: (input: string, output: PromptResult[], imageBase64?: string) => void;
}

type Step = 'DNA' | 'CREATION';
type BrandAssetType = 'LOGO' | 'ICON' | 'ELEMENT' | 'MOCKUP';
type ElementStyle = '2D_VECTOR' | 'HAND_DRAWN' | '3D_RENDER';
type MockupType =
    | 'BUSINESS_CARD' | 'UNIFORM' | 'CAR_WRAP' | 'STATIONERY' | 'FACADE' | 'ID_BADGE' | 'BRAND_KIT'
    | 'T_SHIRT' | 'HOODIE' | 'CAP' | 'BILLBOARD' | 'STOREFRONT' | 'PACKAGING' | 'DIGITAL_DEVICE';

const BrandStudio: React.FC<BrandStudioProps> = ({ onSaveHistory }) => {
    // APP STATE
    const [step, setStep] = useState<Step>('DNA');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<PromptResult[]>([]);

    // BRAND DNA STATE
    const [brandInfo, setBrandInfo] = useState({
        name: '',
        niche: '',
        mission: '',
        colors: '',
        audience: '',
        vibe: ''
    });

    // CREATION CONFIG STATE
    const [assetType, setAssetType] = useState<BrandAssetType | null>(null);
    const [mockupType, setMockupType] = useState<MockupType>('BUSINESS_CARD');
    const [elementStyle, setElementStyle] = useState<ElementStyle>('3D_RENDER');
    const [styleRefImage, setStyleRefImage] = useState<{ data: string, mimeType: string, preview: string } | null>(null);
    const [prototypeImage, setPrototypeImage] = useState<{ data: string, mimeType: string, preview: string } | null>(null);

    // COLOR EXTRACTION STATE
    const [colorMode, setColorMode] = useState<'MANUAL' | 'EXTRACT'>('MANUAL');
    const [isExtractingColors, setIsExtractingColors] = useState(false);

    const styleRefInputRef = useRef<HTMLInputElement>(null);
    const prototypeInputRef = useRef<HTMLInputElement>(null);
    const paletteInputRef = useRef<HTMLInputElement>(null);

    // HELPERS
    // HELPERS
    const handleImageUpload = (file: File, setter: React.Dispatch<React.SetStateAction<any>>) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setter({
                    data: result.split(',')[1],
                    mimeType: file.type,
                    preview: result
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleColorExtraction = async (file: File) => {
        if (!file || !file.type.startsWith('image/')) return;

        setIsExtractingColors(true);
        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const base64 = (e.target?.result as string).split(',')[1];
                const data = await extractPaletteFromImage(base64, file.type);
                if (data && data.palettePrimary) {
                    setBrandInfo(prev => ({
                        ...prev,
                        colors: data.palettePrimary.slice(0, 5).join(', ')
                    }));
                }
                setIsExtractingColors(false);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error("Palette extraction failed", error);
            setIsExtractingColors(false);
        }
    };

    const handleGenerate = async () => {
        if (!brandInfo.name.trim() || !assetType) return;

        const hasCredits = await creditService.deductCredits(COSTS.BRAND_STUDIO);
        if (!hasCredits) {
            alert("Créditos insuficientes!");
            return;
        }

        setLoading(true);
        setResults([]);
        try {
            // Build Context
            let context = `WORKFLOW: BRAND_ASSET_CREATION\n`;
            context += `BRAND_NAME: ${brandInfo.name}\n`;
            context += `NICHE: ${brandInfo.niche}\n`;
            context += `AUDIENCE: ${brandInfo.audience}\n`;
            context += `VIBE/STYLE: ${brandInfo.vibe}\n`;
            context += `COLORS: ${brandInfo.colors}\n`;
            context += `ASSET_TYPE: ${assetType}\n`;

            if (assetType === 'MOCKUP') context += `MOCKUP_TYPE: ${mockupType}\n`;
            if (assetType === 'ELEMENT') context += `ELEMENT_STYLE: ${elementStyle}\n`;

            const styleRefPayload = styleRefImage ? { data: styleRefImage.data, mimeType: styleRefImage.mimeType } : undefined;
            const prototypePayload = prototypeImage ? { data: prototypeImage.data, mimeType: prototypeImage.mimeType } : undefined;

            const data = await generateCreativePrompts(
                context,
                'LOGO_BRAND',
                assetType === 'MOCKUP' ? `Photorealistic ${mockupType} Mockup` : 'Professional Brand Asset',
                brandInfo.vibe || 'Professional',
                '1:1',
                undefined,
                styleRefPayload,
                [],
                'Eye Level',
                '',
                undefined,
                undefined,
                'VECTOR_FLAT',
                'MINIMALIST',
                prototypePayload
            );

            setResults(data);
            onSaveHistory(`Brand: ${brandInfo.name} [${assetType}]`, data, styleRefImage?.preview);
        } catch (error) {
            console.error(error);
            alert("Erro ao gerar prompts.");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

    return (
        <div className="w-full h-full bg-base-black text-white overflow-y-auto custom-scrollbar p-6">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* HEADER & STEPS */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-neon to-purple-500 bg-clip-text text-transparent">
                            Studio de Marca
                        </h1>
                        <p className="text-neutral-400 text-sm mt-1">
                            Construa identidades visuais completas e mockups profissionais.
                        </p>
                    </div>
                </div>

                {/* MAIN CONTENT AREA */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT: BRAND DNA (ALWAYS VISIBLE BUT COMPACT) */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-base-card border border-base-border rounded-2xl p-6 shadow-lg">
                            <h2 className="text-sm font-bold text-neon uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Icons.Fingerprint className="w-4 h-4" /> DNA da Marca
                            </h2>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase">Nome</label>
                                    <input
                                        value={brandInfo.name}
                                        onChange={e => setBrandInfo(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="Ex: Fusion Energy"
                                        className="w-full bg-base-dark border border-neutral-800 rounded-lg p-3 text-sm focus:border-neon outline-none"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase">Nicho</label>
                                    <input
                                        value={brandInfo.niche}
                                        onChange={e => setBrandInfo(prev => ({ ...prev, niche: e.target.value }))}
                                        placeholder="Ex: Startups de Tecnologia"
                                        className="w-full bg-base-dark border border-neutral-800 rounded-lg p-3 text-sm focus:border-neon outline-none"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase">Vibe / Estilo</label>
                                    <select
                                        value={brandInfo.vibe}
                                        onChange={e => setBrandInfo(prev => ({ ...prev, vibe: e.target.value }))}
                                        className="w-full bg-base-dark border border-neutral-800 rounded-lg p-3 text-sm focus:border-neon outline-none"
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="Minimalist & Modern">Minimalista & Moderno</option>
                                        <option value="Luxury & Elegant">Luxuoso & Elegante</option>
                                        <option value="Bold & Disruptive">Arrojado & Disruptivo</option>
                                        <option value="Eco & Organic">Ecológico & Orgânico</option>
                                        <option value="Cyberpunk & Tech">Cyberpunk & Tech</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase flex justify-between">
                                        Cores
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setColorMode('MANUAL')}
                                                className={`text-[8px] px-2 rounded ${colorMode === 'MANUAL' ? 'bg-neon text-black' : 'text-neutral-500'}`}
                                            >MANUAL</button>
                                            <button
                                                onClick={() => setColorMode('EXTRACT')}
                                                className={`text-[8px] px-2 rounded ${colorMode === 'EXTRACT' ? 'bg-neon text-black' : 'text-neutral-500'}`}
                                            >EXTRAIR NA FOTO</button>
                                        </div>
                                    </label>

                                    {colorMode === 'MANUAL' ? (
                                        <div className="flex gap-2">
                                            <input
                                                type="color"
                                                value={brandInfo.colors.split(',')[0].trim() || '#ffffff'}
                                                onChange={e => setBrandInfo(prev => ({ ...prev, colors: e.target.value }))}
                                                className="w-10 h-10 rounded cursor-pointer bg-transparent"
                                            />
                                            <input
                                                value={brandInfo.colors}
                                                onChange={e => setBrandInfo(prev => ({ ...prev, colors: e.target.value }))}
                                                placeholder="#HEX ou Nome"
                                                className="flex-1 bg-base-dark border border-neutral-800 rounded-lg p-3 text-sm focus:border-neon outline-none"
                                            />
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => paletteInputRef.current?.click()}
                                            className="w-full py-4 border border-dashed border-neutral-700 hover:border-neon rounded-lg cursor-pointer flex flex-col items-center justify-center gap-1 transition-colors"
                                        >
                                            {isExtractingColors ? (
                                                <Icons.Loader className="w-4 h-4 animate-spin text-neon" />
                                            ) : (
                                                <>
                                                    <Icons.Palette className="w-4 h-4 text-neon" />
                                                    <span className="text-[10px] text-neutral-400">Upload Imagem para Extrair</span>
                                                </>
                                            )}
                                            <input
                                                ref={paletteInputRef}
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => e.target.files && handleColorExtraction(e.target.files[0])}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* REFERENCE IMAGE */}
                        <div className="bg-base-card border border-base-border rounded-2xl p-6 shadow-lg">
                            <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Icons.Image className="w-4 h-4" /> Referência Visual (Opcional)
                            </h2>
                            <div
                                onClick={() => styleRefInputRef.current?.click()}
                                className={`
                                    w-full h-32 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer overflow-hidden transition-all
                                    ${styleRefImage ? 'border-neon bg-base-dark' : 'border-neutral-800 hover:border-neutral-600'}
                                `}
                            >
                                {styleRefImage ? (
                                    <div className="relative w-full h-full">
                                        <img src={styleRefImage.preview} className="w-full h-full object-contain p-2" />
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setStyleRefImage(null); }}
                                            className="absolute top-2 right-2 bg-black/80 text-white rounded-full p-1"
                                        >
                                            <Icons.X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center text-neutral-500">
                                        <Icons.Image className="w-6 h-6 mx-auto mb-2" />
                                        <span className="text-xs">Upload Estilo/Vibe</span>
                                    </div>
                                )}
                                <input type="file" ref={styleRefInputRef} onChange={e => e.target.files && handleImageUpload(e.target.files[0], setStyleRefImage)} className="hidden" accept="image/*" />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: ACTION CARDS OR RESULTS */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* 1. ASSET SELECTION HUB */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { id: 'LOGO', label: 'Logo', icon: Icons.Layout },
                                { id: 'MOCKUP', label: 'Mockup', icon: Icons.Box },
                                { id: 'ICON', label: 'Ícone', icon: Icons.AppWindow },
                                { id: 'ELEMENT', label: 'Visual', icon: Icons.Shapes },
                            ].map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => { setAssetType(item.id as BrandAssetType); setResults([]); }}
                                    className={`
                                        p-6 rounded-2xl border flex flex-col items-center justify-center gap-3 transition-all
                                        ${assetType === item.id
                                            ? 'bg-neon text-black border-neon shadow-lg shadow-neon/20 scale-[1.02]'
                                            : 'bg-base-card border-base-border text-neutral-400 hover:bg-neutral-800 hover:text-white'}
                                    `}
                                >
                                    {/* @ts-ignore */}
                                    <item.icon className="w-8 h-8" />
                                    <span className="font-bold text-sm tracking-wide">{item.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* 2. CONFIGURATION (Dependent on Selection) */}
                        {assetType && (
                            <div className="bg-base-card border border-base-border rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-4">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        Configurar {assetType === 'LOGO' ? 'Logo' : assetType === 'MOCKUP' ? 'Mockup' : 'Asset'}
                                    </h3>
                                    {assetType === 'MOCKUP' && (
                                        <div className="w-full">
                                            <label className="text-xs font-bold text-neutral-500 uppercase mb-3 block">Tipo de Mockup</label>
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                                {[
                                                    { id: 'BUSINESS_CARD', label: 'Cartão de Visita' },
                                                    { id: 'BRAND_KIT', label: 'Kit Completo' },
                                                    { id: 'DIGITAL_DEVICE', label: 'App / Site' },
                                                    { id: 'T_SHIRT', label: 'Camiseta' },
                                                    { id: 'HOODIE', label: 'Moletom' },
                                                    { id: 'CAP', label: 'Boné' },
                                                    { id: 'UNIFORM', label: 'Uniforme' },
                                                    { id: 'BILLBOARD', label: 'Outdoor' },
                                                    { id: 'STOREFRONT', label: 'Fachada Loja' },
                                                    { id: 'CAR_WRAP', label: 'Carro' },
                                                    { id: 'FACADE', label: 'Sinalização' },
                                                    { id: 'PACKAGING', label: 'Embalagem' },
                                                ].map((opt) => (
                                                    <button
                                                        key={opt.id}
                                                        onClick={() => setMockupType(opt.id as MockupType)}
                                                        className={`
                                                            px-3 py-3 rounded-lg text-xs font-bold border transition-all text-center
                                                            ${mockupType === opt.id
                                                                ? 'bg-neon text-black border-neon shadow-[0_0_10px_rgba(34,255,0,0.3)]'
                                                                : 'bg-base-dark border-neutral-800 text-neutral-400 hover:border-neutral-600 hover:text-white hover:bg-neutral-800'}
                                                        `}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* PROTOTYPE / BASE OBJECT UPLOAD */}
                                {(assetType === 'LOGO' || assetType === 'ICON' || assetType === 'MOCKUP') && (
                                    <div className="mb-6">
                                        <h4 className="text-xs font-bold text-neutral-500 uppercase mb-2">
                                            {assetType === 'MOCKUP' ? 'Objeto Real / Base (Opcional)' : 'Rascunho / Protótipo (Estrutura)'}
                                        </h4>
                                        <div
                                            onClick={() => prototypeInputRef.current?.click()}
                                            className={`
                                                w-full h-24 border border-dashed rounded-lg flex items-center justify-center cursor-pointer overflow-hidden transition-all
                                                ${prototypeImage ? 'border-neon bg-base-dark' : 'border-neutral-700 hover:border-neutral-500'}
                                            `}
                                        >
                                            {prototypeImage ? (
                                                <div className="relative w-full h-full flex items-center justify-center group">
                                                    <img src={prototypeImage.preview} className="h-full object-contain p-2" />
                                                    <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-xs text-white">
                                                        Trocar Imagem
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center text-neutral-500 flex items-center gap-2">
                                                    {assetType === 'MOCKUP' ? <Icons.Camera className="w-4 h-4" /> : <Icons.Pen className="w-4 h-4" />}
                                                    <span className="text-xs">
                                                        {assetType === 'MOCKUP' ? 'Upload Foto do Objeto' : 'Upload Rascunho'}
                                                    </span>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                ref={prototypeInputRef}
                                                onChange={e => e.target.files && handleImageUpload(e.target.files[0], setPrototypeImage)}
                                                className="hidden"
                                                accept="image/*"
                                            />
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={handleGenerate}
                                    disabled={loading || !brandInfo.name}
                                    className={`
                                        w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all
                                        ${loading || !brandInfo.name
                                            ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                                            : 'bg-neon hover:bg-neon-light text-black shadow-lg shadow-neon/20 hover:-translate-y-1'}
                                    `}
                                >
                                    {loading ? 'CRIANDO...' : 'GERAR VISUAIS'}
                                    {!loading && <Icons.Sparkles className="w-5 h-5" />}
                                </button>
                            </div>
                        )}

                        {/* 3. RESULTS */}
                        {results.length > 0 && (
                            <div className="space-y-4 animate-in fade-in">
                                <h3 className="text-lg font-bold text-neutral-400">Resultados</h3>
                                {results.map((res, idx) => (
                                    <div key={idx} className="bg-base-card border border-base-border rounded-2xl p-6 hover:border-neon/50 transition-all group">
                                        <div className="flex justify-between items-start gap-4 mb-4">
                                            <h4 className="font-bold text-neon">{res.title}</h4>
                                            <button
                                                onClick={() => copyToClipboard(res.prompt)}
                                                className="text-neutral-500 hover:text-white bg-base-dark p-2 rounded-lg"
                                            >
                                                <Icons.Copy className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <p className="text-neutral-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                                            {res.prompt}
                                        </p>
                                        <div className="flex gap-2 mt-4">
                                            {res.tags.map(tag => (
                                                <span key={tag} className="text-[10px] bg-neon/10 text-neon px-2 py-1 rounded border border-neon/20">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrandStudio;
