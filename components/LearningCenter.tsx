import React, { useState } from 'react';
import { Icons } from './Icons';
import { lessons } from './learningData';

const LearningCenter: React.FC = () => {
    const [selectedLessonId, setSelectedLessonId] = useState<string>('fim-do-acaso');

    const activeLesson = lessons.find(l => l.id === selectedLessonId);

    // Categories in order
    const categories = ['O DESPERTAR', 'ARQUITETURA', 'DIREÇÃO DE ARTE', 'CONSISTÊNCIA', 'BUSINESS'];

    return (
        <div className="w-full max-w-[1600px] mx-auto h-[calc(100vh-100px)] flex gap-6 overflow-hidden">
            {/* Sidebar de Lições */}
            <div className="w-80 bg-base-card border border-base-border rounded-2xl flex flex-col overflow-hidden shrink-0">
                <div className="p-6 border-b border-base-border bg-gradient-to-r from-base-black to-neutral-900">
                    <h2 className="text-xl font-bold text-base-content flex items-center gap-2">
                        <Icons.GraduationCap className="text-neon" />
                        Orchestrator Academy
                    </h2>
                    <p className="text-xs text-neutral-400 mt-1">De Operário a Maestro da IA.</p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar">

                    {/* Categories */}
                    {categories.map((cat, index) => (
                        <div key={cat} className="relative">
                            <div className="sticky top-0 bg-base-card z-10 py-2 mb-2 border-b border-neutral-800">
                                <h3 className="text-[10px] font-bold text-neon/80 uppercase tracking-widest pl-2">
                                    Fase {index + 1}: {cat}
                                </h3>
                            </div>
                            <div className="space-y-1">
                                {lessons.filter(l => l.category === cat).map(lesson => (
                                    <button
                                        key={lesson.id}
                                        onClick={() => setSelectedLessonId(lesson.id)}
                                        className={`w-full flex items-center justify-between p-3 rounded-lg text-sm transition-all text-left group
                                            ${selectedLessonId === lesson.id
                                                ? 'bg-neon/10 text-neon border border-neon/30 shadow-[0_0_15px_rgba(45,212,191,0.1)]'
                                                : 'text-neutral-400 hover:bg-white/5 hover:text-white border border-transparent'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-1.5 h-1.5 rounded-full ${selectedLessonId === lesson.id ? 'bg-neon' : 'bg-neutral-600 group-hover:bg-white'}`}></div>
                                            <span className="truncate">{lesson.title}</span>
                                        </div>
                                        <span className="text-[9px] opacity-40 font-mono">{lesson.duration}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}

                </div>
            </div>

            {/* Conteúdo da Lição */}
            <div className="flex-1 bg-base-card border border-base-border rounded-2xl overflow-y-auto custom-scrollbar relative bg-gradient-to-br from-base-black to-neutral-900">
                {activeLesson ? (
                    <div className="max-w-5xl mx-auto p-12">
                        <div className="mb-12 flex flex-col gap-4 border-b border-neutral-800 pb-8">
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 rounded-full bg-neon/10 border border-neon/20 text-[10px] font-bold text-neon uppercase tracking-wider shadow-[0_0_10px_rgba(45,212,191,0.2)]">
                                    {activeLesson.category}
                                </span>
                                <span className="text-neutral-600 text-xs">•</span>
                                <span className="text-xs text-neutral-500 flex items-center gap-1">
                                    <Icons.Clock className="w-3 h-3" /> {activeLesson.duration} de leitura
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">{activeLesson.title}</h1>
                        </div>

                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8 text-neutral-300">
                            {activeLesson.content}
                        </div>

                        <div className="mt-16 pt-12 border-t border-neutral-800 flex justify-between items-center text-sm text-neutral-500">
                            <div className="flex flex-col">
                                <span className="text-xs text-neutral-600 uppercase tracking-widest font-bold mb-1">Próximo Passo</span>
                                <p className="text-neutral-400">Continue para a próxima fase da sua jornada.</p>
                            </div>
                            <button className="flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-neon hover:scale-105 transition-all duration-300 shadow-xl">
                                <Icons.Check className="w-4 h-4" /> Concluir Lição
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-neutral-500">
                        <Icons.Book className="w-16 h-16 mb-6 opacity-10 animate-pulse" />
                        <p className="text-xl font-light tracking-wide">Selecione um módulo para iniciar sua orquestração.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LearningCenter;
