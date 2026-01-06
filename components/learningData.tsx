import React from 'react';
import { Icons } from './Icons';

export interface Lesson {
    id: string;
    title: string;
    category: 'O DESPERTAR' | 'ARQUITETURA' | 'DIREÇÃO DE ARTE' | 'CONSISTÊNCIA' | 'BUSINESS';
    duration: string;
    content: React.ReactNode;
}

export const lessons: Lesson[] = [
    // --- PHASE 1: O DESPERTAR ---
    {
        id: 'fim-do-acaso',
        title: 'O Fim do Acaso',
        category: 'O DESPERTAR',
        duration: '15 min de Estudo Profundo',
        content: (
            <div className="space-y-12">
                <div className="border-l-4 border-neon pl-8 py-4 bg-gradient-to-r from-neon/5 to-transparent rounded-r-xl">
                    <h2 className="text-4xl font-bold text-white mb-4">De Operário a Orquestrador</h2>
                    <p className="text-2xl text-neon italic font-light">"A maestria migrou do 'como fazer' para o 'porquê fazer'."</p>
                </div>

                <div className="prose prose-invert max-w-none">
                    <p className="text-neutral-300 text-lg leading-relaxed">
                        Assistimos ao fim da era em que a execução técnica era o principal gargalo. Hoje, a distância entre a ideia e a concretização é uma linha de comando. Mas cuidado: <strong>a perfeição técnica tornou-se o novo padrão básico.</strong> Se todos podem gerar imagens perfeitas, o que diferencia a sua?
                    </p>
                    <p className="text-neutral-300 text-lg leading-relaxed mt-4">
                        O erro do iniciante é tratar a IA como uma máquina de slot (caça-níqueis), onde se coloca uma moeda (prompt ruim) e torce pelo jackpot. O Orquestrador trata a IA como um estúdio de cinema infinito onde ele é o Diretor Absoluto.
                    </p>
                </div>

                <div className="bg-base-black border border-neutral-800 p-10 rounded-2xl shadow-2xl">
                    <h3 className="text-2xl font-bold text-white mb-8 border-b border-neutral-800 pb-4">A Nova Hierarquia Criativa</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-4 opacity-40 hover:opacity-100 transition-opacity duration-500">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-red-500/10 rounded-lg text-red-500"><Icons.X className="w-6 h-6" /></div>
                                <h4 className="text-red-400 font-bold uppercase tracking-widest text-sm">O Operário (Obsoleto)</h4>
                            </div>
                            <ul className="space-y-3 text-neutral-400 text-sm list-disc pl-5">
                                <li>Pede à IA "algo bonito" esperando surpresas.</li>
                                <li>Depende da "Seed da Sorte".</li>
                                <li>Copia e cola prompts sem entender a sintaxe.</li>
                                <li>Se frustra com alucinações ("mãos erradas") e desiste.</li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-neon/10 rounded-lg text-neon"><Icons.Check className="w-6 h-6" /></div>
                                <h4 className="text-neon font-bold uppercase tracking-widest text-sm shadow-neon">O Orquestrador (Você)</h4>
                            </div>
                            <ul className="space-y-3 text-neutral-200 text-sm list-disc pl-5">
                                <li>Não pede, <strong>comanda</strong>. Direciona a intenção com precisão cirúrgica.</li>
                                <li>Entende que o prompt é um roteiro técnico de superprodução.</li>
                                <li>Transforma o caos em assinaturas visuais únicas e replicáveis.</li>
                                <li>Usa o erro da IA como "happy accident" ou o corrige com Inpainting.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-neutral-900/50 p-6 rounded-xl border border-neutral-800 hover:border-neon/50 transition-colors group">
                        <Icons.BrainCircuit className="w-8 h-8 text-purple-500 mb-4 group-hover:scale-110 transition-transform" />
                        <h4 className="text-white font-bold mb-2">Visão Fractal</h4>
                        <p className="text-sm text-neutral-400">Desenvolva a habilidade de ver a imagem final antes de digitar a primeira palavra. Conecte referências de arquitetura com biologia.</p>
                    </div>
                    <div className="bg-neutral-900/50 p-6 rounded-xl border border-neutral-800 hover:border-blue-500/50 transition-colors group">
                        <Icons.Sliders className="w-8 h-8 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
                        <h4 className="text-white font-bold mb-2">Controle Técnico</h4>
                        <p className="text-sm text-neutral-400">Domine a sintaxe (--p, ::weights, --no) para dobrar o algoritmo à sua vontade, eliminando o ruído.</p>
                    </div>
                    <div className="bg-neutral-900/50 p-6 rounded-xl border border-neutral-800 hover:border-yellow-500/50 transition-colors group">
                        <Icons.Heart className="w-8 h-8 text-yellow-500 mb-4 group-hover:scale-110 transition-transform" />
                        <h4 className="text-white font-bold mb-2">Cura Humana</h4>
                        <p className="text-sm text-neutral-400">Sua alma é o filtro. A IA gera 100 opções; você escolhe a única que ressoa com a verdade humana.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded bg-neon text-black text-sm font-bold">1</span>
                        Exercício Prático: A Fusão Improvável
                    </h3>
                    <p className="text-neutral-400">
                        Para ativar seu modo "Orquestrador", você precisa forçar a IA a conectar conceitos distantes.
                    </p>
                    <div className="bg-black/40 p-8 rounded-xl border-l-4 border-yellow-500">
                        <h4 className="text-yellow-500 font-bold mb-4 uppercase text-xs tracking-widest">Desafio</h4>
                        <p className="text-white mb-4">
                            Crie um prompt que funda **dois estilos opostos** de forma coerente.
                        </p>
                        <div className="bg-neutral-900 p-4 rounded text-sm font-mono text-neutral-300">
                            <strong>Exemplo:</strong> "A cathedral architecture made of organic biological gummy bear material, translucent, subsurface scattering, gothic arches made of red gelatin, cinematic lighting."
                        </div>
                        <p className="text-xs text-neutral-500 mt-4">
                            <strong>Por que funciona?</strong> Obriga você a pensar em *materialidade* (gelatin) aplicando-a em uma *estrutura* (gothic cathedral). O resultado é visualmente novo.
                        </p>
                    </div>
                </div>
            </div>
        )
    },

    // --- PHASE 2: ARQUITETURA ---
    {
        id: 'hierarquia-olhar',
        title: 'A Arquitetura do Comando',
        category: 'ARQUITETURA',
        duration: '20 min de Prática',
        content: (
            <div className="space-y-12">
                <div className="space-y-4">
                    <h2 className="text-4xl font-bold text-white">O Prompt como Código Criativo</h2>
                    <p className="text-neutral-300 text-lg">
                        Não fale com a IA como se fosse uma caixa de desejos. Escreva seus prompts como um <strong>script de compilação visual</strong>. A ordem importa. A pontuação importa.
                    </p>
                </div>

                <div className="relative p-1 bg-gradient-to-r from-blue-500 via-purple-500 to-neon rounded-2xl">
                    <div className="bg-black p-8 rounded-xl">
                        <h3 className="text-2xl font-bold text-white mb-6 text-center">O Framework "A.C.A."</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex flex-col gap-4 text-center">
                                <div className="w-16 h-16 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center text-blue-500">
                                    <Icons.Anchor className="w-8 h-8" />
                                </div>
                                <div>
                                    <strong className="text-blue-500 text-xl block mb-2">1. Âncora</strong>
                                    <p className="text-sm text-neutral-400">O Sujeito Absoluto. O que DEVE estar na imagem. Ex: "A cybernetic samurai".</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 text-center relative">
                                <div className="hidden md:block absolute top-8 -left-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                                <div className="w-16 h-16 mx-auto bg-purple-500/20 rounded-full flex items-center justify-center text-purple-500 z-10 bg-black">
                                    <Icons.Map className="w-8 h-8" />
                                </div>
                                <div>
                                    <strong className="text-purple-500 text-xl block mb-2">2. Contexto</strong>
                                    <p className="text-sm text-neutral-400">Onde? Quando? Atmosfera. Ex: "In a rainy neo-tokyo alleyway, midnight".</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 text-center">
                                <div className="w-16 h-16 mx-auto bg-neon/20 rounded-full flex items-center justify-center text-neon">
                                    <Icons.Sparkles className="w-8 h-8" />
                                </div>
                                <div>
                                    <strong className="text-neon text-xl block mb-2">3. Alma</strong>
                                    <p className="text-sm text-neutral-400">Estilo, Lente, Render. Ex: "Shot on 35mm, cinematic lighting, octane render".</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-neutral-900 border border-neutral-700 p-8 rounded-2xl space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white">Técnica Secreta: Cadeia de Pensamento (CoT)</h3>
                        <span className="px-3 py-1 bg-neon/10 text-neon text-xs font-bold rounded uppercase">Avançado</span>
                    </div>
                    <p className="text-neutral-400">
                        A IA entende melhor a física quando você explica a <strong>causalidade</strong> das coisas. Não apenas descreva a cena, descreva o *porquê* ela parece assim.
                    </p>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-black/60 p-6 rounded-xl border border-red-500/20 opacity-60">
                            <span className="text-red-500 font-bold text-xs uppercase tracking-wide mb-2 block">Prompt Frio (Sem lógica)</span>
                            <code className="text-neutral-400">"A windy curtain."</code>
                        </div>
                        <div className="bg-black/60 p-6 rounded-xl border border-green-500/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-1 bg-green-500 text-black text-[10px] font-bold uppercase rounded-bl">Melhor</div>
                            <span className="text-green-500 font-bold text-xs uppercase tracking-wide mb-2 block">Prompt "Chain of Thought"</span>
                            <code className="text-neutral-300 block mb-2">"A heavy wet velvet curtain hanging in front of an open archway..."</code>
                            <code className="text-neon block font-bold">"...AS A RESULT, the bottom of the curtain is pushed outwards and upwards by the strong wind, creating dynamic folds."</code>
                        </div>
                    </div>
                    <p className="text-xs text-neutral-500">
                        *Nota: Usar "As a result" ou "Because of this" ajuda o modelo a conectar os pontos.*
                    </p>
                </div>

                <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white">Controle de Precisão</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-base-black border border-neutral-800 flex flex-col gap-2">
                            <code className="text-neon font-bold text-lg">:: (Pesos)</code>
                            <p className="text-sm text-neutral-400">Use double-colon para separar conceitos e números para dar importância.</p>
                            <span className="text-xs bg-neutral-900 p-2 rounded text-neutral-500 font-mono">hot:: dog (animal quente) vs hot dog (comida)</span>
                        </div>
                        <div className="p-4 rounded-xl bg-base-black border border-neutral-800 flex flex-col gap-2">
                            <code className="text-neon font-bold text-lg">--seed</code>
                            <p className="text-sm text-neutral-400">O "DNA" da imagem. Usar a mesma seed permite testar pequenas mudanças no prompt mantendo a mesma composição.</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    },

    // --- PHASE 3: DIREÇÃO DE ARTE ---
    {
        id: 'luz-camera-emocao',
        title: 'Luz, Câmera e Emoção',
        category: 'DIREÇÃO DE ARTE',
        duration: '22 min de Imersão',
        content: (
            <div className="space-y-12">
                <div className="space-y-4">
                    <h2 className="text-4xl font-bold text-white">Esculpindo o Invisível</h2>
                    <p className="text-neutral-300 text-lg">
                        A luz não serve apenas para iluminar pixels; ela serve para <strong>evocar sentimentos</strong>. O Orquestrador não escolhe uma luz porque é "bonita", mas porque ela conta a história certa.
                    </p>
                </div>

                {/* Light Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-base-black p-8 rounded-2xl border border-neutral-800 relative overflow-hidden group hover:border-orange-500/50 transition-all">
                        <div className="absolute top-0 right-0 p-3 bg-orange-500/10 rounded-bl-2xl">
                            <Icons.Sun className="text-orange-500 w-6 h-6" />
                        </div>
                        <h3 className="text-2xl text-white font-bold mb-2">Golden Hour / Rim Light</h3>
                        <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
                            Luz rasante, silhuetas douradas e separação dramática do fundo. Use para evocar **nostalgia, glória, esperança ou finais de jornada**.
                        </p>
                        <div className="h-4 w-full bg-gradient-to-r from-orange-600 via-yellow-500 to-transparent rounded-full opacity-80"></div>
                        <code className="block mt-4 text-xs text-orange-400 font-mono">--p "warm rim lighting, backlit by sunset, halo effect"</code>
                    </div>
                    <div className="bg-base-black p-8 rounded-2xl border border-neutral-800 relative overflow-hidden group hover:border-neutral-500/50 transition-all">
                        <div className="absolute top-0 right-0 p-3 bg-white/10 rounded-bl-2xl">
                            <Icons.Moon className="text-white w-6 h-6" />
                        </div>
                        <h3 className="text-2xl text-white font-bold mb-2">Chiaroscuro / Noir</h3>
                        <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
                            Onde a sombra é mais importante que a luz. Alto contraste, mistério e tensão. Use para **thrillers, revelações sombrias ou retratos psicológicos**.
                        </p>
                        <div className="h-4 w-full bg-gradient-to-r from-black via-neutral-600 to-white rounded-full opacity-80"></div>
                        <code className="block mt-4 text-xs text-neutral-400 font-mono">--p "hard shadows, volumetric lighting, chiaroscuro, low key"</code>
                    </div>
                </div>

                {/* Camera Section */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold text-white mb-6">A Câmera Narradora</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-start gap-6 p-4 rounded-xl hover:bg-black/30 transition-colors">
                            <div className="p-3 bg-blue-500/20 rounded-lg text-blue-500 mt-1">
                                <Icons.ArrowUpCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <strong className="text-white text-lg block mb-1">Low-Angle (Contra-Plongée)</strong>
                                <p className="text-neutral-400 text-sm mb-2">A câmera olha de baixo para cima.</p>
                                <p className="text-xs text-blue-400 italic">"Torna o sujeito poderoso, heróico ou ameaçador. O espectador se sente pequeno."</p>
                            </div>
                        </div>
                        <div className="h-[1px] bg-neutral-800 w-full"></div>
                        <div className="flex items-start gap-6 p-4 rounded-xl hover:bg-black/30 transition-colors">
                            <div className="p-3 bg-pink-500/20 rounded-lg text-pink-500 mt-1">
                                <Icons.ArrowDownCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <strong className="text-white text-lg block mb-1">Top-Down (Plongée / Zenital)</strong>
                                <p className="text-neutral-400 text-sm mb-2">A câmera olha de cima para baixo.</p>
                                <p className="text-xs text-pink-400 italic">"Torna o sujeito vulnerável, insignificante ou parte de um sistema maior (God-View)."</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Color Section - Teal & Orange Deep Dive */}
                <div className="bg-gradient-to-br from-neutral-900 to-black p-8 rounded-2xl border border-neutral-800 shadow-2xl relative overflow-hidden">
                    <h3 className="text-2xl font-bold text-white mb-4 z-10 relative">O Segredo de Hollywood: Teal & Orange</h3>
                    <p className="text-neutral-300 mb-8 z-10 relative max-w-2xl">
                        Por que todo filme de ação parece igual? Porque eles exploram o maior contraste cromático possível: <span className="text-orange-500 font-bold">Pele Humana (Laranja)</span> vs <span className="text-cyan-500 font-bold">Sombras/Fundo (Azul/Ciano)</span>.
                    </p>

                    <div className="flex h-32 rounded-xl overflow-hidden mb-6 z-10 relative">
                        <div className="flex-1 bg-cyan-900 flex items-center justify-center border-r border-black/20">
                            <span className="text-cyan-400 font-bold tracking-widest bg-black/40 px-4 py-2 rounded uppercase text-sm">Shadows</span>
                        </div>
                        <div className="flex-1 bg-orange-600 flex items-center justify-center">
                            <span className="text-orange-950 font-bold tracking-widest bg-white/20 px-4 py-2 rounded uppercase text-sm">Highlights</span>
                        </div>
                    </div>

                    <div className="bg-black/50 p-4 rounded-xl border-l-4 border-cyan-500 z-10 relative">
                        <span className="text-xs font-bold text-neutral-500 uppercase block mb-1">Try this prompt:</span>
                        <code className="text-cyan-300 font-mono text-sm">"Cyberpunk street detective, neon signs, teal and orange color grading, cinematic color scheme, contrasting colors."</code>
                    </div>

                    {/* Decorative blurred blobs */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500/10 rounded-full blur-[100px]"></div>
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px]"></div>
                </div>
            </div>
        )
    },

    {
        id: 'consistencia-workflow',
        title: 'Workflows de Consistência',
        category: 'CONSISTÊNCIA',
        duration: '18 min de Técnica',
        content: (
            <div className="space-y-12">
                <div className="space-y-4">
                    <h2 className="text-4xl font-bold text-white">O Fim da Loteria</h2>
                    <p className="text-neutral-300 text-lg">
                        Clientes não pagam por sorte. Eles pagam por <strong>previsibilidade</strong>. O maior desafio da IA Generativa é manter um personagem (ou estilo) idêntico através de 50 gerações diferentes.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-base-black border border-green-500/30 p-8 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl"></div>
                        <h3 className="text-green-400 font-bold text-2xl mb-6 flex items-center gap-3">
                            <Icons.UserCheck className="w-6 h-6" /> Character Reference
                        </h3>
                        <p className="text-neutral-400 mb-6 text-sm">
                            O parâmetro <code className="text-green-400">--cref</code> diz para a IA: "Olhe para esta URL e use este rosto/roupa".
                        </p>

                        <div className="space-y-4">
                            <div className="bg-black/50 p-4 rounded-xl border-l-2 border-green-500">
                                <span className="text-xs text-green-500 font-bold uppercase tracking-widest block mb-1">Passo 1: A Âncora</span>
                                <p className="text-sm text-neutral-300">Gere a imagem perfeita do seu personagem. Dê zoom no rosto se possível. Copie o Link da Imagem.</p>
                            </div>
                            <div className="bg-black/50 p-4 rounded-xl border-l-2 border-green-500">
                                <span className="text-xs text-green-500 font-bold uppercase tracking-widest block mb-1">Passo 2: O Bloqueio</span>
                                <p className="text-sm text-neutral-300">No novo prompt: <span className="font-mono text-white">--cref [URL] --cw 100</span> (Isso mantém rosto + roupas).</p>
                            </div>
                            <div className="bg-black/50 p-4 rounded-xl border-l-2 border-green-500">
                                <span className="text-xs text-green-500 font-bold uppercase tracking-widest block mb-1">Passo 3: A Troca de Roupa</span>
                                <p className="text-sm text-neutral-300">Quer mudar a roupa mas manter o rosto? Use <span className="font-mono text-white">--cw 0</span> (Character Weight Zero).</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-base-black border border-purple-500/30 p-8 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl"></div>
                        <h3 className="text-purple-400 font-bold text-2xl mb-6 flex items-center gap-3">
                            <Icons.Palette className="w-6 h-6" /> Style Reference
                        </h3>
                        <p className="text-neutral-400 mb-6 text-sm">
                            O parâmetro <code className="text-purple-400">--sref</code> rouba a alma estética de uma imagem sem roubar o conteúdo.
                        </p>

                        <div className="bg-neutral-900 border border-neutral-700 p-6 rounded-xl">
                            <h4 className="text-white font-bold mb-2 text-sm">Casos de Uso Reais</h4>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2"></span>
                                    <span className="text-sm text-neutral-400">Criar uma coleção de ícones com traço idêntico.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2"></span>
                                    <span className="text-sm text-neutral-400">Manter a paleta de cores corporativa em todas as ilustrações.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2"></span>
                                    <span className="text-sm text-neutral-400">Emular artistas mortos sem citar o nome deles (evitando bloqueios de filtro).</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="bg-neutral-900 border border-neutral-700 p-8 rounded-2xl">
                    <h3 className="text-2xl font-bold text-white mb-4">A Técnica da Grade (Storyboard Grid)</h3>
                    <p className="text-neutral-400 mb-6">
                        Para consistência perfeita entre quadros, não gere 4 imagens. Gere 1 imagem com 4 quadros. A IA "vaza" o estilo de um quadro para o vizinho, garantindo coesão absoluta.
                    </p>
                    <div className="bg-black p-6 rounded-xl font-mono text-sm text-neutral-300 border-l-4 border-neon shadow-lg">
                        "A 4-panel comic strip layout. Panel 1: Wide shot, hero stands on a cliff. Panel 2: Close up on hero's eyes, determination. Panel 3: Hero draws a laser sword. Panel 4: Hero jumps towards camera. Distinct comic book outlines, vibrant colors."
                    </div>
                </div>
            </div>
        )
    },

    {
        id: 'engenharia-valor',
        title: 'Engenharia de Valor',
        category: 'BUSINESS',
        duration: '25 min de Estratégia',
        content: (
            <div className="space-y-12">
                <div className="border-l-4 border-yellow-500 pl-8 py-4 bg-gradient-to-r from-yellow-500/10 to-transparent rounded-r-xl">
                    <h2 className="text-4xl font-bold text-white mb-4">A Nova Economia do Olhar</h2>
                    <p className="text-2xl text-yellow-500 italic font-light">"Se a IA te torna 100x mais rápido, cobrar por hora é punir sua própria eficiência."</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-red-900/10 p-8 rounded-2xl border border-red-500/20 opacity-70 hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-3 mb-4">
                            <Icons.Clock className="text-red-500 w-6 h-6" />
                            <h4 className="text-red-500 font-bold uppercase tracking-widest text-sm">Mindset Antigo</h4>
                        </div>
                        <p className="text-lg text-white font-bold mb-2">"Vendedor de Horas"</p>
                        <p className="text-sm text-neutral-400 mb-4">"Gerei isso em 10 minutos, então custa R$ 20."</p>
                        <div className="h-px bg-red-500/30 w-full mb-4"></div>
                        <p className="text-xs text-red-400">Consequência: Você compete com quem cobra R$ 5/hora. É uma corrida para o fundo do poço.</p>
                    </div>
                    <div className="bg-green-900/10 p-8 rounded-2xl border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                        <div className="flex items-center gap-3 mb-4">
                            <Icons.TrendingUp className="text-green-500 w-6 h-6" />
                            <h4 className="text-green-500 font-bold uppercase tracking-widest text-sm">Mindset Orquestrador</h4>
                        </div>
                        <p className="text-lg text-white font-bold mb-2">"Parceiro de Risco/ROI"</p>

                        <p className="text-sm text-neutral-400 mb-4">"Esta imagem substitui um shooting que custaria R$ 20.000. Eu cobro R$ 2.000 (10% do valor gerado) e entrego em 24h."</p>
                        <div className="h-px bg-green-500/30 w-full mb-4"></div>
                        <p className="text-xs text-green-400">Consequência: Você se torna indispensável. O cliente economiza e você lucra.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white">Nichos de Alta Performance (Blue Oceans)</h3>
                    <p className="text-neutral-400">Pare de tentar fazer "arte de capa de álbum". Vá onde o dinheiro flui e a dor é latente.</p>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-base-black p-6 rounded-xl border border-neutral-800 flex items-start gap-4 hover:border-neon transition-colors">
                            <div className="p-3 bg-neutral-900 rounded-full">
                                <Icons.ShoppingBag className="text-neon w-6 h-6" />
                            </div>
                            <div>
                                <strong className="text-white text-lg block mb-1">1. E-commerce: "A Prateleira Infinita"</strong>
                                <p className="text-sm text-neutral-400">Pequenas marcas não podem pagar fotógrafos para cada lançamento. Ofereça gerar 50 cenários lifestyle para o mesmo produto (usando Photoshop Composite + IA Backgrounds).</p>
                            </div>
                        </div>
                        <div className="bg-base-black p-6 rounded-xl border border-neutral-800 flex items-start gap-4 hover:border-blue-500 transition-colors">
                            <div className="p-3 bg-neutral-900 rounded-full">
                                <Icons.Home className="text-blue-500 w-6 h-6" />
                            </div>
                            <div>
                                <strong className="text-white text-lg block mb-1">2. Arquitetura & Interiores: "Validação de Sonhos"</strong>
                                <p className="text-sm text-neutral-400">Arquitetos demoram dias para renderizar. Com IA + ControlNet, você transforma um rabisco em um render fotorrealista em minutos. Venda "pacotes de visualização" para acelerar aprovações.</p>
                            </div>
                        </div>
                        <div className="bg-base-black p-6 rounded-xl border border-neutral-800 flex items-start gap-4 hover:border-pink-500 transition-colors">
                            <div className="p-3 bg-neutral-900 rounded-full">
                                <Icons.Clapperboard className="text-pink-500 w-6 h-6" />
                            </div>
                            <div>
                                <strong className="text-white text-lg block mb-1">3. Pitch Decks & Storyboards</strong>
                                <p className="text-sm text-neutral-400">Diretores e Roteiristas precisam vender ideias. Um Pitch Deck visualmente deslumbrante vende um roteiro. Venda a "visão" do filme antes dele existir.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-neutral-900 p-8 rounded-2xl border border-neutral-700 mt-4 text-center">
                    <Icons.Sparkles className="w-12 h-12 text-neon mx-auto mb-4" />
                    <h3 className="text-white font-bold text-2xl mb-4">O Manifesto do Alquimista</h3>
                    <p className="text-neutral-300 italic text-lg max-w-2xl mx-auto leading-relaxed">
                        "Eu não crio do nada; eu orquestro o potencial latente para dar-lhe forma e significado. A IA é o espelho da minha mente: se minha bagagem cultural for rica, meus resultados serão inimitáveis. Eu não temo a máquina; eu a conduzo."
                    </p>
                </div>
            </div>
        )
    }
];
