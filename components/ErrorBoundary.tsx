
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Icons } from './Icons';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends React.Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-black/90 text-white z-50 fixed inset-0">
                    <div className="bg-red-900/20 border border-red-500/50 rounded-2xl p-8 max-w-3xl w-full shadow-2xl backdrop-blur-xl">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-red-500/20 p-3 rounded-full">
                                <Icons.AlertTriangle className="w-8 h-8 text-red-500" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-red-100">Erro Crítico na Aplicação</h1>
                                <p className="text-red-300 text-sm">O sistema encontrou um erro inesperado e precisa ser reiniciado.</p>
                            </div>
                        </div>

                        <div className="bg-black/50 rounded-xl p-4 mb-6 border border-red-500/10 overflow-auto max-h-[400px] custom-scrollbar">
                            <p className="font-mono text-neon font-bold mb-2">{this.state.error?.toString()}</p>
                            <details className="text-xs text-neutral-400 font-mono whitespace-pre-wrap">
                                <summary className="cursor-pointer hover:text-white mb-2 underline">Ver Stack Trace</summary>
                                {this.state.errorInfo?.componentStack}
                            </details>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-neon hover:bg-neon-light text-black px-6 py-3 rounded-lg font-bold transition-all shadow-lg hover:shadow-neon/20 flex-1"
                            >
                                Reiniciar Aplicação
                            </button>
                            <button
                                onClick={() => {
                                    window.localStorage.clear();
                                    window.location.reload();
                                }}
                                className="bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-3 rounded-lg font-bold transition-all border border-neutral-700 flex-1"
                            >
                                Limpar Cache e Reiniciar
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
