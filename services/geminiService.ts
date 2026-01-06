
import {
    PromptResult,
    ReverseEngineeringResult,
    GenerationType,
    InterpreterResult,
    SequenceResult,
    CreativeCopy,
    ModularRefs,
    PaletteResult,
    AdCampaignResult
} from "../types";

// --- CONFIGURATION ---
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "google/gemini-3-flash-preview";

const getApiKey = () => {
    // Vite uses import.meta.env for env vars
    const key = import.meta.env.VITE_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY;
    // Fallback strict check
    if (!key || key.includes("YOUR_KEY")) {
        console.error("OpenRouter API Key missing. Please check .env file.");
        throw new Error("API_KEY_MISSING");
    }
    return key;
};

// --- HELPER: OPENROUTER FETCH ---
async function callOpenRouter(
    messages: any[],
    responseSchema?: any,
    model: string = DEFAULT_MODEL,
    temperature: number = 0.7
): Promise<any> {
    const apiKey = getApiKey();

    // If a strict JSON schema is requested, we append it to system instructions 
    // and enforce JSON mode if supported, or just trust the model with the prompt.
    let finalMessages = [...messages];
    let jsonMode = false;

    if (responseSchema) {
        jsonMode = true;
        const schemaString = JSON.stringify(responseSchema, null, 2);
        // Inject schema instruction into the last system message or add a new one
        const systemMsgIndex = finalMessages.findIndex(m => m.role === 'system');
        const instruction = `\n\nCRITICAL: Output MUST be valid JSON following this schema:\n${schemaString}\n\nDo not include markdown formatting like \`\`\`json. Return RAW JSON only.`;

        if (systemMsgIndex >= 0) {
            finalMessages[systemMsgIndex].content += instruction;
        } else {
            finalMessages.unshift({ role: 'system', content: instruction });
        }
    }

    try {
        console.log("🚀 Calling OpenRouter:", model);
        const response = await fetch(OPENROUTER_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "HTTP-Referer": window.location.origin, // Client-side origin
                "X-Title": "Alquimia Criativa",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: model,
                messages: finalMessages,
                temperature: temperature,
                // response_format: jsonMode ? { type: "json_object" } : undefined // Optional support depending on model
            })
        });

        if (!response.ok) {
            const err = await response.text();
            console.error("❌ OpenRouter API Error:", response.status, err);
            throw new Error(`OpenRouter Error: ${err}`);
        }

        const data = await response.json();
        console.log("✅ OpenRouter Success:", data);
        const content = data.choices?.[0]?.message?.content || "";
        console.log("📝 Raw Content:", content);

        // Clean markdown code blocks if present (common issue even with instructions)
        const cleanContent = content.replace(/```json/g, "").replace(/```/g, "").trim();
        console.log("🧹 Cleaned Content:", cleanContent);

        if (jsonMode) {
            try {
                const parsed = JSON.parse(cleanContent);
                console.log("🧩 Parsed JSON:", parsed);
                return parsed;
            } catch (e) {
                console.error("JSON Parse Error:", cleanContent);
                // Try to perform a loose extraction if strict parse fails
                const match = cleanContent.match(/\[.*\]/s);
                if (match) {
                    try {
                        return JSON.parse(match[0]);
                    } catch (err) {
                        return {};
                    }
                }
                return {}; // Fail gracefully
            }
        }

        return content;
    } catch (error) {
        console.error("AI Service Error:", error);
        return jsonMode ? {} : ""; // Graceful fallback
    }
}

// --- SYSTEM CONSTRAINTS ---
const CREATIVE_ONLY_INSTRUCTION = `
  CRITICAL RULES:
  1. NEVER extract, read, or reference any TEXT, LOGOS, or WRITTEN NAMES found in the images.
  2. FOCUS: Extract only Visual DNA (Lighting, Texture, Color, Camera Angle, Composition, and Effects).
  3. RATIO CONSTRAINT: Use the provided Aspect Ratio ONLY to architect the composition.
  4. NO RATIO PARAMETERS: NEVER include aspect ratio strings (like "--ar 16:9") in the final prompt text.
  5. ABSTRACT: Treat images as blueprints of light and geometry.
`;

// --- EXPORTED FUNCTIONS ---

export const extractStyleDescription = async (base64Data: string, mimeType: string): Promise<string> => {
    return await callOpenRouter([
        {
            role: "user",
            content: [
                { type: "text", text: `${CREATIVE_ONLY_INSTRUCTION}\nAnalyze the visual DNA of this image. Focus ONLY on lighting, color palette, camera feel, and artistic medium. DO NOT mention any text or aspect ratio commands.` },
                { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64Data}` } }
            ]
        }
    ]);
};

export const generateCreativePrompts = async (
    concept: string,
    type: GenerationType,
    style: string,
    tone: string,
    ratio: string,
    url?: string,
    styleRefImage?: { data: string, mimeType: string }, // Renamed for clarity: This is VIBE/STYLE
    selectedDetails: string[] = [],
    cameraFraming: string = 'Eye Level',
    analyzedStyle: string = '',
    videoSettings?: { fps: string, pacing: string },
    paletteImage?: { data: string, mimeType: string },
    logoMaterial: string = 'VECTOR_FLAT',
    mockupAesthetic: string = 'MINIMALIST',
    prototypeImage?: { data: string, mimeType: string } // NEW: This is STRUCTURE/GEOMETRY
): Promise<PromptResult[]> => {

    let specificVideoInstructions = "";
    if (type === 'VIDEO') {
        specificVideoInstructions = `VIDEO KINETICS: Focus on movement (${videoSettings?.pacing || 'Real-time'}) and FPS (${videoSettings?.fps || '24fps'}).`;
    }

    // --- MATERIAL TEXTURE LOOKUP ---
    const materialPrompts: Record<string, string> = {
        '3D_METALLIC': 'Material: Brushed Aluminum & Chrome. Finish: Anodized, Metallic Sheen, Industrial Precision. Rendering: Octane Render, Raytracing, 8k.',
        '3D_RUBBER': 'Material: Soft-Touch Matte Silicone. Finish: Rubberized, Vibrant, Tactile, Smooth curves. Rendering: Blender 3D, Soft Studio Lighting.',
        '3D_GLASS': 'Material: Translucent Frosted Glass (Glassmorphism). Finish: Refractive, Subsurface Scattering, Crystal Clear. Rendering: Caustics, Prism Effect.',
        '3D_SILVER': 'Material: Polished Sterling Silver. Finish: High-Gloss, Mirror Reflection, Luxury Jewel. Rendering: Studio Lighting, Specular Highlights.',
        '3D_BALLOON': 'Material: Inflated Mylar/Latex Balloon. Finish: Glossy, Pillowy, Air-Filled, Tension creases. Rendering: Cinema 4D, Physical Render.',
        '3D_GOLD': 'Material: 24k Solid Gold. Finish: Brushed Metal, Wealth, Premium. Rendering: Unreal Engine 5, Global Illumination.',
        '3D_NEON': 'Material: Neon Gas Tubes. Finish: Glowing, Cyberpunk, Emissive Light. Rendering: Night setting, Volumetric Fog.'
    };

    const selectedMaterialPrompt = materialPrompts[logoMaterial] || '';
    const is3D = logoMaterial && logoMaterial !== 'VECTOR_FLAT';

    // --- MOCKUP AESTHETIC LOOKUP ---
    const aestheticPrompts: Record<string, string> = {
        'MINIMALIST': 'AESTHETIC: Ultra-Clean Studio Minimalism. Background: Solid Off-White or Light Grey. Lighting: Soft Box, diffused, shadowless. Compositon: Central, abundant negative space. Vibe: Apple/Braun Design.',
        'LOFT': 'AESTHETIC: Industrial Loft / Concrete. Background: Raw Concrete texture, Brick wall, Steel surfaces. Lighting: Natural window light (Gobofilter), hard shadows. Vibe: Urban, Raw, Authentic.',
        'NATURE': 'AESTHETIC: Organic / Biophilic. Background: Natural Stone, Wood grain, Monstera Leaves, Sunlight dappled through trees. Lighting: Warm Golden Hour sunbeams. Vibe: Eco, Sustainable, Fresh.',
        'FUTURISTIC': 'AESTHETIC: Cyber / Neon / Tech. Background: Dark Gradient, Grid lines, Glossy Reflections. Lighting: Blue/Purple Rim light, LED accents. Vibe: Tech SaaS, Gamer, Innovation.'
    };

    const selectedAestheticPrompt = aestheticPrompts[mockupAesthetic] || aestheticPrompts['MINIMALIST'];

    let promptContext = `
      TASK: Generate 3 high-density, "Sales-Ready" AI prompts.
      TYPE: ${type}
      CONCEPT: "${concept}"
      COMPOSITION/RATIO_GUIDE: "${ratio}" (Use this to architect the layout, but DO NOT output the ratio string)
      CAMERA: "${cameraFraming}"
    `;

    if (selectedDetails.length > 0) {
        promptContext += `\nDETAILS: "${selectedDetails.join(', ')}"`;
    }

    if (analyzedStyle) {
        promptContext += `\nVISUAL_DNA_INSTRUCTION: Adopt the following extracted style strictly: "${analyzedStyle}"`;
    } else {
        promptContext += `\nVISUAL_DNA_INSTRUCTION: No reference provided. You must act as a Creative Director and invent a top-tier, trending aesthetic that serves the CONCEPT perfectly.`;
    }

    if (style && style !== 'General High Quality') {
        promptContext += `\nUSER_STYLE_PREFERENCE: "${style}"`;
    }

    promptContext += `\n${CREATIVE_ONLY_INSTRUCTION}`;

    if (specificVideoInstructions) {
        promptContext += `\n${specificVideoInstructions}`;
    }

    // --- SYSTEM PERSONA SELECTION ---
    let systemPersona = "You are Dr. Nexus, the world's most advanced AI Prompt Engineer. Your goal is to write prompts that generate award-winning visuals. You ALWAYS output valid JSON as requested by schema.";

    // SPECIALIZED AGENT: LOGO DESIGNER
    if (type === 'LOGO_BRAND') {
        const hasPrototype = !!prototypeImage;

        if (hasPrototype) {
            systemPersona = `
CRITICAL ROLE: ACT AS A SPECIALIZED VISUAL IDENTITY ARCHITECT.
You are bridging the gap between a RAW SKETCH (Structure) and a PROFESSIONAL REFERENCE (Style).

YOUR PROCESS - "THE STRUCTURAL FUSION PROTOCOL":
1. **STRUCTURAL ANCHOR (Start Here)**: Analyze "Image A" (The Prototype/Sketch).
   - This determines the SHAPE, GEOMETRY, and COMPOSITION.
   - Do NOT change the fundamental shape (e.g., if it's a circle, keep it a circle).
   - *Fix the flaws*: Straighten lines, perfect curves, balance weights.

2. **AESTHETIC INFUSION (Apply This)**: Analyze "Image B" (The Style Reference) & Context.
   - Extract the LIGHTING, TEXTURE, MATERIAL, and MOOD from the reference.
   - Apply this "Skin" onto the "Skeleton" of the sketch.
   - *Example*: If Sketch is a simple "S" and Reference is "Neon City", create a "Neon Glass S".

3. **SEMANTIC BRANDING**: Reinforce with Brand Name & Niche.
   - Name: "${concept.match(/Brand Name: (.*)/)?.[1] || 'Brand'}"
   - Niche: "${concept.match(/Niche: (.*)/)?.[1] || 'Design'}"

4. **TYPOGRAPHY**: Select a font class that matches the NEW fused aesthetic.

OUTPUT GOAL:
Write a prompt that generates a FINAL, POLISHED logo.
Use terms like: "Based on sketch geometry," "Refined linework," "Applied reference texture," "High-fidelity render."
            `.trim();
        } else {
            systemPersona = `
CRITICAL ROLE: ACT AS THE WORLD'S PREMIER BRAND IDENTITY DESIGNER (Pentagram Level).

YOUR DESIGN PHILOSOPHY:
1. GEOMETRY IS GOD: Construct logos using the Golden Ratio, Modular Grids, and basic Geometric Primitives.
2. REDUCTIONISM: "Less is more". Strip away all unnecessary elements.
3. TYPOGRAPHY IS KEY: The Brand Name must be styled to match the icon.
   - **Luxury**: Elegant Serifs (Didot).
   - **Tech**: Geometric Sans, Custom Ligatures.
   - **Friendly**: Rounded Soft Edge.
   - **Corporate**: Strong Swiss Style.
4. GESTALT: Use Closure, Proximity, and Figure/Ground methods.

TASK:
Write 3 prompts for ${is3D ? '3D Rendered Logos' : 'Vector-Style Logos'} that embody the BRAND MISSION.

${is3D ? `IMPORTANT - 3D MATERIAL SPECIFICATION:
The user demands a Specific Material Finish.
**${selectedMaterialPrompt}**
Apply this material to the geometric logo shape AND the typography.`
                    : `Use terms like: "Vector," "Flat Design," "Minimalist," "Negative Space," "Grid System," "Solid Color," "Paul Rand Style."`}
            `.trim();
        }
    }

    // SPECIALIZED AGENT: ICON SET DESIGNER
    if ((type as string) === 'ICON') {
        const hasPrototype = !!prototypeImage;
        const hasStyleRef = !!styleRefImage;

        // VIBE DECODER: Translate "Vibe" (Tone) into "Visual Icon Traits"
        let iconStyleTraits = "";
        const lowerVibe = (tone || '').toLowerCase();

        if (lowerVibe.includes('child') || lowerVibe.includes('playful') || lowerVibe.includes('cute')) {
            iconStyleTraits = "VISUALS: Thick monoline stroke, Soft rounded corners, 'Squircle' shapes, Pastel flat colors, Kawaii aesthetic.";
        } else if (lowerVibe.includes('luxury') || lowerVibe.includes('elegant') || lowerVibe.includes('premium')) {
            iconStyleTraits = "VISUALS: Ultra-thin hairline strokes, Sharp geometric corners, Metallic gradients, Minimalist line art, Sophisticated negative space.";
        } else if (lowerVibe.includes('tech') || lowerVibe.includes('modern') || lowerVibe.includes('cyber')) {
            iconStyleTraits = "VISUALS: Neon gradients, Glassmorphism effects, Pixel-perfect grid, Dynamic motion lines, Dark mode optimized.";
        } else if (lowerVibe.includes('eco') || lowerVibe.includes('organic') || lowerVibe.includes('nature')) {
            iconStyleTraits = "VISUALS: Hand-drawn textured lines, Imperfect edges, Earthy tones, Watercolor fill effects, Natural motifs, Textured Paper.";
        } else {
            // Default / Professional
            iconStyleTraits = "VISUALS: Clean vector lines, grid-based construction, Solid primary colors, legible at small sizes (Favicon ready).";
        }

        if (hasStyleRef) {
            systemPersona = `
CRITICAL ROLE: ACT AS A MASTER ICONOGRAPHER & VECTOR ARTIST (Dribbble/Behance Featured).
TASK: EXPAND AN EXISTING ICON SET based on the attached "VISUAL REFERENCE" image.

YOUR PROCESS:
1. **DECONSTRUCT THE REFERENCE**: Analyze the attached "VISUAL REFERENCE" image.
   - Measure the Stroke Weight.
   - Check Corner Radius (Sharp vs Round).
   - Identify Fill Style (Solid, Outline, gradient?).
   - Note the Perspective (Flat, 3D, Isometric).

2. **REPLICATE THE STYLE**: Write 3 prompts for NEW icons (relevant to ${concept}) that perfectly match this visual DNA.
   - The goal is CONSISTENCY. The new icons must look like they belong in the same family.

OUTPUT GOAL:
"Icon of [Item] in the style of the user's reference: [Style Description], vector, trending on Behance, high quality..."
            `.trim();

            if (hasPrototype) {
                systemPersona += `\n\nCONSTRAINT: Use "IMAGE A" (Sketch) as the structural base for the MAIN icon, but apply the style from the Reference.`;
            }

        } else if (hasPrototype) {
            systemPersona = `
CRITICAL ROLE: ACT AS A MASTER ICONOGRAPHER (Apple/Google Standards).
TASK: Take the user's SKETCH (Image A) and refine it into a PROFESSIONAL ICON SET (Award Winning).

YOUR PROCESS:
1. **Analyze Image A (The Sketch)**: Identify the core symbol and action.
2. **Standardize**: Apply the "Visual Icon Traits" defined below to that symbol.
3. **Expand**: Create a COHESIVE SET. If the sketch is a "Home" icon, also generate options for "User", "Settings", "Search" in the EXACT SAME STYLE.

CONTEXT:
${iconStyleTraits}

OUTPUT GOAL:
A prompt for a set of icons that look distinguishable, scannable, and part of the same design system. High fidelity, vector perfection.
            `.trim();
        } else {
            systemPersona = `
CRITICAL ROLE: ACT AS A MASTER ICONOGRAPHER (Streamline / FontAwesome Creator).
You do not just make "images", you build USER INTERFACE SYSTEMS.

TASK: Write 3 prompts to generate a COHESIVE ICON SET (4-6 icons per image) for the brand.

STYLE TRANSLATION MATRIX:
The user has specified a Vibe: "${analyzedStyle || 'Modern'}".
YOU MUST TRANSLATE THIS INTO THESE VISUAL RULES:
${iconStyleTraits}

REQUIREMENTS:
- **Uniformity**: All icons must share the same stroke weight, corner radius, and perspective.
- **Composition**: Present them in a grid layout (Sheet).
- **Subject Matter**: Choose icons relevant to the Niche ("${concept.match(/Niche: (.*)/)?.[1] || 'General'}").

OUTPUT FORMAT:
"Cohesive Icon Set for [Niche] application, [Icon Style Traits], featuring symbols for [List relevant items], white background, high contrast vector style, Behance Quality, Dribbble trending..."
            `.trim();
        }
    }

    // SPECIALIZED AGENT: SEAL & BADGE DESIGNER
    if ((type as string) === 'SEAL') { // Legacy support or clean up later clearly
        systemPersona = `ACT AS A MASTER EMBLEM DESIGNER. Create High-Impact Vector Seals/Badges. Containment, Typography Integration, Composition. Editorial Quality.`;
    }

    // SPECIALIZED AGENT: VISUAL IDENTITY ARCHITECT (PATTERNS & ELEMENTS)
    if ((type as string) === 'ELEMENT') { // Previously 'PATTERN' or generic element
        const lowerVibe = (tone || '').toLowerCase(); // Brand Vibe

        systemPersona = `
CRITICAL ROLE: ACT AS A VISUAL IDENTITY ARCHITECT (Pentagram/Wolff Olins Level).
You are NOT just making "pictures". You are expanding a BRAND SYSTEM.

TASK: Create 3 High-End Brand Assets (Patterns, Graphics, or Textures) that perfectly match the brand's established DNA.

CONTEXTUAL AWARENESS:
- Brand Vibe: "${tone || 'Modern & Professional'}"
- Core Concept: "${concept}"

CONFIRMED VISUAL DIRECTION:
1. **Geometric/Tech**: If vibe is Modern/Tech -> Generate Data visualization grids, particle flows, abstract node connections.
2. **Organic/Eco**: If vibe is Nature -> Generate topographic lines, leaf vein details, fluid watercolor washes.
3. **Luxury/Premium**: If vibe is Luxury -> Generate guilloché patterns (like money), marble textures, micro-embossing effects.
4. **Playful/Loud**: If vibe is Playful -> Generate Memphis-style confetti, bold brutalist shapes, halftone dots.

OUTPUT GOAL:
A prompt for a seamless pattern or isolated graphic element that would be used on packaging, website backgrounds, or social media.
Keywords: "Seamless Pattern," "Brand Asset," "Vector," "Abstract Background," "High Resolution," "Editorial Design," "Award Winning Layout."
        `.trim();
    }

    // SPECIALIZED AGENT: MOCKUP & BRAND KIT & UI/UX
    if ((type as string) === 'MOCKUP') {
        const isBrandKit = selectedDetails.includes('BRAND_KIT');
        const isUI = selectedDetails.includes('PHONE') || selectedDetails.includes('LAPTOP'); // Check for UI related mockups

        if (isBrandKit) {
            systemPersona = `
CRITICAL ROLE: ACT AS A SENIOR ART DIRECTOR SPECIALIZING IN BRAND PRESENTATIONS (Behance/Dribbble Featured).
TASK: Write 3 prompts to generate a FULL BRAND IDENTITY SUITE (Stationary Set / Brand Kit).

COMPOSITION STRATEGY (KNOLLING / FLAT LAY):
- **Content**: Include Business Cards, Envelope, Letterhead, iPhone Screen, Notebook, and a Coffee Cup (or industry relevant item).
- **Layout**: Isometric Grid or Overhead Flat Lay (Knolling).
- **Lighting**: Soft Studio Lighting, Long Shadows, High-End Product Photography.
- **Vibe**: The image must look like a "Brand Case Study" presentation.

KEYWORDS: "Brand Identity Mockup Set," "Isometric Stationary Layout," "High-End Corporate Branding Kit," "Photorealistic," "Soft Shadows," "Matching Color Palette," "Behance Style," "Editorial Photography."
             `.trim();
        } else if (isUI) {
            systemPersona = `
CRITICAL ROLE: ATUE COMO UM SENIOR UI/UX DESIGNER (ESPECIALISTA EM SAAS & FINTECH).
TAREFA: Escreva 3 prompts EM PORTUGUÊS para gerar O INTERFACE DE USUÁRIO (UI) de Alta Fidelidade.

ESTILO VISUAL (Referência: Dark Mode Premium, Glassmorphism, Clean):
- **Cores**: Use a paleta da marca em destaque sobre fundos escuros (Deep Navy, Black, Charcoal).
- **Tipografia**: San-Serif Moderna (Inter, Roboto), pesos ousados para títulos.
- **Layout**: Grid limpo, muito espaço negativo (respiro), componentes flutuantes (Glassmorphism).

CONTEÚDO E TEXTO (IMPORTANTE: LÍNGUA PORTUGUESA):
O prompt deve descrever que os textos na tela estão em PORTUGUÊS.
- Cabeçalhos: Algo relevante ao Nicho (Ex: "A Revolução Financeira").
- Botões: "Começar Agora", "Entrar", "Saiba Mais".
- Menu: "Início", "Produtos", "Soluções", "Contato".

ESTRUTURA DO PROMPT FINAL (EM PORTUGUÊS):
"Interface de aplicativo móvel [ou Web] para [NICHO], modo escuro, estilo futurista minimalista, painéis de vidro fosco, tipografia nítida, botões em [COR DA MARCA], tela exibindo [TELA ESPECÍFICA: Dashboard/Login/Home], textos da interface em Português, Dribbble Trending, UI/UX Award Winner..."
             `.trim();
        } else {
            // --- ULTRA PREMIUM MOCKUP ENGINE ---
            const hasBaseObject = !!prototypeImage;

            if (hasBaseObject) {
                systemPersona = `
CRITICAL ROLE: ACT AS A SENIOR VISUAL MERCHANDISER & CGI ARTIST.
You are an expert in "Texture Mapping" and "Product Placement".
TASK: Write 3 prompts that describe the USER'S UPLOADED IMAGE (Image A) exactly, but apply the Brand Logo onto it naturally.

YOUR PROCESS ("THE REALITY ANCHOR"):
1. ANALYZE IMAGE A (Structure): Identify the object, material, folds, lighting, and camera angle.
   - *Example*: "A wrinkled white cotton t-shirt on a wooden table, lit by afternoon sun."
2. APPLY BRANDING: Place the Brand Logo/Identity onto the object as if it were printed/embroidered/embossed.
3. RETAIN REALISM: Do NOT change the object type. If it's a "Mug", keep it a Mug. If it's a "Storefront", keep it a Storefront.

OUTPUT GOAL:
A prompt that regenerates the SCENE from Image A, but with the new BRANDING applied.
Keywords: "Product Mockup," "Texture Mapping," "Photorealistic," "Natural Lighting," "Contextual Placement," "Editorial Quality."
                `.trim();
            } else {
                systemPersona = `
CRITICAL ROLE: ACT AS A WORLD-CLASS PRODUCT PHOTOGRAPHER (Karl Taylor / Peter McKinnon Level).
TASK: Write 3 prompts to generate a PHOTOREALISTIC, HIGH-END MOCKUP of a SINGLE SPECIFIC ITEM (${concept}).
GOAL: The image must look like a Billion-Dollar Brand Advertisement.

YOUR STUDIO SETTINGS:
1. **Camera**: Hasselblad X2D 100C (100MP Medium Format).
2. **Lens**: 80mm f/1.9 (Macro/Portrait). Creates shallow depth of field (Bokeh).
3. **Lighting**: "Rembrandt Lighting" or "Three-Point Studio Setup" depending on vibe.
4. **Resolution**: 8k, Octane Render, Ray Tracing, Hyper-Detailed.

VISUAL AESTHETIC INSTRUCTION:
${selectedAestheticPrompt}

CONTEXT AWARENESS (NICHE ADAPTATION):
- If Niche implies "Luxury" (Jewelry, Perfume) -> Use Silk/Velvet textures, High Contrast, Golden Reflections.
- If Niche implies "Tech" (Software, AI) -> Use Matte Black, Glass, Neon edges.
- If Niche implies "Health/Food" -> Use Fresh ingredients, Water droplets, Bright airy feel.

REQUIREMENTS:
- The product MUST be the Hero.
- There MUST be a clear, high-quality blank space or surface on the product for logo placement.
- NO TEXT on the generated image itself.
- EDITORIAL QUALITY: Composition must be perfect rule-of-thirds.

KEYWORDS TO USE: "Product Photography," "Macro Angle," "Depth of Field," "Bokeh," "Hyper-Realistic," "Studio Lighting," "8k," "Advertising Standard," "Behance Style," "Award Winning Photography."
                `.trim();
            }
        }
    }

    const messages = [
        { role: "system", content: systemPersona },
        {
            role: "user",
            content: [
                { type: "text", text: promptContext }
            ]
        }
    ];

    // 1. ATTACH PROTOTYPE/SKETCH (STRUCTURE) - "IMAGE A"
    if (prototypeImage) {
        // @ts-ignore
        messages[1].content.push({ type: "image_url", image_url: { url: `data:${prototypeImage.mimeType};base64,${prototypeImage.data}` } });

        // DYNAMIC CONTEXTUAL INSTRUCTION FOR IMAGE A
        let prototypeInstruction = "IMAGE A [STRUCTURE]: This is the GEOMETRIC SKELETON. Respect its shape and composition.";

        if ((type as string) === 'MOCKUP') {
            prototypeInstruction = "IMAGE A [SCENE_BASE]: This is the PHOTO CANVAS. Do not change the object. You are mapping the texture onto THIS specific item.";
        } else if ((type as string) === 'ICON') {
            prototypeInstruction = "IMAGE A [SYMBOL_REF]: This is the HAND-DRAWN SYMBOL. Refine its geometry into a professional vector icon.";
        } else if ((type as string) === 'ELEMENT') {
            prototypeInstruction = "IMAGE A [MOTIF_BASE]: Use this shape/texture as the repeating core of the pattern.";
        }

        // @ts-ignore
        messages[1].content.push({ type: "text", text: prototypeInstruction });
    }

    // 2. ATTACH STYLE REFERENCE (VIBE) - "IMAGE B"
    if (styleRefImage) {
        // @ts-ignore
        messages[1].content.push({ type: "image_url", image_url: { url: `data:${styleRefImage.mimeType};base64,${styleRefImage.data}` } });

        // @ts-ignore
        const refInstruction = type === 'LOGO_BRAND'
            ? "IMAGE B [STYLE]: This is the AESTHETIC SKIN. Apply its lighting, texture, and mood to Image A."
            : "VISUAL REFERENCE: Use the lighting, composition, and atmosphere from this image. IGNORE TEXT/LOGOS.";

        // @ts-ignore
        messages[1].content.push({ type: "text", text: refInstruction });
    }

    if (paletteImage) {
        // @ts-ignore
        messages[1].content.push({ type: "image_url", image_url: { url: `data:${paletteImage.mimeType};base64,${paletteImage.data}` } });
        // @ts-ignore
        messages[1].content.push({ type: "text", text: "COLOR REFERENCE: Extract and use the EXACT color palette from this image." });
    }

    // Schema definition for OpenRouter/JSON enforcer
    const schema = {
        type: "object",
        properties: {
            prompts: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        title: { type: "string" },
                        prompt: { type: "string" },
                        negativePrompt: { type: "string" },
                        tags: { type: "array", items: { type: "string" } },
                        suggestedModel: { type: "string" }
                    },
                    required: ["title", "prompt", "tags", "suggestedModel"]
                }
            }
        },
        required: ["prompts"]
    };

    const result = await callOpenRouter(messages, schema);
    // Handle potential wrapper object vs raw array - OpenRouter/Gemini might wrap it or return array directly depending on interpretation
    if (result && result.prompts && Array.isArray(result.prompts)) return result.prompts;
    if (Array.isArray(result)) return result;

    // Fallback if parsing failed but we got something else, or return empty array
    return [];
};

export const enhancePromptRealism = async (currentPrompt: string): Promise<string> => {
    return await callOpenRouter(
        [
            { role: "system", content: "You are a senior prompt engineer. Enhance technical depth. Never add aspect ratio parameters." },
            { role: "user", content: `Optimize this prompt for hyper-realism. DO NOT add aspect ratio tags. Original: "${currentPrompt}".` }
        ],
        undefined,
        DEFAULT_MODEL,
        0.4
    );
};

export const reverseEngineerImage = async (base64Data: string, mimeType: string, instruction: string = ""): Promise<ReverseEngineeringResult | null> => {
    const messages = [
        {
            role: "user",
            content: [
                {
                    type: "text", text: `
                    ROLE: Grandmaster Prompt Engineer & Educator.
                    TASK: Deconstruct the VISUAL DNA of this image for a Portuguese-speaking student.
                    ${CREATIVE_ONLY_INSTRUCTION}
                    
                    LANGUAGE RULES (CRITICAL):
                    - **TECHNICAL PROMPTS & KEYWORDS**: Must be in **ENGLISH** (Standard Stable Diffusion format).
                    - **ANALYSIS, EXPLANATIONS, & RATIONALE**: Must be in **PORTUGUESE (PT-BR)**.
                    
                    ANALYSIS FOCUS: 
                    1. Geometry & Layout. 
                    2. Optical properties. 
                    3. Lighting setup. 
                    4. Post-processing effects.
                    
                    RULES: NO aspect ratio commands. NEVER describe text or logos.
                `},
                { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64Data}` } }
            ]
        }
    ];

    const schema = {
        type: "object",
        properties: {
            description: { type: "string", description: "Detailed visual DNA description in Portuguese (PT-BR). NO TEXT references." },
            detailedPrompt: { type: "string", description: "The technical prompt in English focus on style." },
            artStyle: { type: "string", description: "Art style analysis in Portuguese (PT-BR)." },
            composition: { type: "string", description: "Composition and lighting geometry analysis in Portuguese (PT-BR)." },
            promptBreakdown: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        term: { type: "string", description: "The specific keyword used in the English prompt." },
                        explanation: { type: "string", description: "Educational explanation of what this term does, in Portuguese (PT-BR)." }
                    },
                    required: ["term", "explanation"]
                }
            },
            promptLayers: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        layerType: { type: "string", enum: ['SUBJECT', 'MEDIUM', 'LIGHTING_CAMERA', 'STYLE_VIBE'] },
                        content: { type: "string", description: "The segment of the prompt in English." },
                        explanation: { type: "string", description: "Analysis of this layer's contribution in Portuguese (PT-BR)." }
                    },
                    required: ["layerType", "content", "explanation"]
                }
            },
            improvedPrompt: { type: "string", description: "An optimized version of the prompt in English." },
            improvementLogic: { type: "string", description: "Explanation of why this version is better, in Portuguese (PT-BR)." }
        },
        required: ["description", "detailedPrompt", "artStyle", "composition", "promptBreakdown", "promptLayers", "improvedPrompt", "improvementLogic"]
    };

    return await callOpenRouter(messages, schema);
};

export const adaptPromptStyle = async (
    refBase64: string,
    refMime: string,
    prodImages: { data: string, mimeType: string }[],
    intensity: string,
    copyData: CreativeCopy,
    modRefs: ModularRefs,
    focusMode: string,
    manualColors: string[],
    styleFeedback: string = ""
): Promise<string | null> => {

    // Constructing a multi-modal message
    const content: any[] = [
        {
            type: "text", text: `
            ROLE: High-End Product Director.
            TASK: Synthesize a prompt that places the PRODUCT Subject into the COMPOSITION/LIGHTING of the Reference.
            ${CREATIVE_ONLY_INSTRUCTION}
            CRITICAL RESTRAINT: REFERENCE IMAGE IS A BLUEPRINT OF LIGHT AND GEOMETRY ONLY.
            FINAL PROMPT: Approx 250 characters, English, high-density keywords.
        `}
    ];

    content.push({ type: "image_url", image_url: { url: `data:${refMime};base64,${refBase64}` } });
    content.push({ type: "text", text: "MATRIX: Light and Layout Reference" });

    prodImages.forEach((prod, idx) => {
        content.push({ type: "image_url", image_url: { url: `data:${prod.mimeType};base64,${prod.data}` } });
        content.push({ type: "text", text: `SUBJECT: Main Product Source ${idx + 1}` });
    });

    if (modRefs && modRefs.colors) {
        content.push({ type: "image_url", image_url: { url: `data:${modRefs.colors.mimeType};base64,${modRefs.colors.data}` } });
        content.push({ type: "text", text: "DNA: Color Palette Source" });
    }

    return await callOpenRouter([{ role: "user", content }]);
};

export const extractPaletteFromImage = async (base64Data: string, mimeType: string): Promise<any> => {
    const schema = {
        type: "object",
        properties: {
            palettePrimary: { type: "array", items: { type: "string" } },
            paletteSecondary: { type: "array", items: { type: "string" } },
            description: { type: "string" },
            usagePrompt: { type: "string" }
        },
        required: ["palettePrimary", "paletteSecondary", "description", "usagePrompt"]
    };

    return await callOpenRouter([
        {
            role: "user",
            content: [
                { type: "text", text: "Extract hex colors from this image. Ignore text." },
                { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64Data}` } }
            ]
        }
    ], schema);
};

export const reverseEngineerTextPrompt = async (textPrompt: string): Promise<ReverseEngineeringResult | null> => {
    // reusing the same schema as image reverse engineering which works for text too in this context
    const schema = {
        type: "object",
        properties: {
            description: { type: "string" },
            detailedPrompt: { type: "string" },
            artStyle: { type: "string" },
            composition: { type: "string" },
            promptBreakdown: { type: "array", items: { type: "object", properties: { term: { type: "string" }, explanation: { type: "string" } } } },
            promptLayers: { type: "array", items: { type: "object", properties: { layerType: { type: "string" }, content: { type: "string" }, explanation: { type: "string" } } } },
            improvedPrompt: { type: "string" },
            improvementLogic: { type: "string" }
        }
    };

    return await callOpenRouter([
        { role: "user", content: `Analyze technical tokens: "${textPrompt}". Prohibit aspect ratio tags in output suggestions.` }
    ], schema);
};

export const generateAgentSystemPrompt = async (params: { role: string, context: string, tasks: string, tools: string, constraints: string }): Promise<string> => {
    const instruction = `Create a professional System Prompt for an AI Agent.
    Role: ${params.role}
    Context: ${params.context}
    Tasks: ${params.tasks}
    Tools: ${params.tools}
    Constraints: ${params.constraints}
    
    Output the raw markdown system prompt only.`;

    return await callOpenRouter(
        [{ role: "user", content: instruction }],
        undefined,
        DEFAULT_MODEL // or upgrade to "anthropic/claude-3.5-sonnet" if available
    );
};

export const generateAdCampaign = async (
    productDescription: string,
    cinematicStyle: string = "Cinematic High-End",
    videoCategory: 'FILM' | 'AD' | 'EDU' = 'FILM',
    refImage?: { data: string, mimeType: string } | null
): Promise<AdCampaignResult | null> => {

    let directorPersona = "";
    let systemInstruction = "";

    switch (videoCategory) {
        case 'FILM':
            directorPersona = "VISIONARY FILM DIRECTOR & VISUAL STORYTELLER";
            systemInstruction = `
                ROLE: You are a Director creating a COHESIVE Visual Narrative.
                
                CORE OBJECTIVE:
                Generate a 6-Scene Storyboard where every shot feels connected to the same movie.
                
                ${refImage ? `
                IMPORTANT - VISUAL REFERENCE PROVIDED:
                The user has attached a "Character/Style Reference".
                You MUST use this visual anchor for ALL prompt generations.
                - If it's a character, keep the same features/clothing in every prompt.
                - If it's a style, maintain the specific color palette and texture.
                ` : ''}

                OUTPUT REQUIREMENTS FOR EACH SCENE:
                1. **IMAGE PROMPT**: Highly detailed description for generating the Keyframe (Midjourney/Leonardo). Focus on lighting, composition, and maintaining the Reference Style.
                2. **VIDEO PROMPT**: Specific motion instructions for animating that keyframe (Runway/Kling). describing the movement (e.g., "Slow zoom in," "Pan right," "Character turns head").

                NARRATIVE FLOW:
                Ensure logical progression from Scene 1 to Scene 6. It must tell a short story.
            `;
            break;
        case 'AD':
            directorPersona = "FUTURIST COMMERCIAL DIRECTOR & TECHNICAL CINEMATOGRAPHER";
            systemInstruction = `
                ROLE: You are the "Kubrick of Advertising". You don't just sell products; you engineer visual experiences.
                
                KNOWLEDGE BASE [THE CINEMATOGRAPHY OS]:
                Use strictly this terminology to define the visual grammar of each scene:

                1. **SHOTS (The Windows)**:
                   - *Extreme Wide Shot (EWS)*: Sublime scale, character swallowed by mega-structure.
                   - *Wide Shot (WS)*: Context, urban camouflage.
                   - *Full Shot (FS)*: Kinetics, gait, full body motion.
                   - *Cowboy Shot (CS)*: "Urban Samurai", focus on waist/hands/tools.
                   - *Medium Shot (MS)*: Layering details, social interaction.
                   - *Close-Up (CU)*: Intimacy or Dehumanization (Masks).
                   - *Extreme Close-Up (ECU)*: Material Fetishism (Gore-Tex textures, Zippers, Carbon Fiber).

                2. **ANGLES (The Permissions)**:
                   - *Eye Level*: Neutrality.
                   - *High Angle (Plongée)*: Surveillance, vulnerability (CCTV style).
                   - *Low Angle (Contra-Plongée)*: Power, Monumentality, Brutalism.
                   - *Dutch Angle*: Tension, Aggression, Glitch energy.
                   - *Overhead (Zenital)*: Tactical Diagram, Satellite view.

                3. **MOVES (The Processing)**:
                   - *Gimbal/Steadicam*: AI Perfection, fluid drone-like glide.
                   - *Tracking Shot*: Paralleling the subject's velocity.
                   - *Handheld*: Organic chaos, urgency, human resistance.
                   - *Whip Pan*: Aggressive transition.
                   - *Snap Zoom*: Impact emphasis.
                   - *Dolly Zoom*: Psychological collapse/Vertigo.

                4. **CUTS (The Glitches)**:
                   - *Standard Cut*: Geometric rhythm.
                   - *Jump Cut*: "Matrix Failure", temporal corruption.
                   - *Glitch Cut / Datamoshing*: Digital decomposition.
                   - *Match Cut*: Visual rhyme.

                TASK:
                Generate a 6-Scene Commercial Storyboard.
                For each scene, consciously select the Shot, Angle, and Move that best amplifies the Product's "Sensation".
                
                ${refImage ? 'MAINTAIN BRAND CONSISTENCY: Use the attached image as the Hero Product anchor. Keep lighting and textures consistent.' : ''}
            `;
            break;
        case 'EDU':
            directorPersona = "MASTER DOCUMENTARIAN & MOTION GRAPHICS ARCHITECT";
            systemInstruction = `
                ROLE: You are the Lead Editor for a High-End Netflix Documentary Series (Style: Daniel Penin, Vox, Johnny Harris).
                
                CORE OBJECTIVE:
                Create a visually hypnotic "Visual Essay" that supports a voice-over narration.
                You are NOT filming a classroom. You are creating CINEMATIC EXPLANATIONS.

                VISUAL STYLE [THE MOTION LANGUAGE]:
                - **Kinetic Typography**: Text that moves, interacts with objects, and underscores key points.
                - **Parallax 2.5D**: Static images brought to life through depth separation and slow camera drift.
                - **Mixed Media Collage**: Seamless blending of archival footage, paper textures, and vector graphics.
                - **Data Visualization**: Glowing graphs, maps with connecting lines, floating UI elements.
                - **After Effects Polish**: Smooth ease-in/ease-out transitions, grain, vignette, and light leaks.

                NARRATIVE PACING:
                - The visuals must "flow" like a liquid. No abrupt cuts unless for dramatic impact.
                - Use "Match Cuts" or "Whip Pans" to transition between topics.

                OUTPUT REQUIREMENTS:
                1. **IMAGE PROMPT**: Describe the "Composited Frame". E.g., "A vintage map of Brazil with a glowing red trajectory line, paper texture overlay, dramatic side lighting, 8k resolution."
                2. **VIDEO PROMPT**: Describe the *Motion Design*. E.g., "The red line animates across the map, the camera slowly zooms in on the destination, dust particles float in the foreground."

                ${refImage ? 'MAINTAIN AESTHETIC CONSISTENCY: Use the attached image as the base Style Frame (Color Palette/Texture) for the entire sequence.' : ''}
            `;
            break;
    }

    const schema = {
        type: "object",
        properties: {
            projectTitle: { type: "string" },
            logline: { type: "string" },
            visualStyle: { type: "string" },
            scenes: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        sceneNumber: { type: "integer" },
                        type: { type: "string" },
                        duration: { type: "string" },
                        shotType: { type: "string" },
                        cameraGear: { type: "string" },
                        lighting: { type: "string" },
                        transition: { type: "string" },
                        audioCues: { type: "string" },
                        description: { type: "string" },
                        imagePrompt: { type: "string" },
                        videoPrompt: { type: "string" }
                    },
                    required: ["sceneNumber", "type", "description", "imagePrompt", "videoPrompt"]
                }
            }
        },
        required: ["projectTitle", "logline", "visualStyle", "scenes"]
    };

    const messages = [
        {
            role: "system",
            content: `
            You are a World-Class ${directorPersona}.
            ${systemInstruction}
            
            CRITICAL OUTPUT RULES:
            1. LANGUAGE: All output text (Descriptions, Scripts, Audio Cues) MUST be in PORTUGUESE (PT-BR).
            2. PROMPTS: The 'imagePrompt' and 'videoPrompt' fields must be in ENGLISH for maximum compatibility with Midjourney/Runway.
            
            CAMERA VOCABULARY TO USE:
            - Macro, Close-up, Extreme Close-up
            - Wide Angle, Ultra Wide, Drone View/Aerial
            - Low Angle (Hero), High Angle, Bird's Eye View
            - Diagonal/Dutch Angle/Oblique (for tension)
            - Fisheye (for stylistic distortion)
            `
        },
        {
            role: "user",
            content: [] as any[]
        }
    ];

    // Push Text Instruction
    (messages[1].content as any[]).push({
        type: "text",
        text: `Create a 6-Scene Storyboard for a "${videoCategory}" video about: "${productDescription}" in style "${cinematicStyle}". Describe the 'sensation' and 'copy' (if valid) for each scene.`
    });

    // Push Reference Image if exists
    if (refImage) {
        (messages[1].content as any[]).push({
            type: "image_url",
            image_url: { url: `data:${refImage.mimeType};base64,${refImage.data}` }
        });
        (messages[1].content as any[]).push({ type: "text", text: "REFERENCE ANCHOR: Use this image to maintain visual consistency across all generated scenes." });
    }

    return await callOpenRouter(messages as any, schema, DEFAULT_MODEL, 0.8);
};

// Deprecated or Mocked
export const createDesignChat = (useSearch: boolean): any => {
    console.warn("createDesignChat is deprecated in the OpenRouter migration.");
    return {};
};

export const interpretUrlAndGeneratePrompt = async (url: string): Promise<InterpreterResult | null> => {
    // Requires browsing which OpenRouter non-agent models don't do natively without tools.
    // Returning null for now as per migration plan which noted tool removal.
    return null;
};
