import { DriveStep } from "driver.js";
import { AppMode } from "../types";

export const TOUR_STEPS: Record<AppMode | 'GLOBAL', DriveStep[]> = {
    GLOBAL: [
        {
            element: '#sidebar-nav',
            popover: {
                title: 'Navegação Principal',
                description: 'Aqui você acessa todas as ferramentas do Alquimia Criativa. Cada ícone representa um laboratório especializado.',
                side: "right",
                align: 'start'
            }
        },
        {
            element: '#sidebar-credits',
            popover: {
                title: 'Seus Créditos',
                description: 'Monitore seu saldo de geração aqui. Você pode adquirir mais créditos clicando em "Adicionar Créditos".',
                side: "right",
                align: 'end'
            }
        }
    ],
    [AppMode.GENERATOR]: [
        {
            element: '#generator-input',
            popover: {
                title: 'Sua Ideia Inicial',
                description: 'Digite aqui sua ideia básica. Não se preocupe com detalhes técnicos ainda, apenas descreva o que você imagina.',
                side: "bottom",
                align: 'start'
            }
        },
        {
            element: '#generator-options',
            popover: {
                title: 'Parâmetros Técnicos',
                description: 'Ajuste a proporção (Aspect Ratio), versão do Midjourney e nível de caos para refinar o resultado.',
                side: "right",
                align: 'center'
            }
        },
        {
            element: '#enhance-btn',
            popover: {
                title: 'A Mágica Acontece',
                description: 'Clique aqui para transformar sua ideia simples em um prompt de engenharia avançada, pronto para uso.',
                side: "bottom",
                align: 'center'
            }
        },
        {
            element: '#prompt-history',
            popover: {
                title: 'Histórico Recente',
                description: 'Seus últimos prompts gerados aparecem aqui para fácil acesso e reutilização.',
                side: "left",
                align: 'start'
            }
        }
    ],
    [AppMode.AGENT_BUILDER]: [
        {
            element: '#agent-type-select',
            popover: {
                title: 'Escolha o Arquétipo',
                description: 'Selecione o tipo de especialista que você deseja criar (ex: Copywriter, Coding Assistant).',
                side: "bottom",
                align: 'start'
            }
        },
        {
            element: '#knowledge-base',
            popover: {
                title: 'Base de Conhecimento',
                description: 'Faça upload de documentos ou cole textos para treinar seu agente com informações específicas.',
                side: "left",
                align: 'start'
            }
        },
        {
            element: '#compile-btn',
            popover: {
                title: 'Compilar Agente',
                description: 'Gere o System Prompt final otimizado para usar no ChatGPT, Claude ou n8n.',
                side: "top",
                align: 'center'
            }
        }
    ],
    // Fallback for modes without specific steps yet
    [AppMode.PRODUCT_STUDIO]: [],
    [AppMode.BRAND_STUDIO]: [],
    [AppMode.REVERSE_ENGINEER]: [],
    [AppMode.SEQUENCER]: [],
    [AppMode.LIBRARY]: [],
    [AppMode.LEARNING_CENTER]: [],
    [AppMode.PRD_GENERATOR]: [],
    [AppMode.HISTORY]: [],
    [AppMode.SETTINGS]: [],
    [AppMode.HELP_CENTER]: [],
    [AppMode.ADMIN]: [],
    [AppMode.LANDING]: [],
};
