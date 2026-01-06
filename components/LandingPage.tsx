import React from 'react';
import { Icons } from './Icons';
import { HeroInterface } from './HeroInterface';

interface LandingPageProps {
    onLogin: () => void;
}

const PLANS = [
    {
        name: 'Starter Pack',
        credits: 250,
        price: '19,90',
        link: 'https://pay.kiwify.com.br/xkMQJfr',
        features: ['Acesso a todas as ferramentas', '250 Créditos de Geração', 'Histórico Limitado', 'Suporte Básico'],
        highlight: false
    },
    {
        name: 'Pro Creator',
        credits: 750,
        price: '49,90',
        link: 'https://pay.kiwify.com.br/IgcHt7I',
        features: ['Melhor Custo-Benefício', '750 Créditos Mensais', 'Velocidade Prioritária', 'Acesso a Beta Features'],
        highlight: true
    },
    {
        name: 'Elite Studio',
        credits: 1800,
        price: '99,90',
        link: 'https://pay.kiwify.com.br/KPOP4Nq',
        features: ['Para Uso Profissional', '1800 Créditos', 'Suporte VIP via WhatsApp', 'Consultoria de Prompt Mensal'],
        highlight: false
    }
];

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {

    const handleBuy = (link: string) => {
        window.open(link, '_blank');
    };

    const scrollToPricing = () => {
        const pricingSection = document.getElementById('pricing');
        if (pricingSection) {
            pricingSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-transparent text-[#E5E5E5] font-sans selection:bg-neon selection:text-black overflow-x-hidden relative">

            {/* GLOBAL BACKGROUND ELEMENTS (handled by index.css) */}


            {/* 2. Large Glowing Orbs (Static for performance, could be animated) */}
            <div className="fixed top-[-20%] left-[-10%] w-[800px] h-[800px] bg-neon/5 rounded-full blur-[150px] pointer-events-none mix-blend-screen opacity-60"></div>
            <div className="fixed bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none mix-blend-screen opacity-40"></div>


            {/* Navbar */}
            <nav className="fixed top-0 left-0 z-50 w-full bg-[#0A0A0A]/50 backdrop-blur-md border-b border-white/5 h-20 transition-all duration-300">
                <div className="max-w-[1400px] mx-auto h-full px-6 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="w-8 h-8 bg-neon/10 rounded-lg flex items-center justify-center border border-neon/20">
                            <Icons.Zap className="text-neon w-4 h-4" />
                        </div>
                        <span className="font-bold tracking-tight text-white text-lg">Alquimia<span className="text-neon">Criativa</span></span>
                    </div>

                    {/* Navigation Links - Centered */}
                    <div className="hidden md:flex items-center gap-8">
                        <button onClick={() => document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium text-neutral-400 hover:text-white hover:text-neon transition-colors">
                            O Problema
                        </button>
                        <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium text-neutral-400 hover:text-white hover:text-neon transition-colors">
                            Funcionalidades
                        </button>
                        <button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium text-neutral-400 hover:text-white hover:text-neon transition-colors">
                            Planos
                        </button>
                    </div>

                    {/* CTA Actions */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onLogin}
                            className="text-sm font-medium text-white hover:text-neon transition-colors hidden sm:block"
                        >
                            Login
                        </button>
                        <button
                            onClick={onLogin}
                            className="bg-neon text-black px-6 py-2.5 rounded-full font-bold text-xs hover:bg-neon-light transition-all shadow-[0_0_20px_rgba(255,95,0,0.3)] hover:shadow-[0_0_30px_rgba(255,95,0,0.5)] tracking-wide uppercase"
                        >
                            Começar Agora
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section: The Portal (V2 Central Axis) */}
            <header className="relative pt-40 pb-32 px-6 max-w-[1600px] mx-auto z-10 flex flex-col items-center justify-center min-h-screen text-center perspective-2000">
                {/* FLOATING PROMPT BOXES (SVG) */}

                {/* Top Left - Large */}
                <div className="absolute top-[15%] left-[5%] md:left-[10%] w-32 md:w-64 opacity-60 pointer-events-none animate-float-slow z-0">
                    <svg viewBox="0 0 280 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_15px_rgba(255,95,0,0.3)]">
                        <rect x="1" y="1" width="278" height="118" rx="12" fill="#050505" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                        <circle cx="20" cy="20" r="4" fill="#FF5F58" />
                        <circle cx="36" cy="20" r="4" fill="#FFBD2E" />
                        <circle cx="52" cy="20" r="4" fill="#28C840" />
                        <rect x="20" y="45" width="200" height="8" rx="4" fill="rgba(255,255,255,0.1)" />
                        <rect x="20" y="65" width="140" height="8" rx="4" fill="rgba(255,255,255,0.1)" />
                        <rect x="20" y="85" width="6" height="14" fill="#FF5F00" className="animate-pulse" />
                        <text x="32" y="97" fontFamily="monospace" fontSize="12" fill="#FF5F00">/imagine future...</text>
                    </svg>
                </div>

                {/* Top Right - Medium */}
                <div className="absolute top-[20%] right-[5%] md:right-[12%] w-24 md:w-48 opacity-40 pointer-events-none animate-float-medium animation-delay-1000 z-0">
                    <svg viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                        <rect x="1" y="1" width="198" height="98" rx="12" fill="#0A0A0A" stroke="rgba(255,95,0,0.2)" strokeWidth="2" />
                        <rect x="15" y="15" width="40" height="40" rx="8" fill="rgba(255,95,0,0.1)" />
                        <path d="M25 35L35 35" stroke="#FF5F00" strokeWidth="2" strokeLinecap="round" />
                        <path d="M25 42L45 42" stroke="#FF5F00" strokeWidth="2" strokeLinecap="round" />
                        <rect x="70" y="20" width="100" height="6" rx="3" fill="rgba(255,255,255,0.2)" />
                        <rect x="70" y="35" width="80" height="6" rx="3" fill="rgba(255,255,255,0.1)" />
                        <rect x="70" y="50" width="60" height="6" rx="3" fill="rgba(255,255,255,0.1)" />
                    </svg>
                </div>

                {/* Bottom Left - Small (Mobile Optimized) */}
                <div className="absolute bottom-[20%] left-[2%] md:left-[15%] w-20 md:w-40 opacity-30 pointer-events-none animate-float-medium animation-delay-2000 z-0">
                    <svg viewBox="0 0 160 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <rect x="1" y="1" width="158" height="78" rx="10" fill="#000" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                        <text x="15" y="45" fontFamily="monospace" fontSize="10" fill="#666">weight: 0.8</text>
                        <text x="15" y="60" fontFamily="monospace" fontSize="10" fill="#666">--v 6.0</text>
                    </svg>
                </div>

                {/* Bottom Right - Accent */}
                <div className="absolute bottom-[30%] right-[5%] md:right-[10%] w-28 md:w-56 opacity-50 pointer-events-none animate-float-slow animation-delay-500 z-0">
                    <svg viewBox="0 0 240 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
                        <rect x="1" y="1" width="238" height="98" rx="12" fill="#080808" stroke="rgba(255,95,0,0.15)" strokeWidth="2" />
                        <circle cx="20" cy="50" r="12" stroke="#FF5F00" strokeWidth="2" />
                        <path d="M45 45H200" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeLinecap="round" />
                        <path d="M45 55H160" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeLinecap="round" />
                        <rect x="200" y="40" width="20" height="20" rx="4" fill="#FF5F00" />
                    </svg>
                </div>

                {/* Central Neural Spine (Visual Connector) */}
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-white/5 pointer-events-none -z-10">
                    <div className="signal-packet"></div>
                </div>

                {/* Main Copy */}
                <div className="relative z-20 mb-12 animate-in fade-in zoom-in duration-1000">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-neon font-mono text-xs tracking-[0.2em] mb-6 backdrop-blur-md">
                        SYSTEM_ONLINE // V2.0
                    </span>
                    <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter leading-[0.9] mb-8">
                        DO OPERÁRIO <br />
                        <span className="text-neon">AO ORQUESTRADOR</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                        Elimine a aleatoriedade. Transforme sua criatividade em engenharia de precisão com o primeiro <span className="text-white">Sistema Operacional de Prompts</span>.
                    </p>
                </div>

                {/* Actions (Floating above the portal) */}
                <div className="relative z-30 flex flex-col md:flex-row gap-6 mb-[-60px]">
                    <button
                        onClick={onLogin}
                        className="group relative px-8 py-4 bg-neon text-black font-bold text-sm tracking-widest uppercase hover:bg-white transition-all shadow-[0_0_40px_rgba(255,95,0,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] clip-path-polygon"
                        style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' }}
                    >
                        Começar Agora
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </button>

                    <button
                        onClick={() => document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' })}
                        className="px-8 py-4 bg-black/50 backdrop-blur-md border border-white/10 text-white font-bold text-sm tracking-widest uppercase hover:bg-white/10 hover:border-white/30 transition-all"
                        style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' }}
                    >
                        Ver Demo
                    </button>
                </div>

                {/* The Portal (Dashboard Image Tilted) */}
                <div className="relative w-full max-w-6xl mt-12 group perspective-2000">

                    {/* Backlight Glow for Depth */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[300px] bg-neon/20 blur-[120px] rounded-full pointer-events-none -z-10 group-hover:bg-neon/30 transition-all duration-1000"></div>

                    <div className="relative transform rotate-x-25 scale-95 group-hover:rotate-x-12 group-hover:scale-100 transition-all duration-1000 ease-out origin-top border border-white/10 rounded-t-3xl bg-[#050505] overflow-hidden portal-glow shadow-2xl">
                        <HeroInterface />
                    </div>
                </div>
            </header>

            {/* Tech Stack Band - Matte Black with Neon Orange Accents */}
            <div className="relative z-20 bg-[#050505] overflow-hidden py-4">
                <div className="absolute inset-0 bg-neon/5 opacity-20"></div>
                <div className="max-w-[1600px] mx-auto px-6 relative flex flex-col md:flex-row items-center gap-4">

                    {/* Label */}
                    <div className="shrink-0 flex items-center gap-2 hidden md:flex">
                        <div className="w-1.5 h-1.5 bg-neon rounded-full animate-pulse shadow-[0_0_10px_#FF5F00]"></div>
                        <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest leading-tight">
                            Powering <br /> <span className="text-neutral-300 font-bold">Next-Gen</span>
                        </span>
                    </div>

                    {/* Logos Marquee */}
                    <div className="flex-1 w-full overflow-hidden mask-linear-fade">
                        <div className="flex gap-12 animate-marquee whitespace-nowrap items-center">
                            {[
                                'Midjourney', 'Runway', 'Pika', 'n8n', 'Make.com', 'Lovable', 'Google Stitch', 'Firebase', 'Google AI Studio', 'Adobe Firefly',
                                'Midjourney', 'Runway', 'Pika', 'n8n', 'Make.com', 'Lovable', 'Google Stitch', 'Firebase', 'Google AI Studio', 'Adobe Firefly'
                            ].map((logo, i) => (
                                <span key={i} className="text-lg font-medium text-neutral-700 hover:text-neon transition-colors cursor-default select-none flex items-center gap-2 font-sans tracking-tight">
                                    {logo === 'n8n' && <Icons.Workflow className="w-4 h-4 mb-0.5" />}
                                    {logo === 'Firebase' && <Icons.Database className="w-4 h-4 mb-0.5" />}
                                    {logo}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* The Problem (Split Screen) - Vitality Refactor */}
            <section id="problem" className="py-12 px-6 relative z-10"> {/* Reduced padding */}
                {/* Floating "Glitch" SVGs - Boosted Visibility */}


                <div className="max-w-[1400px] mx-auto flex flex-col gap-16 items-center relative z-10 w-full">

                    {/* Content - Centered for better vertical layout */}
                    <div className="w-full text-center max-w-4xl mx-auto">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Icons.AlertTriangle className="w-4 h-4 text-neon" />
                            <span className="text-neon font-mono text-sm tracking-widest uppercase">01 // O Problema</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tighter leading-tight">
                            A Luta Diária com <br />Prompts <span className="text-neon">Vagos.</span>
                        </h2>
                        <p className="text-neutral-400 text-lg mb-12 leading-relaxed max-w-2xl mx-auto">
                            Você investe horas refinando, mas o resultado continua genérico. A falta de <span className="text-white">controle técnico</span> transforma sua criatividade em um jogo de adivinhação.
                        </p>

                        <div className="grid md:grid-cols-3 gap-6 text-left">
                            {[
                                { title: 'Resultados Inconsistentes', desc: 'Cada geração é uma surpresa, geralmente ruim.', icon: Icons.Shuffle },
                                { title: 'Desperdício de Recursos', desc: 'Créditos e horas queimados em tentativas falhas.', icon: Icons.AlertTriangle },
                                { title: 'Falta de Identidade', desc: 'Visuais que parecem "stock photo" de IA.', icon: Icons.ScanLine }
                            ].map((item, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-xl group hover:border-neon/50 hover:bg-neon/5 transition-all">
                                    <div className="w-10 h-10 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-neon/10 group-hover:text-neon transition-colors">
                                        <item.icon className="w-5 h-5 text-neutral-400 group-hover:text-neon" />
                                    </div>
                                    <h3 className="text-white font-bold mb-2 group-hover:text-neon transition-colors">{item.title}</h3>
                                    <p className="text-neutral-400 text-sm">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Gallery Grid - Repositioned Below and resized (5 columns) */}
                    <div className="w-full">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {[
                                'img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg',
                                'img6.jpg', 'img7.jpg', 'img8.jpg', 'img9.jpg', 'img10.jpg'
                            ].map((img, idx) => (
                                <div key={idx} className="group relative overflow-hidden rounded-xl border border-white/10 bg-black aspect-[3/4] hover:scale-105 transition-all duration-500 hover:z-20 hover:border-neon/50">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 duration-500"></div>
                                    <img src={`/gallery/${img}`} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </section>

            {/* The Solution (Bento Grid) - Vitality Refactor */}
            <section id="features" className="py-24 px-6 relative z-10 bg-[#080808]/50 border-t border-white/5"> {/* Reduced padding */}
                {/* Floating "Blueprint" SVGs - Boosted Visibility */}


                <div className="max-w-[1400px] mx-auto relative z-10">
                    <div className="text-center mb-20"> {/* Reduced margin */}
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Icons.Settings className="w-4 h-4 text-neon" /> {/* Fixed Icon */}
                            <span className="text-neon font-mono text-sm tracking-widest uppercase">02 // O Sistema</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tighter">
                            Da Frustração à <span className="text-neon underline decoration-neon/30 underline-offset-8">Maestria.</span>
                        </h2>
                        <p className="text-neutral-400 max-w-xl mx-auto text-lg leading-relaxed">
                            O Alquimia Criativa não é só "mais uma ferramenta". É o primeiro <span className="text-white">ecossistema de engenharia</span> que transforma ideias vagas em specs precisas.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[280px]"> {/* Adjusted row height */}
                        {[
                            {
                                id: '01',
                                icon: Icons.Zap,
                                title: 'Gerador de Prompts',
                                desc: 'Direção de arte técnica baseada em geometria e luz.',
                                prompt: '/imagine prompt: cinematic lighting, 8k --v 5.2'
                            },
                            {
                                id: '02',
                                icon: Icons.Palette,
                                title: 'Laboratório Criativo',
                                desc: 'Geração e síntese de imagens com matriz criativa.',
                                prompt: '[matrix] style: cyberpunk, neon --ar 16:9'
                            },
                            {
                                id: '03',
                                icon: Icons.Bot,
                                title: 'Arquiteto de Agentes',
                                desc: 'System Prompts robustos para n8n e LangChain.',
                                prompt: 'sys_prompt: "You are an expert AI engineer..."'
                            },
                            {
                                id: '05',
                                icon: Icons.Code,
                                title: 'Engenharia Reversa',
                                desc: 'Decodifique o DNA visual de qualquer imagem.',
                                prompt: 'analyzing_image_source... 100%'
                            },
                            {
                                id: '04',
                                icon: Icons.Layers,
                                title: 'Studio de Marca',
                                desc: 'Identidade visual completa alimentada por IA.',
                                prompt: 'brand_identity.json loading... [OK]'
                            },
                            {
                                id: '06',
                                icon: Icons.Film,
                                title: 'Sequenciador',
                                desc: 'Roteiros e storyboards técnicos completos.',
                                prompt: 'timeline.add(scene_01, duration=5s)'
                            },
                            {
                                id: '07',
                                icon: Icons.Book,
                                title: 'Biblioteca',
                                desc: 'Explore e reutilize os melhores prompts.',
                                prompt: 'import { best_prompts } from \'db\''
                            },
                            {
                                id: '08',
                                icon: Icons.School,
                                title: 'Academy',
                                desc: 'Do Operário a Orquestrador.',
                                prompt: 'user.level_up(MASTER_ORCHESTRATOR)'
                            },
                            {
                                id: '09',
                                icon: Icons.FileText,
                                title: 'Gerador de PRD',
                                desc: 'Specs de produto nível Big Tech.',
                                prompt: 'generate_specs(requirements) -> .pdf'
                            },
                            {
                                id: '10',
                                icon: Icons.History,
                                title: 'Histórico',
                                desc: 'Organize, itere e evolua.',
                                prompt: 'log.save(session_data, timestamp)'
                            }
                        ].map((lab: any, i) => (
                            <div
                                key={i}
                                className="group relative border border-white/5 bg-[#0A0A0A] hover:bg-[#111] hover:border-neon/30 transition-all duration-300 p-6 rounded-2xl flex flex-col justify-between overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[60px] -mr-16 -mt-16 pointer-events-none group-hover:bg-neon/10 transition-colors"></div>

                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center border border-white/5 bg-[#151515] text-white group-hover:scale-110 group-hover:text-neon transition-all">
                                            <lab.icon className="w-5 h-5" />
                                        </div>
                                        <span className="font-mono text-[9px] text-neutral-700 group-hover:text-neon transition-colors border border-white/5 px-2 py-1 rounded">
                                            LAB_{lab.id}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-neon transition-colors flex items-center gap-2">
                                        {lab.title}
                                        <Icons.ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-neon -rotate-45" />
                                    </h3>
                                    <p className="text-xs text-neutral-500 leading-relaxed max-w-sm mb-4">
                                        {lab.desc}
                                    </p>
                                </div>

                                {/* Prompt Window - Cohesive Nomenclature */}
                                <div className="mt-auto relative rounded-lg bg-black/50 border border-white/5 p-2 font-mono text-[10px] text-neutral-400 overflow-hidden group-hover:border-neon/20 transition-colors">
                                    <div className="flex items-center gap-1.5 mb-1.5 opacity-50 border-b border-white/5 pb-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                        <span className="ml-auto text-[8px]">bash</span>
                                    </div>
                                    <div className="truncate">
                                        <span className="text-neon">$</span> {lab.prompt}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison (Stats Dashboard Style) - Vitality Refactor */}
            <section className="py-24 px-6 relative z-10 border-t border-white/5 bg-[#020202]"> {/* Reduced padding */}
                {/* Floating "Node" SVGs - Boosted Visibility */}
                <div className="absolute bottom-[10%] left-0 lg:left-12 w-64 opacity-50 pointer-events-none animate-float-medium z-0">
                    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full text-white">
                        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1" strokeDasharray="10 5" className="animate-[spin_10s_linear_infinite]" />
                        <circle cx="50" cy="50" r="20" fill="currentColor" fillOpacity="0.2" />
                        <circle cx="50" cy="50" r="4" fill="currentColor" />
                    </svg>
                </div>

                <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10"> {/* Reduced gap */}

                    {/* Left: Text Context */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Icons.TrendingUp className="w-4 h-4 text-neon" /> {/* Fixed Icon */}
                            <span className="text-neon font-mono text-sm tracking-widest uppercase">03 // Performance</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">Otimização de <br /><span className="text-neon border-b border-neon/30 pb-2">Nível Engenharia.</span></h2>
                        <p className="text-neutral-400 text-lg leading-relaxed mb-8">
                            Não é apenas sobre "melhores imagens". É sobre eliminar a aleatoriedade e atingir métricas <span className="text-white">previsíveis</span>.
                        </p>

                        <div className="flex gap-8 border-t border-white/5 pt-6">
                            <div>
                                <div className="text-3xl font-bold text-white mb-1 flex items-end gap-1">10x <Icons.Zap className="w-5 h-5 text-neon mb-1" /></div>
                                <div className="text-[10px] text-neutral-500 uppercase tracking-widest">Mais Rápido</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-white mb-1 flex items-end gap-1">100% <Icons.Check className="w-5 h-5 text-neon mb-1" /></div> {/* Fixed Icon */}
                                <div className="text-[10px] text-neutral-500 uppercase tracking-widest">Replicável</div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Stats Interface (Ariyan Style) */}
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-[1.5rem] p-8 relative overflow-hidden shadow-2xl">
                        {/* Decorative background glow */}
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-neon/10 rounded-full blur-[80px] pointer-events-none"></div>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 bg-[#151515] rounded-xl flex items-center justify-center border border-white/5 box-shadow-neon">
                                <Icons.TrendingUp className="w-5 h-5 text-neon" /> {/* Fixed Icon */}
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-base">Métricas do Sistema</h3>
                                <p className="text-neutral-500 text-[10px] font-mono flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                    LIVE MONITORING
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {[
                                { label: 'Consistência Estética', val: '98%' },
                                { label: 'Economia de Tokens', val: '85%' },
                                { label: 'Velocidade de Iteração', val: '92%' },
                                { label: 'Controle Técnico', val: '100%' }
                            ].map((stat, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-xs mb-1.5">
                                        <span className="text-neutral-300 font-medium">{stat.label}</span>
                                        <span className="text-neon font-bold font-mono">{stat.val}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-[#151515] rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-neon/50 to-neon rounded-full shadow-[0_0_10px_rgba(255,95,0,0.5)]"
                                            style={{ width: stat.val }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Target Audience (Simplifed Grid) */}
            <section className="py-20 px-6 relative z-10 border-t border-white/5 bg-[#080808]/50">  {/* Reduced padding */}
                <div className="max-w-[1400px] mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-12 text-center flex items-center justify-center gap-3">
                        <Icons.Team className="w-6 h-6 text-neutral-600" /> {/* Fixed Icon */}
                        Quem domina com o <span className="text-neon">Alquimia</span>
                    </h2>

                    <div className="grid md:grid-cols-5 gap-4"> {/* Reduced gap */}
                        {[
                            { title: 'Designers', desc: 'Direção de arte precisa.', icon: Icons.Pen }, // Fixed Icon
                            { title: 'Devs', desc: 'Sistemas e automação.', icon: Icons.Terminal },
                            { title: 'Agências', desc: 'Escala com qualidade.', icon: Icons.Briefcase },
                            { title: 'Founders', desc: 'MVPs de marca rápidos.', icon: Icons.Zap }, // Fixed Icon
                            { title: 'Creators', desc: 'Conteúdo high-end.', icon: Icons.Video }
                        ].map((item, i) => (
                            <div key={i} className="bg-[#0A0A0A] p-6 rounded-xl border border-white/5 hover:border-neon/40 hover:bg-[#111] transition-all text-center group">
                                <div className="w-10 h-10 mx-auto rounded-full bg-[#151515] flex items-center justify-center mb-3 group-hover:bg-neon/10 transition-colors">
                                    <item.icon className="w-4 h-4 text-neutral-500 group-hover:text-neon transition-colors" />
                                </div>
                                <h3 className="font-bold text-white mb-1 group-hover:text-neon transition-colors text-sm">{item.title}</h3>
                                <p className="text-neutral-500 text-[10px]">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section - Vitality Refactor */}
            <section id="pricing" className="py-24 px-6 relative z-10 overflow-hidden bg-[#050505]">  {/* Reduced padding */}
                {/* Floating "Energy" SVGs - Boosted Visibility */}


                {/* Large glow behind pricing */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] bg-neon/5 rounded-full blur-[150px] pointer-events-none"></div>

                <div className="max-w-[1400px] mx-auto relative z-10 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Icons.CreditCard className="w-4 h-4 text-neon" />
                        <span className="text-neon font-mono text-sm tracking-widest uppercase">04 // Acesso VIP</span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tighter">Comece a <span className="text-neon italic">Orquestrar.</span></h2>
                    <p className="text-neutral-400 mb-16 max-w-lg mx-auto">Escolha o poder de processamento que sua criatividade exige. Acesso vitalício disponível por tempo limitado.</p>

                    <div className="grid md:grid-cols-3 gap-6 items-center lg:items-stretch max-w-5xl mx-auto"> {/* Reduced gap */}
                        {PLANS.map((plan) => (
                            <div
                                key={plan.name}
                                className={`
                                    relative p-8 rounded-[2rem] border flex flex-col transition-all duration-300 group
                                    ${plan.highlight
                                        ? 'bg-[#0E0E0E] border-neon/50 shadow-[0_0_80px_rgba(255,95,0,0.15)] lg:-mt-6 lg:mb-6 z-10 min-h-[550px]'
                                        : 'bg-[#0A0A0A] border-white/5 hover:border-neon/30 hover:bg-[#111] min-h-[450px] hover:scale-105'}
                                `}
                            >
                                {plan.highlight && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-neon text-black text-xs uppercase font-bold px-6 py-1.5 rounded-full tracking-wider shadow-lg shadow-neon/20 flex items-center gap-2">
                                        <Icons.Star className="w-3 h-3 fill-black" /> RECOMENDADO
                                    </div>
                                )}

                                <div className="mb-8 text-center">
                                    <h3 className="text-lg font-bold text-neutral-400 mb-3 tracking-widest uppercase font-mono flex items-center justify-center gap-2">
                                        {plan.name === 'Essencial' && <Icons.Zap className="w-5 h-5" />}
                                        {plan.name === 'Profissional' && <Icons.Settings className="w-5 h-5 text-neon" />}
                                        {plan.name === 'Elite Studio' && <Icons.Globe className="w-5 h-5" />}
                                        {plan.name}
                                    </h3>
                                    <div className="text-6xl font-bold text-white tracking-tighter">
                                        <span className="text-2xl text-neutral-600 align-top mr-1 font-sans font-medium">R$</span>{plan.price}
                                    </div>
                                    <p className="text-neutral-500 text-xs mt-3 uppercase tracking-wider">pagamento único</p>
                                </div>

                                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8"></div>

                                <ul className="space-y-4 flex-1 mb-8 text-left px-2">
                                    {plan.features.map((feat, i) => (
                                        <li key={i} className="text-sm text-neutral-300 flex gap-3 items-start">
                                            {plan.highlight
                                                ? <Icons.Check className="w-4 h-4 text-neon shrink-0 mt-0.5" />
                                                : <div className="w-1.5 h-1.5 rounded-full bg-neutral-600 shrink-0 mt-1.5"></div>
                                            }
                                            {feat}
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => handleBuy(plan.link)}
                                    className={`
                                        w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 group-hover:gap-3 uppercase tracking-widest
                                        ${plan.highlight
                                            ? 'bg-neon hover:bg-neon-light text-black shadow-[0_0_20px_rgba(255,95,0,0.3)] hover:shadow-[0_0_30px_rgba(255,95,0,0.5)]'
                                            : 'bg-white/5 hover:bg-white text-white hover:text-black border border-white/5'}
                                    `}
                                >
                                    ASSINAR AGORA <Icons.ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="mt-24 pt-12 border-t border-white/5">
                        <p className="text-neutral-500 font-mono text-xs mb-6 uppercase tracking-widest flex items-center justify-center gap-2">
                            <Icons.Box className="w-4 h-4 text-neon" />
                            Incluso em todos os planos
                        </p>
                        <div className="flex flex-wrap justify-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
                            {[
                                'Framework Role-Context-Task',
                                'Guia de Prompt Didático',
                                'Biblioteca de Estilos Mestres',
                                'DNA de Estilo Extraível'
                            ].map((bonus, i) => (
                                <div key={i} className="px-5 py-2 rounded-full border border-white/10 bg-white/5 text-xs text-neutral-300 flex items-center gap-2 hover:border-neon/30 transition-colors">
                                    <Icons.Check className="w-3.5 h-3.5 text-neon" /> {bonus}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section >

            {/* Footer - Tech Minimalist */}
            < footer className="py-24 border-t border-white/5 bg-[#020202] text-center relative z-10" >
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-16">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-neon/10 rounded-lg flex items-center justify-center border border-neon/20">
                                <Icons.Zap className="text-neon w-4 h-4" />
                            </div>
                            <span className="font-bold tracking-tight text-white text-lg">Alquimia<span className="text-neon">Criativa</span></span>
                        </div>

                        <div className="flex gap-8 text-sm text-neutral-400">
                            <a href="#" className="hover:text-white transition-colors">Login</a>
                            <a href="#" className="hover:text-white transition-colors">Começar</a>
                            <a href="#" className="hover:text-white transition-colors">Suporte</a>
                        </div>
                    </div>

                    <div className="w-full h-px bg-white/5 mb-12"></div>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-neutral-600 text-xs font-mono">
                            © 2025 ALQUIMIA FORGE SUITE. ALL RIGHTS RESERVED.
                        </p>
                        <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-xs font-mono text-neutral-500">SYSTEM OPERATIONAL</span>
                        </div>
                    </div>
                </div>
            </footer >
        </div >
    );
};

export default LandingPage;
