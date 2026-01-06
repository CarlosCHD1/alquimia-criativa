
import React, { useState, useEffect, useRef } from 'react';
import { createDesignChat } from '../services/geminiService';
import { Chat, GenerateContentResponse } from "@google/genai";
import { Icons } from './Icons';

interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

interface Message {
  role: 'user' | 'model';
  text: string;
  grounding?: GroundingChunk[];
}

// Simple Markdown Formatter Component
const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  // Split by newlines first to handle block elements
  const blocks = text.split('\n');

  return (
    <div className="space-y-2">
      {blocks.map((block, index) => {
        // Empty lines
        if (!block.trim()) return <div key={index} className="h-2"></div>;

        // Headers (###)
        if (block.startsWith('### ')) {
          return <h3 key={index} className="text-lg font-bold text-neon mt-4 mb-2">{block.replace('### ', '')}</h3>;
        }
        if (block.startsWith('## ')) {
          return <h2 key={index} className="text-xl font-bold text-base-content mt-4 mb-2">{block.replace('## ', '')}</h2>;
        }

        // List items (- )
        if (block.trim().startsWith('- ')) {
          const content = block.trim().substring(2);
          return (
            <div key={index} className="flex gap-2 ml-2">
              <span className="text-neon mt-1.5">•</span>
              <p className="flex-1" dangerouslySetInnerHTML={{
                __html: content.replace(/\*\*(.*?)\*\*/g, '<strong class="text-base-content font-bold">$1</strong>')
              }} />
            </div>
          );
        }

        // Code blocks (very simple detection, usually multi-line but handling single line convention here for chat stream)
        // For a stream, complex code block parsing is tricky without a full parser, 
        // so we treat lines starting with 4 spaces or tab as code-ish or just render text.

        // Standard Text with Bold formatting
        return (
          <p key={index} className="leading-relaxed" dangerouslySetInnerHTML={{
            __html: block.replace(/\*\*(.*?)\*\*/g, '<strong class="text-base-content font-bold">$1</strong>')
          }} />
        );
      })}
    </div>
  );
};

const ChatComponent: React.FC = () => {
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Olá. Eu sou o Dr. Nexus, Professor Mestre em Engenharia de Prompt.\n\nEstou aqui para te ensinar a estruturar comandos perfeitos para qualquer objetivo:\n\n• **Geração de Imagem** (Midjourney, Flux)\n• **Vídeo & Cinematografia** (Runway, Luma)\n• **Agentes de IA** (System Prompts para n8n/LangChain)\n• **Web & UI/UX** (React, Tailwind, Sites)\n\nQual desafio vamos estruturar hoje?"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isResearchMode, setIsResearchMode] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize or Re-initialize chat when mode changes
  useEffect(() => {
    const chat = createDesignChat(isResearchMode);
    setChatSession(chat);

    // Optional: Add a system note in UI when switching modes
    if (isResearchMode) {
      setMessages(prev => [...prev, { role: 'model', text: "🔄 **Modo Pesquisa Ativado**. Agora tenho acesso à web para buscar referências técnicas, documentações e exemplos reais." }]);
    }
  }, [isResearchMode]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !chatSession) return;

    const userMsg = inputValue;
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      let fullResponse = "";
      let groundingChunks: GroundingChunk[] = [];

      // Add a placeholder for the model response
      setMessages(prev => [...prev, { role: 'model', text: "" }]);

      const result = await chatSession.sendMessageStream({ message: userMsg });

      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        const textChunk = c.text || "";
        fullResponse += textChunk;

        // Collect grounding metadata if available (Grounding usually comes in specific chunks)
        if (c.candidates && c.candidates[0].groundingMetadata?.groundingChunks) {
          const chunks = c.candidates[0].groundingMetadata.groundingChunks as GroundingChunk[];
          groundingChunks = [...groundingChunks, ...chunks];
        }

        // Update the last message with the accumulated text and grounding data
        setMessages(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1] = {
            role: 'model',
            text: fullResponse,
            grounding: groundingChunks.length > 0 ? groundingChunks : undefined
          };
          return newHistory;
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Erro de conexão neural. Por favor, tente novamente." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Dedup grounding links
  const getUniqueSources = (chunks?: GroundingChunk[]) => {
    if (!chunks) return [];
    const unique = new Map();
    chunks.forEach(c => {
      if (c.web?.uri) {
        unique.set(c.web.uri, c.web.title);
      }
    });
    return Array.from(unique.entries());
  };

  return (
    <div className="w-full max-w-5xl mx-auto h-[85vh] flex flex-col bg-base-card border border-base-border rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">

      {/* Header */}
      <div className="bg-base-dark border-b border-base-border p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-neon/10 border border-neon flex items-center justify-center relative">
            <Icons.Bot className="text-neon w-6 h-6" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-black"></div>
          </div>
          <div>
            <h2 className="text-base-content font-bold text-lg flex items-center gap-2">
              Dr. Nexus <span className="text-[10px] bg-neon text-black px-1 rounded font-mono">PhD</span>
            </h2>
            <p className="text-xs text-neutral-400">Professor de Engenharia de Prompt</p>
          </div>
        </div>

        {/* Research Mode Toggle */}
        <div className="flex items-center bg-base-black rounded-full p-1 border border-neutral-800">
          <button
            onClick={() => setIsResearchMode(false)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${!isResearchMode ? 'bg-neutral-800 text-white shadow-lg' : 'text-neutral-500 hover:text-base-content'}`}
          >
            Chat Rápido
          </button>
          <button
            onClick={() => setIsResearchMode(true)}
            className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${isResearchMode ? 'bg-neon text-black shadow-[0_0_10px_rgba(255,95,0,0.4)]' : 'text-neutral-500 hover:text-white'}`}
          >
            <Icons.Search className="w-3 h-3" />
            Modo Pesquisa
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-base-black/50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                max-w-[90%] md:max-w-[75%] rounded-2xl p-5 shadow-lg relative overflow-hidden
                ${msg.role === 'user'
                  ? 'bg-neon/10 border border-neon/30 text-base-content rounded-tr-none'
                  : 'bg-base-dark border border-neutral-800 text-base-content/80 rounded-tl-none'}
              `}
            >
              <div className="flex items-center gap-2 mb-2 opacity-50 text-xs font-mono uppercase tracking-wider">
                {msg.role === 'user' ? <Icons.Terminal className="w-3 h-3" /> : <Icons.Sparkles className="w-3 h-3" />}
                {msg.role === 'user' ? 'Você' : 'Dr. Nexus'}
              </div>

              <div className="text-sm md:text-base">
                {msg.role === 'user' ? (
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                ) : (
                  <FormattedText text={msg.text} />
                )}
              </div>

              {/* Research Sources Display */}
              {msg.grounding && msg.grounding.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <h4 className="text-xs font-bold text-neon mb-2 flex items-center gap-1">
                    <Icons.Globe className="w-3 h-3" /> Fontes & Referências
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {getUniqueSources(msg.grounding).map(([uri, title], i) => (
                      <a
                        key={i}
                        href={uri}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 p-2 rounded bg-base-black/50 hover:bg-white/5 border border-white/5 hover:border-neon/30 transition-all group"
                      >
                        <div className="bg-neutral-800 p-1 rounded text-neutral-400 group-hover:text-neon">
                          <Icons.ExternalLink className="w-3 h-3" />
                        </div>
                        <span className="text-xs text-neutral-300 truncate font-mono">{title || uri}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-base-dark border border-neutral-800 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-neon rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-neon rounded-full animate-bounce delay-75"></span>
              <span className="w-2 h-2 bg-neon rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-base-dark border-t border-base-border">
        <div className="relative flex items-end gap-2 bg-base-black border border-neutral-700 rounded-xl p-2 focus-within:border-neon focus-within:ring-1 focus-within:ring-neon/50 transition-all">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isResearchMode ? "Pergunte sobre tendências, história da arte ou busque referências..." : "Descreva seu desafio criativo (Ex: Como criar um prompt para vídeo de drone?)..."}
            className="w-full bg-transparent text-base-content placeholder:text-neutral-600 p-2 min-h-[50px] max-h-[150px] resize-none focus:outline-none custom-scrollbar font-sans"
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className={`
              p-3 rounded-lg transition-all mb-0.5
              ${!inputValue.trim() || isTyping
                ? 'bg-neutral-800 text-neutral-600'
                : 'bg-neon text-black hover:bg-neon-light shadow-[0_0_10px_rgba(255,95,0,0.3)]'}
            `}
          >
            <Icons.Send className="w-5 h-5" />
          </button>
        </div>
        <div className="text-center mt-2 flex justify-center items-center gap-2">
          <p className="text-[10px] text-neutral-600 font-mono">NEON FORGE INTELLIGENCE SYSTEM v2.5</p>
          {isResearchMode && <span className="text-[9px] bg-neutral-800 text-neon px-1 rounded border border-neutral-700">WEB ACCESS ON</span>}
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
