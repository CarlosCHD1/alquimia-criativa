
import React, { useState, useRef, useEffect } from 'react';
import { reverseEngineerImage, reverseEngineerTextPrompt } from '../services/geminiService';
import { creditService, COSTS } from '../services/creditService';
import { ReverseEngineeringResult } from '../types';
import { Icons } from './Icons';

interface ReverseEngineerProps {
  onSaveHistory: (input: string, output: any, imageBase64?: string) => void;
}

const ReverseEngineer: React.FC<ReverseEngineerProps> = ({ onSaveHistory }) => {
  // --- STATE: INPUT MODE ---
  const [analysisMode, setAnalysisMode] = useState<'IMAGE' | 'TEXT'>('IMAGE');

  // --- STATE: MAIN ANALYSIS ---
  const [refImagePreview, setRefImagePreview] = useState<string | null>(null);
  const [refMimeType, setRefMimeType] = useState<string>('');
  const [textPromptInput, setTextPromptInput] = useState('');

  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [result, setResult] = useState<ReverseEngineeringResult | null>(null);

  const [analysisInstruction, setAnalysisInstruction] = useState('');

  // --- STATE: TABS ---
  const [activeTab, setActiveTab] = useState<'DNA' | 'STUDY'>('DNA');

  // --- STATE: REFERENCE GUIDE ---
  const [showReferenceGuide, setShowReferenceGuide] = useState(false);
  const [activeTipIndex, setActiveTipIndex] = useState(0);

  const refInputRef = useRef<HTMLInputElement>(null);

  // --- CONSTANTS: GUIDE DATA ---
  const guideLayers = [
    {
      id: 'SUBJECT',
      title: '1. O Sujeito (O Núcleo)',
      desc: 'Quem ou o quê é o foco principal? Seja descritivo.',
      importance: 'Sem um sujeito claro, a IA "alucina" ou cria composições genéricas. Defina a roupa, a pose e a expressão.',
      icon: Icons.User,
      color: 'text-blue-400',
      bg: 'bg-blue-900/10',
      border: 'border-blue-500/30',
      terms: ['Cyberpunk Samurai', 'Astronauta Futurista', 'Gato Ciborgue', 'Carro Vintage', 'Formas Abstratas', 'Floresta Bioluminescente']
    },
    {
      id: 'MEDIUM',
      title: '2. A Mídia (A Técnica)',
      desc: 'Como a imagem foi "feita"? Pintura, 3D, Foto?',
      importance: 'Define a textura e o realismo. Misturar mídias (ex: "Oil Painting" + "Unreal Engine") cria estilos híbridos únicos.',
      icon: Icons.Paintbrush,
      color: 'text-purple-400',
      bg: 'bg-purple-900/10',
      border: 'border-purple-500/30',
      terms: ['Unreal Engine 5 Render', 'Fotografia 35mm', 'Pintura a Óleo', 'Ilustração Vetorial', 'Polaroid Vintage', 'Double Exposure', 'Claymation']
    },
    {
      id: 'LIGHT_CAM',
      title: '3. Luz & Câmera (A Física)',
      desc: 'Como a cena é iluminada e enquadrada?',
      importance: 'A luz define o humor (Drama vs Alegria). A câmera define a intimidade (Close-up vs Wide Shot). É onde o "Cinematic" acontece.',
      icon: Icons.Camera,
      color: 'text-green-400',
      bg: 'bg-green-900/10',
      border: 'border-green-500/30',
      terms: ['Volumetric Lighting', 'God Rays', 'Bokeh (Fundo Desfocado)', 'Lente Grande Angular', 'Neon Rim Light', 'Golden Hour', 'f/1.8 Aperture']
    },
    {
      id: 'STYLE',
      title: '4. Estilo & Vibe (A Alma)',
      desc: 'Qual é o sentimento e a estética geral?',
      importance: 'A cola que une tudo. Sem um estilo definido, a imagem pode parecer uma colagem desconexa.',
      icon: Icons.Sparkles,
      color: 'text-pink-400',
      bg: 'bg-pink-900/10',
      border: 'border-pink-500/30',
      terms: ['Neon Noir', 'Minimalista', 'Synthwave', 'Gótico', 'Wes Anderson Style', 'Surrealismo', 'Steampunk']
    }
  ];

  // Rotate tips
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTipIndex(prev => (prev + 1) % guideLayers.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // --- HANDLERS ---

  const handleRefFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setRefImagePreview(e.target?.result as string);
        setRefMimeType(file.type);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    const hasCredits = await creditService.deductCredits(COSTS.REVERSE_ENGINEER);
    if (!hasCredits) {
      alert("Créditos insuficientes! Por favor, recarregue sua conta.");
      return;
    }

    setLoadingAnalysis(true);
    setActiveTab('DNA');
    setResult(null);

    try {
      if (analysisMode === 'IMAGE') {
        if (!refImagePreview) return;
        const base64 = refImagePreview.split(',')[1];

        // CALL GENERAL AGENT
        const data = await reverseEngineerImage(base64, refMimeType, analysisInstruction);
        if (data) {
          setResult(data);
          // Pass base64 to be uploaded
          onSaveHistory("Reverse Engineering Analysis (Image)", data, refImagePreview);
        }

      } else {
        // TEXT MODE (Always General)
        if (!textPromptInput.trim()) return;
        const data = await reverseEngineerTextPrompt(textPromptInput);
        if (data) {
          setResult(data);
          onSaveHistory("Reverse Engineering Analysis (Text)", data);
        }
      }
    } catch (e) {
      console.error(e);
      alert("Erro na análise. Verifique sua API Key.");
    } finally {
      setLoadingAnalysis(false);
    }
  };

  // Helper validation
  const canAnalyze = analysisMode === 'IMAGE' ? !!refImagePreview : !!textPromptInput.trim();

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500 pb-12 relative">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-base-border pb-6">
        <div>
          <h2 className="text-3xl font-bold text-base-content flex items-center gap-3">
            <Icons.Aperture className="text-neon w-8 h-8" />
            Engenharia Reversa
          </h2>
          <p className="text-neutral-500 mt-1">Decodifique o DNA visual e aprenda a anatomia de um prompt perfeito.</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowReferenceGuide(true)}
            className="flex items-center gap-2 text-xs font-bold text-neon border border-neon/30 px-4 py-2 rounded-full hover:bg-neon/10 transition-colors shadow-[0_0_15px_rgba(255,95,0,0.1)] group"
          >
            <Icons.Book className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Guia de Prompt (Didático)
          </button>

          {/* TABS (Output View) - Only show if we have a GENERAL result */}
          {result && (
            <div className="flex bg-base-black p-1 rounded-xl border border-base-border">
              {[
                { id: 'DNA', label: 'Extração de DNA', icon: Icons.ScanLine },
                { id: 'STUDY', label: 'Anatomia (Ensino)', icon: Icons.GraduationCap },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                        flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all
                        ${activeTab === tab.id
                      ? 'bg-neon text-black shadow-[0_0_15px_rgba(255,95,0,0.4)] font-bold scale-105'
                      : 'text-neutral-500 hover:text-base-content hover:bg-white/5'}
                    `}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- REFERENCE GUIDE MODAL --- */}
      {showReferenceGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200" onClick={() => setShowReferenceGuide(false)}>
          <div className="bg-base-card border border-neutral-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar relative shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-base-card/95 backdrop-blur z-10 border-b border-neutral-800 p-6 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-base-content flex items-center gap-3">
                <Icons.Book className="text-neon w-6 h-6" /> Biblioteca de Engenharia de Prompt
              </h3>
              <button onClick={() => setShowReferenceGuide(false)} className="w-8 h-8 rounded-full bg-neutral-800 text-neutral-400 hover:text-base-content flex items-center justify-center">✕</button>
            </div>

            <div className="p-8 space-y-8">
              <div className="bg-base-black border border-neutral-800 rounded-xl p-4 mb-6">
                <p className="text-sm text-neutral-300 leading-relaxed">
                  <strong className="text-neon">A Fórmula Mestra:</strong> Um prompt profissional não é aleatório. Ele é construído em 4 camadas essenciais.
                  Entenda cada uma para sair do básico e atingir o fotorrealismo ou a estilização perfeita.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {guideLayers.map((layer) => (
                  <div key={layer.id} className={`rounded-xl border p-5 ${layer.bg} ${layer.border} relative overflow-hidden group hover:border-opacity-100 transition-colors`}>
                    <div className="flex items-center gap-3 mb-3 relative z-10">
                      <div className={`p-2 rounded-lg bg-black/30 ${layer.color}`}>
                        <layer.icon className="w-5 h-5" />
                      </div>
                      <h4 className={`text-lg font-bold ${layer.color}`}>{layer.title}</h4>
                    </div>
                    <p className="text-sm text-white font-medium mb-1 relative z-10">{layer.desc}</p>
                    <p className="text-xs text-neutral-400 mb-4 italic leading-relaxed relative z-10">"{layer.importance}"</p>

                    <div className="space-y-2 relative z-10">
                      <label className="text-[10px] uppercase font-bold text-neutral-500">Exemplos (Clique para Copiar)</label>
                      <div className="flex flex-wrap gap-2">
                        {layer.terms.map((term, tIdx) => (
                          <button
                            key={tIdx}
                            onClick={() => { navigator.clipboard.writeText(term); alert(`Copiado: ${term}`); }}
                            className="text-[10px] bg-black/40 hover:bg-white/20 border border-white/5 hover:border-white/40 text-neutral-200 px-2 py-1 rounded transition-colors cursor-pointer whitespace-nowrap"
                            title="Copiar termo"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl border border-neon/30 bg-gradient-to-r from-neon/10 to-transparent">
                <h4 className="text-sm font-bold text-neon mb-2 flex items-center gap-2">
                  <Icons.Terminal className="w-4 h-4" /> Exemplo de Montagem (Stacking)
                </h4>
                <code className="block font-mono text-xs text-neutral-300 bg-black/50 p-3 rounded border border-white/10">
                  /imagine prompt: <span className="text-blue-400">Cyberpunk Samurai</span> + <span className="text-purple-400">Unreal Engine 5 Render</span> + <span className="text-green-400">Volumetric Lighting, Neon Rim Light</span> + <span className="text-pink-400">Neon Noir Style</span> --ar 16:9
                </code>
                <p className="text-[10px] text-neutral-500 mt-2">
                  Dica: A ordem importa! O que vem primeiro tem mais peso para a IA (Midjourney/Flux).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- CONTENT AREA --- */}

      {/* 1. INPUT SECTION */}
      <div className="bg-base-card rounded-2xl border border-base-border overflow-hidden shadow-xl">

        {/* Input Mode Tabs */}
        <div className="flex border-b border-neutral-800">
          <button
            onClick={() => setAnalysisMode('IMAGE')}
            className={`flex-1 py-4 flex items-center justify-center gap-2 font-bold text-sm transition-colors ${analysisMode === 'IMAGE' ? 'bg-base-dark text-base-content border-b-2 border-neon text-neon' : 'text-neutral-500 hover:text-base-content bg-base-black'}`}
          >
            <Icons.Image className={`w-4 h-4 ${analysisMode === 'IMAGE' ? 'text-neon' : ''}`} />
            Decodificar Imagem
          </button>
          <button
            onClick={() => setAnalysisMode('TEXT')}
            className={`flex-1 py-4 flex items-center justify-center gap-2 font-bold text-sm transition-colors ${analysisMode === 'TEXT' ? 'bg-base-dark text-base-content border-b-2 border-neon text-neon' : 'text-neutral-500 hover:text-base-content bg-base-black'}`}
          >
            <Icons.Terminal className={`w-4 h-4 ${analysisMode === 'TEXT' ? 'text-neon' : ''}`} />
            Decodificar Prompt (Texto)
          </button>
        </div>

        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start">

          {/* LEFT SIDE: SOURCE INPUT */}
          <div className="w-full md:w-1/3">
            {analysisMode === 'IMAGE' ? (
              // IMAGE DROPZONE
              <>
                <div
                  className={`
                        w-full aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all relative group overflow-hidden
                        ${refImagePreview ? 'border-neon/50 bg-base-black' : 'border-base-border hover:border-neon/30 hover:bg-base-dark'}
                        `}
                  onClick={() => refInputRef.current?.click()}
                >
                  {refImagePreview ? (
                    <img src={refImagePreview} alt="Reference" className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-center p-6">
                      <div className="w-16 h-16 bg-base-dark rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Icons.Upload className="w-8 h-8 text-neutral-500 group-hover:text-neon" />
                      </div>
                      <p className="text-neutral-300 font-medium">Upload Imagem</p>
                      <p className="text-xs text-neutral-600 mt-2">Arraste ou clique</p>
                    </div>
                  )}
                  <input type="file" ref={refInputRef} onChange={(e) => e.target.files && handleRefFile(e.target.files[0])} className="hidden" accept="image/*" />
                </div>
              </>
            ) : (
              // TEXT INPUT AREA
              <div className="w-full aspect-square flex flex-col">
                <div className="bg-base-dark border border-base-border rounded-xl p-4 h-full relative group hover:border-neon/50 transition-colors shadow-inner">
                  <textarea
                    value={textPromptInput}
                    onChange={(e) => setTextPromptInput(e.target.value)}
                    placeholder="Cole aqui o prompt que você encontrou (ex: Midjourney, Civitai) para a IA decodificar..."
                    className="w-full h-full bg-transparent text-sm font-mono text-neon placeholder:text-neutral-500 outline-none resize-none custom-scrollbar"
                  />
                  <div className="absolute bottom-3 right-3 text-[10px] text-neutral-500 font-mono">
                    RAW PROMPT
                  </div>
                </div>
              </div>

            )}
          </div>

          {/* RIGHT SIDE: ACTIONS & INFO */}
          <div className="flex-1 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-base-content mb-2">
                {analysisMode === 'IMAGE' ? 'Análise Visual' : 'Análise Textual'}
              </h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                {analysisMode === 'IMAGE'
                  ? "A IA analisará iluminação, composição, paleta e estilo artístico desta imagem para extrair seu prompt e ensinar os conceitos."
                  : "A IA lerá o prompt colado, identificará os tokens técnicos, estilos e estruturas, explicando como eles afetam a geração da imagem."}
              </p>
            </div>

            {/* PRO TIP TICKER */}
            {!result && (
              <div className="bg-gradient-to-r from-neon/10 to-transparent border-l-2 border-neon p-3 rounded-r-lg animate-in fade-in duration-500">
                <div className="flex items-center gap-2 mb-1">
                  <Icons.Lightbulb className="w-3 h-3 text-neon" />
                  <span className="text-[10px] font-bold text-neon uppercase">Dica Pro: {guideLayers[activeTipIndex].title}</span>
                </div>
                <p className="text-xs text-neutral-300 italic">
                  "{guideLayers[activeTipIndex].importance}"
                </p>
              </div>
            )}

            {/* ANALYSIS INSTRUCTION INPUT (Only for Image Mode General) */}
            {analysisMode === 'IMAGE' && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-400 uppercase tracking-wide flex items-center gap-2">
                  <Icons.ScanLine className="w-4 h-4" />
                  Foco da Análise (Opcional)
                </label>
                <textarea
                  value={analysisInstruction}
                  onChange={(e) => setAnalysisInstruction(e.target.value)}
                  placeholder="Ex: Foque apenas na iluminação e nas cores, ignore os personagens..."
                  className="w-full bg-base-dark border border-neutral-800 rounded-xl p-3 text-sm text-base-content focus:border-neon focus:ring-1 focus:ring-neon outline-none resize-none h-24 placeholder:text-neutral-600"
                />
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={!canAnalyze || loadingAnalysis}
              className={`
                  flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all w-full md:w-auto justify-center md:justify-start
                  ${!canAnalyze
                  ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                  : loadingAnalysis
                    ? 'bg-neon/50 text-black cursor-wait'
                    : 'bg-neon hover:bg-neon-light text-black shadow-[0_0_20px_rgba(255,95,0,0.3)]'}
                `}
            >
              {loadingAnalysis ? <Icons.ScanLine className="animate-spin" /> : <Icons.Aperture />}
              {loadingAnalysis ? 'PROCESSANDO...' : (analysisMode === 'IMAGE' ? 'EXTRAIR DNA & ENSINAR' : 'DECODIFICAR PROMPT')}
            </button>
          </div>
        </div>
      </div>

      {/* --- TAB: VISUAL DNA (RESULTS - GENERAL) --- */}
      {
        activeTab === 'DNA' && result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4">
            <div className="bg-base-card p-6 rounded-2xl border border-base-border space-y-4">
              <div className="flex items-center gap-2 text-neon mb-2">
                <Icons.Eye className="w-5 h-5" />
                <h3 className="font-bold uppercase tracking-wider">Análise Semiótica</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-neutral-500 font-mono uppercase">Estilo Artístico</label>
                  <p className="text-base-content font-medium">{result.artStyle}</p>
                </div>
                <div>
                  <label className="text-xs text-neutral-500 font-mono uppercase">Descrição / Intenção</label>
                  <p className="text-neutral-300 text-sm leading-relaxed">{result.description}</p>
                </div>
                <div>
                  <label className="text-xs text-neutral-500 font-mono uppercase">Composição & Luz</label>
                  <p className="text-neutral-300 text-sm leading-relaxed">{result.composition}</p>
                </div>
              </div>
            </div>

            <div className="bg-base-card p-6 rounded-2xl border border-base-border space-y-4 flex flex-col">
              <div className="flex items-center gap-2 text-neon mb-2">
                <Icons.Terminal className="w-5 h-5" />
                <h3 className="font-bold uppercase tracking-wider">{analysisMode === 'IMAGE' ? 'Prompt Gerado' : 'Prompt Analisado'}</h3>
              </div>
              <div className="flex-1 bg-base-dark rounded-xl p-4 border border-base-border relative group">
                <button
                  onClick={() => navigator.clipboard.writeText(result.detailedPrompt)}
                  className="absolute top-2 right-2 p-2 bg-base-card rounded hover:text-neon transition-colors"
                >
                  <Icons.Copy className="w-4 h-4" />
                </button>
                <code className="text-sm font-mono text-neutral-400 block leading-relaxed h-full overflow-y-auto max-h-[200px] custom-scrollbar">
                  {result.detailedPrompt}
                </code>
              </div>
            </div>
          </div>
        )
      }

      {/* --- TAB: STUDY (EDUCATION / ANATOMY - GENERAL) --- */}
      {
        activeTab === 'STUDY' && result && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4">

            {/* 1. PROMPT ANATOMY */}
            <section className="bg-base-black border border-neon/30 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon via-purple-500 to-blue-500"></div>

              <div className="flex items-center gap-3 mb-6">
                <div className="bg-neon/10 p-2 rounded-lg text-neon">
                  <Icons.Layers className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Anatomia do Prompt</h3>
                  <p className="text-xs text-neutral-500">Entenda as 4 camadas essenciais que compõem esta estrutura.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {result.promptLayers?.map((layer, idx) => {
                  let colorClass = "border-neutral-700 text-neutral-300";
                  let icon = Icons.Box;
                  let label = "Camada";

                  if (layer.layerType === 'SUBJECT') { colorClass = "border-blue-500/50 text-blue-400 bg-blue-900/10"; icon = Icons.User; label = "SUJEITO"; }
                  if (layer.layerType === 'MEDIUM') { colorClass = "border-purple-500/50 text-purple-400 bg-purple-900/10"; icon = Icons.Paintbrush; label = "MÍDIA / ARTE"; }
                  if (layer.layerType === 'LIGHTING_CAMERA') { colorClass = "border-green-500/50 text-green-400 bg-green-900/10"; icon = Icons.Camera; label = "CÂMERA & LUZ"; }
                  if (layer.layerType === 'STYLE_VIBE') { colorClass = "border-pink-500/50 text-pink-400 bg-pink-900/10"; icon = Icons.Sparkles; label = "ESTILO & VIBE"; }

                  return (
                    <div key={idx} className={`border rounded-xl p-4 transition-all hover:translate-x-1 ${colorClass}`}>
                      <div className="flex flex-col md:flex-row gap-4 md:items-center">
                        <div className="w-24 shrink-0 flex flex-col gap-1">
                          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider opacity-80">
                            {React.createElement(icon, { className: "w-3 h-3" })}
                            {label}
                          </div>
                        </div>

                        <div className="flex-1 font-mono text-sm border-l border-white/10 pl-4 py-1 break-words">
                          "{layer.content}"
                        </div>

                        <div className="md:w-1/3 text-xs opacity-70 italic border-l border-white/10 pl-4 py-1">
                          <Icons.Info className="w-3 h-3 inline mr-1" />
                          {layer.explanation}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 2. TECHNICAL TERMS (VOCABULARY) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {result.promptBreakdown.map((item, idx) => (
                <div key={idx} className="bg-base-card border border-base-border p-5 rounded-xl hover:border-neon/30 transition-all group">
                  <div className="flex items-center gap-2 mb-3">
                    <Icons.Book className="text-neon w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="font-mono text-xs text-neon uppercase border border-neon/20 px-2 py-0.5 rounded">Vocabulário</span>
                  </div>
                  <h4 className="text-lg font-bold text-base-content mb-2">{item.term}</h4>
                  <p className="text-sm text-neutral-400 leading-relaxed">{item.explanation}</p>
                </div>
              ))}
            </div>

            {/* 3. OPTIMIZATION LOGIC */}
            <div className="bg-gradient-to-r from-base-card to-base-dark border border-neon/20 p-8 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-neon/5 rounded-full blur-[80px]"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-neon text-black p-2 rounded-lg">
                    <Icons.Zap className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Prompt Otimizado (Expert Level)</h3>
                </div>
                <p className="text-neutral-400 mb-6 max-w-2xl">{result.improvementLogic}</p>
                <div className="bg-black/80 border border-neon/30 p-6 rounded-xl font-mono text-neon text-sm md:text-base shadow-inner">
                  {result.improvedPrompt}
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default ReverseEngineer;
