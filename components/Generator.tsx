
// ... imports remain the same
import React, { useState, useRef, useEffect } from 'react';
import { generateCreativePrompts, enhancePromptRealism, extractStyleDescription } from '../services/geminiService';
import { creditService, COSTS } from '../services/creditService';
import { PromptResult, GenerationType } from '../types';
import { Icons } from './Icons';

interface GeneratorProps {
  onSaveHistory: (input: string, output: PromptResult[], imageBase64?: string) => void;
  initialState?: { concept: string, style: string }; // New Prop
}

const Generator: React.FC<GeneratorProps> = ({ onSaveHistory, initialState }) => {
  // ... state definitions
  const [concept, setConcept] = useState(initialState?.concept || '');
  const [type, setType] = useState<GenerationType>('IMAGE');
  const [style, setStyle] = useState(initialState?.style || '');

  // Update state if props change (re-use action)
  useEffect(() => {
    if (initialState) {
      setConcept(initialState.concept);
      if (initialState.style) setStyle(initialState.style);
    }
  }, [initialState]);

  const [tone, setTone] = useState('Cinematic');
  const [ratio, setRatio] = useState('16:9');

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [results, setResults] = useState<PromptResult[]>([]);
  const [enhancingIndex, setEnhancingIndex] = useState<number | null>(null);

  const [isMockupMode, setIsMockupMode] = useState(false);
  const [mockupType, setMockupType] = useState('BUSINESS_CARD');
  const [mockupColor, setMockupColor] = useState('');
  const [mockupDetail, setMockupDetail] = useState('');

  const [videoFps, setVideoFps] = useState('24fps (Cinematic)');
  const [videoPacing, setVideoPacing] = useState('Real-time');
  const [text3D, setText3D] = useState('');

  const cameraOptions = [
    { label: 'Macro / Extremo', value: 'Extreme Close-up (Macro Details)', desc: 'Detalhes minúsculos, texturas' },
    { label: 'Close-up', value: 'Close-up Shot', desc: 'Rosto ou objeto em destaque' },
    { label: 'Plano Americano', value: 'American Shot (Medium Shot)', desc: 'Cintura para cima (Heroico)' },
    { label: 'Nível dos Olhos', value: 'Eye Level Wide Shot', desc: 'Visão natural padrão' },
    { label: 'Olho de Verme', value: 'Worm\'s Eye View (Low Angle)', desc: 'Câmera no chão olhando p/ cima' },
    { label: 'Visão Aérea', value: 'Aerial Drone View (High Angle)', desc: 'Vista de cima / Drone' }
  ];
  const [framingIndex, setFramingIndex] = useState(3);



  const [refImage, setRefImage] = useState<{ data: string, mimeType: string, preview: string } | null>(null);
  const [analyzedStyle, setAnalyzedStyle] = useState<string>('');
  const [analyzingStyle, setAnalyzingStyle] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [viewMode, setViewMode] = useState<'TEXT' | 'JSON'>('TEXT');
  const [showGuide, setShowGuide] = useState(false);

  const handleImageUpload = async (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const result = e.target?.result as string;
        const base64 = result.split(',')[1];
        setRefImage({ data: base64, mimeType: file.type, preview: result });
        setAnalyzedStyle('');
        setAnalyzingStyle(true);
        try {
          const styleDesc = await extractStyleDescription(base64, file.type);
          setAnalyzedStyle(styleDesc);
        } catch (error) {
          setAnalyzedStyle("Style detection failed.");
        } finally {
          setAnalyzingStyle(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };



  const constructFullConcept = () => {
    if (type === '3D_ASSET' && text3D) {
      return `Subject: 3D Typography text "${text3D}" rendered in cute 3D isometric style. \nContext: ${concept}`;
    }
    if (type === 'LOGO_BRAND' && isMockupMode) {
      let metaContext = `ASSET_TYPE: MOCKUP\n`;
      metaContext += `MOCKUP_TYPE: ${mockupType}\n`;
      if (mockupColor) metaContext += `MOCKUP_USER_COLOR: ${mockupColor}\n`;
      if (mockupDetail) metaContext += `MOCKUP_USER_DESC: ${mockupDetail}\n`;
      return `${metaContext}\nUser Concept: ${concept}`;
    }
    return concept;
  };

  const handleGenerate = async () => {
    // Validation: Require concept OR (3D type AND 3D text)
    const isValid = concept.trim() || (type === '3D_ASSET' && text3D.trim());
    if (!isValid) return;

    // Credit Check
    const hasCredits = await creditService.deductCredits(COSTS.GENERATOR);
    if (!hasCredits) {
      alert("Créditos insuficientes! Por favor, recarregue sua conta.");
      return;
    }

    setLoading(true);
    setResults([]);
    try {
      const fullConcept = constructFullConcept();
      // Force user requested 3D style if type is 3D_ASSET
      const effectiveStyle = type === '3D_ASSET'
        ? "Cute 3D Isometric, Claymorphism, Soft Pastel Colors, Octane Render, High Polish, MinimalistBackground"
        : (style || 'General High Quality');

      const data = await generateCreativePrompts(
        fullConcept, type, effectiveStyle, tone, ratio, undefined,
        refImage ? { data: refImage.data, mimeType: refImage.mimeType } : undefined,
        [], cameraOptions[framingIndex].value, analyzedStyle,
        { fps: videoFps, pacing: videoPacing }
      );
      setResults(data);
      onSaveHistory(concept || `3D Text: ${text3D}`, data, refImage?.preview);
    } catch (error) {
      alert("Falha ao gerar prompts.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateMore = async () => {
    const isValid = concept.trim() || (type === '3D_ASSET' && text3D.trim());
    if (!isValid) return;

    const hasCredits = await creditService.deductCredits(COSTS.GENERATOR);
    if (!hasCredits) {
      alert("Créditos insuficientes! Por favor, recarregue sua conta.");
      return;
    }

    setLoadingMore(true);
    try {
      const fullConcept = constructFullConcept();
      // Force user requested 3D style if type is 3D_ASSET
      const effectiveStyle = type === '3D_ASSET'
        ? "Cute 3D Isometric, Claymorphism, Soft Pastel Colors, Octane Render, High Polish, MinimalistBackground"
        : (style || 'General High Quality');

      const data = await generateCreativePrompts(
        fullConcept, type, effectiveStyle, tone, ratio, undefined,
        refImage ? { data: refImage.data, mimeType: refImage.mimeType } : undefined,
        [], cameraOptions[framingIndex].value, analyzedStyle,
        { fps: videoFps, pacing: videoPacing }
      );
      setResults(prev => [...prev, ...data]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleEnhanceRealism = async (index: number, currentPrompt: string) => {
    setEnhancingIndex(index);
    try {
      const enhanced = await enhancePromptRealism(currentPrompt);
      setResults(prev => {
        const newResults = [...prev];
        newResults[index] = { ...newResults[index], prompt: enhanced, title: newResults[index].title + " (Realism+)" };
        return newResults;
      });
    } catch (e) {
      console.error(e);
    } finally {
      setEnhancingIndex(null);
    }
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const typeOptions: { id: GenerationType; label: string; icon: any }[] = [
    { id: 'IMAGE', label: 'Imagem', icon: Icons.Image },
    { id: 'VIDEO', label: 'Vídeo', icon: Icons.Film },
    { id: '3D_ASSET', label: 'Asset 3D', icon: Icons.Box },
    { id: 'TEXTURE', label: 'Textura', icon: Icons.Palette },
    { id: 'UI_UX', label: 'UI/App', icon: Icons.Layout },
  ];

  const mockupTypes = [
    { id: 'BUSINESS_CARD', label: 'Cartão de Visita' },
    { id: 'UNIFORM', label: 'Uniforme / Roupa' },
    { id: 'CAR_WRAP', label: 'Veículo (Wrap)' },
    { id: 'STATIONERY', label: 'Papelaria' },
    { id: 'FACADE', label: 'Fachada / Loja' },
    { id: 'ID_BADGE', label: 'Crachá' },
    { id: 'BRAND_CONCEPT', label: 'Conceito 3D' }
  ];

  const toneOptions = ['Cinematic', 'Photorealistic', 'Artistic', 'Surreal', 'Abstract', 'Minimalist'];
  const videoFpsOptions = ['24fps (Cinematic)', '30fps (Standard)', '60fps (Smooth)', '120fps (Slow-Mo)'];
  const videoPacingOptions = ['Real-time', 'Slow Motion', 'Timelapse', 'Hyperlapse', 'Fast Paced'];


  const getPlaceholder = () => {
    if (type === 'LOGO_BRAND' && isMockupMode) return "Nome da marca ou texto principal...";
    switch (type) {
      case 'VIDEO': return "Descreva o movimento da câmera, a ação e o clima...";
      case '3D_ASSET': return "Descreva o objeto ou cena (ex: Uma loja de café isométrica)...";
      case 'TEXTURE': return "Descreva a superfície e material...";
      case 'UI_UX': return "Descreva o aplicativo ou site...";
      case 'LOGO_BRAND': return "Descreva o conceito do logo...";
      default: return "Descreva sua ideia de forma simples...";
    }
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-6 relative">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 mb-8">
        <div className="space-y-2 flex-1">
          <h2 className="text-4xl font-bold text-white flex items-center gap-3 tracking-tight">
            <Icons.Wand className="text-neon w-8 h-8" />
            <span className="bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
              Alquimia Forge
            </span>
          </h2>
          <p className="text-neutral-400 max-w-lg">Forje prompts com precisão de engenharia e estética cinematográfica.</p>
          <div className="pt-2">
            <button
              onClick={() => setShowGuide(true)}
              className="inline-flex items-center gap-2 text-xs font-bold text-neon border border-neon/30 px-4 py-2 rounded-full hover:bg-neon/10 transition-colors"
            >
              <Icons.Help className="w-4 h-4" /> Fórmula Mestra
            </button>
          </div>
        </div>
      </div>

      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowGuide(false)}>
          <div className="bg-base-card border border-neon/50 rounded-2xl max-w-2xl w-full p-8 relative shadow-[0_0_50px_rgba(255,95,0,0.2)]" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowGuide(false)} className="absolute top-4 right-4 text-neutral-500 hover:text-base-content">✕</button>
            <h3 className="text-2xl font-bold text-base-content mb-6 flex items-center gap-2">
              <Icons.Layers className="text-neon" /> A Anatomia do Prompt
            </h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-base-black p-4 rounded-xl border border-blue-900/30">
                  <h4 className="text-blue-400 font-bold text-xs uppercase mb-1">1. Persona</h4>
                  <p className="text-neutral-400 text-sm">"Expert photographer..."</p>
                </div>
                <div className="bg-base-black p-4 rounded-xl border border-green-900/30">
                  <h4 className="text-green-400 font-bold text-xs uppercase mb-1">2. Sujeito</h4>
                  <p className="text-neutral-400 text-sm">"Neon Samurai..."</p>
                </div>
                <div className="bg-base-black p-4 rounded-xl border border-purple-900/30">
                  <h4 className="text-purple-400 font-bold text-xs uppercase mb-1">3. Técnica</h4>
                  <p className="text-neutral-400 text-sm">"85mm, f/1.8..."</p>
                </div>
                <div className="bg-base-black p-4 rounded-xl border border-orange-900/30">
                  <h4 className="text-orange-400 font-bold text-xs uppercase mb-1">4. Vibe</h4>
                  <p className="text-neutral-400 text-sm">"Cinematic Noir..."</p>
                </div>
              </div>
              <div className="bg-neon/10 p-4 rounded-xl border border-neon/20">
                <h4 className="text-neon font-bold text-sm mb-2">💡 Nota de Aspecto</h4>
                <p className="text-neutral-300 text-sm italic">
                  O sistema usa a proporção escolhida para arquitetar o layout, mas não inclui comandos de `--ar` no prompt, deixando você livre para configurar na sua ferramenta.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div id="generator-options" className="lg:col-span-1 space-y-4 bg-base-card p-4 rounded-2xl border border-base-border overflow-y-auto max-h-[800px] custom-scrollbar">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-neon uppercase tracking-wider">Tipo de Mídia</label>
            <div className="grid grid-cols-2 gap-2">
              {typeOptions.map((opt) => (
                <button key={opt.id} onClick={() => setType(opt.id)} className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${type === opt.id ? 'bg-neon text-black border-neon shadow-[0_0_15px_rgba(255,95,0,0.4)] font-bold scale-[1.02]' : 'border-base-border bg-base-dark text-neutral-500 hover:border-neutral-500 hover:text-base-content'}`}>
                  <opt.icon className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {type === 'VIDEO' && (
            <div className="bg-base-black border border-neutral-800 rounded-xl p-4 space-y-4">
              <div className="flex items-center gap-2 mb-1"><Icons.Film className="w-4 h-4 text-neon" /><span className="text-xs font-bold text-base-content uppercase">Vídeo</span></div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-500 uppercase">FPS</label>
                <select value={videoFps} onChange={(e) => setVideoFps(e.target.value)} className="w-full bg-base-dark border border-neutral-700 rounded-lg px-2 py-2 text-xs text-base-content outline-none focus:border-neon">
                  {videoFpsOptions.map(fps => (<option key={fps} value={fps}>{fps}</option>))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-500 uppercase">Ritmo</label>
                <select value={videoPacing} onChange={(e) => setVideoPacing(e.target.value)} className="w-full bg-base-dark border border-neutral-700 rounded-lg px-2 py-2 text-xs text-base-content outline-none focus:border-neon">
                  {videoPacingOptions.map(pacing => (<option key={pacing} value={pacing}>{pacing}</option>))}
                </select>
              </div>
            </div>
          )}

          {type === 'LOGO_BRAND' && (
            <div className="bg-base-black border border-neutral-800 rounded-xl p-4 space-y-4">
              <div className="flex border border-neutral-700 rounded-lg p-1 bg-neutral-900">
                <button onClick={() => setIsMockupMode(false)} className={`flex-1 py-1.5 text-[10px] font-bold rounded transition-all ${!isMockupMode ? 'bg-white text-black' : 'text-neutral-500'}`}>Design</button>
                <button onClick={() => setIsMockupMode(true)} className={`flex-1 py-1.5 text-[10px] font-bold rounded transition-all ${isMockupMode ? 'bg-neon text-black' : 'text-neutral-500'}`}>Mockup</button>
              </div>
              {isMockupMode && (
                <div className="space-y-3 animate-in fade-in">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase">Tipo</label>
                    <select value={mockupType} onChange={(e) => setMockupType(e.target.value)} className="w-full bg-base-dark border border-neutral-700 rounded-lg px-2 py-2 text-xs text-base-content outline-none focus:border-neon">
                      {mockupTypes.map(m => (<option key={m.id} value={m.id}>{m.label}</option>))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {type === '3D_ASSET' && (
            <div className="bg-base-black border border-neutral-800 rounded-xl p-4 space-y-4">
              <div className="flex items-center gap-2 mb-1"><Icons.Box className="w-4 h-4 text-neon" /><span className="text-xs font-bold text-base-content uppercase">Opções 3D</span></div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-500 uppercase">Texto 3D (Opcional)</label>
                <input type="text" value={text3D} onChange={(e) => setText3D(e.target.value)} placeholder="Ex: NOME..." className="w-full bg-base-dark border border-neutral-700 rounded-lg px-2 py-2 text-xs text-base-content outline-none focus:border-neon" />
                <p className="text-[10px] text-neutral-600">Se preenchido, o prompt focará em renderizar este texto em 3D.</p>
              </div>
            </div>
          )}

          {type !== '3D_ASSET' && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-300">Estilo Artístico</label>
              <input type="text" value={style} onChange={(e) => setStyle(e.target.value)} placeholder="Cyberpunk, Cinematic..." className="w-full bg-base-dark border border-base-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon" />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-neutral-300">Tom Criativo</label>
            <div className="grid grid-cols-2 gap-2">
              {toneOptions.map((t) => (
                <button key={t} onClick={() => setTone(t)} className={`px-2 py-2 text-xs font-medium rounded border transition-all ${tone === t ? 'bg-neon text-black border-neon shadow-lg font-bold' : 'border-base-border text-neutral-400 hover:border-neutral-500 hover:text-base-content'}`}>{t}</button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-neutral-300 flex items-center justify-between">
              <span>Direção de Composição</span>
              <span className="text-[9px] bg-neutral-800 text-neutral-500 px-1.5 py-0.5 rounded border border-neutral-700 font-mono">LAYOUT ONLY</span>
            </label>
            <select value={ratio} onChange={(e) => setRatio(e.target.value)} className="w-full bg-base-dark border border-base-border rounded-lg px-4 py-3 text-base-content focus:outline-none focus:border-neon">
              <option value="16:9">16:9 (Cinematic/Vasto)</option>
              <option value="9:16">9:16 (Vertical/Profundo)</option>
              <option value="1:1">1:1 (Equilibrado)</option>
              <option value="21:9">21:9 (Panorâmico)</option>
            </select>
          </div>

          <div className="space-y-3 pt-2 border-t border-neutral-800">
            <div className="flex justify-between items-center"><label className="text-sm font-semibold text-neutral-300 flex items-center gap-2"><Icons.Camera className="w-4 h-4 text-neon" />Ângulo</label><span className="text-[10px] text-neon font-bold uppercase bg-neon/10 px-2 py-0.5 rounded">{cameraOptions[framingIndex].label}</span></div>
            <input type="range" min="0" max={cameraOptions.length - 1} step="1" value={framingIndex} onChange={(e) => setFramingIndex(parseInt(e.target.value))} className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-neon focus:outline-none" />
          </div>


        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-base-card p-4 rounded-2xl border border-base-border h-full flex flex-col">
            <label className="text-sm font-semibold text-neon uppercase tracking-wider mb-3">Conceito Base</label>
            <textarea id="generator-input" value={concept} onChange={(e) => setConcept(e.target.value)} placeholder={getPlaceholder()} className="flex-1 w-full bg-base-dark border border-base-border rounded-xl p-4 text-lg text-base-content placeholder:text-neutral-600 focus:outline-none focus:border-neon resize-none mb-4" />

            <div className="mt-auto space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                <div className="flex-shrink-0">
                  <input type="file" ref={fileInputRef} onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])} className="hidden" accept="image/*" />
                  <div className={`relative w-20 h-20 rounded-xl border border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${refImage ? 'border-neon' : 'border-neutral-700 hover:border-neon'}`} onClick={() => !refImage && fileInputRef.current?.click()}>
                    {refImage ? (<><img src={refImage.preview} className="w-full h-full object-cover" /><button onClick={(e) => { e.stopPropagation(); setRefImage(null); setAnalyzedStyle(''); }} className="absolute top-1 right-1 bg-black/80 text-white rounded-full p-0.5 hover:text-red-500">×</button></>) : (<Icons.ImagePlus className="w-6 h-6 text-neutral-500" />)}
                  </div>
                  <span className="text-[9px] text-neutral-500 font-mono mt-1 block text-center uppercase">Ref. DNA</span>
                </div>

                <div className="flex-1 w-full">
                  <div className="flex flex-col h-full justify-end pb-1">
                    <label className="text-[10px] uppercase font-bold text-neutral-500 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1"><Icons.ScanLine className="w-3 h-3" /> DNA do Estilo</span>
                    </label>
                    <div className="relative bg-base-black border border-neutral-800 rounded-xl p-3 h-[50px] flex items-center overflow-hidden">
                      {analyzingStyle ? (<div className="flex items-center gap-2 text-neon text-xs font-mono animate-pulse"><Icons.ScanLine className="w-4 h-4 animate-spin" />Lendo DNA...</div>) : analyzedStyle ? (<textarea value={analyzedStyle} onChange={(e) => setAnalyzedStyle(e.target.value)} className="w-full h-full bg-transparent text-xs text-green-400 font-mono resize-none focus:outline-none leading-tight" />) : (<div className="text-neutral-600 text-xs italic flex items-center gap-2"><Icons.Info className="w-3 h-3" />Suba uma imagem para extrair estilo.</div>)}
                    </div>
                  </div>
                </div>
              </div>

              <button id="enhance-btn" onClick={handleGenerate} disabled={loading || !concept} className={`w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all ${loading || !concept ? 'bg-neutral-800/50 text-neutral-500 cursor-not-allowed' : 'bg-neon hover:bg-neon-light text-black shadow-lg shadow-neon/20 hover:-translate-y-1'}`}>
                {loading ? (<>PROCESSANDO...</>) : (<><Icons.Sparkles className="w-5 h-5" />FORJAR PROMPTS</>)}
              </button>
            </div>
          </div>
        </div>
      </div>

      {results.length > 0 && (
        <div id="prompt-history" className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
          <div className="flex items-center justify-between mt-8 border-b border-base-border pb-4">
            <h3 className="text-xl font-bold text-base-content">Resultados</h3>
            <div className="flex bg-base-dark rounded-lg p-1 border border-base-border">
              <button onClick={() => setViewMode('TEXT')} className={`px-3 py-1.5 rounded text-xs font-bold ${viewMode === 'TEXT' ? 'bg-neutral-700 text-white' : 'text-neutral-500'}`}>TEXTO</button>
              <button onClick={() => setViewMode('JSON')} className={`px-3 py-1.5 rounded text-xs font-bold ${viewMode === 'JSON' ? 'bg-neon/20 text-neon' : 'text-neutral-500'}`}>JSON</button>
            </div>
          </div>

          {results.map((res, idx) => (
            <div key={idx} className="group relative bg-base-card rounded-2xl border border-base-border overflow-hidden hover:border-neon/50 transition-all">
              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-full pr-4 flex items-center gap-4">
                    <h4 className="text-sm font-mono font-bold text-neutral-200 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-lg">{res.title}</h4>
                    <div className="h-px bg-neutral-800 flex-1"></div>
                    <span className="text-[10px] font-bold bg-neutral-800 text-neutral-300 px-2 py-1 rounded border border-neutral-700 font-mono uppercase tracking-wider">{res.suggestedModel}</span>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button onClick={() => handleEnhanceRealism(idx, res.prompt)} disabled={enhancingIndex === idx} className="p-3 bg-base-dark hover:bg-neon/10 hover:text-neon rounded-xl border border-base-border hover:border-neon">{enhancingIndex === idx ? <Icons.ScanLine className="w-5 h-5 animate-spin" /> : <Icons.Eye className="w-5 h-5" />}</button>
                    <button onClick={() => copyToClipboard(viewMode === 'TEXT' ? res.prompt : JSON.stringify(res, null, 2))} className="p-3 bg-base-dark hover:bg-neon hover:text-black rounded-xl border border-base-border hover:border-neon"><Icons.Copy className="w-5 h-5" /></button>
                  </div>
                </div>

                <div className="relative bg-base-dark rounded-xl border border-neutral-800 mb-4 overflow-hidden">
                  <div className="p-4 font-mono text-sm leading-relaxed">
                    {viewMode === 'TEXT' ? (<span className="text-neutral-300 whitespace-pre-wrap">{res.prompt}</span>) : (<pre className="text-xs text-green-400">{JSON.stringify(res, null, 2)}</pre>)}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {res.tags.map((tag, tIdx) => (<span key={tIdx} className="text-xs text-neon border border-neon/20 bg-neon/5 px-2 py-1 rounded-full font-mono">#{tag}</span>))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Generator;
