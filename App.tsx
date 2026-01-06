import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Layout from './components/Layout';
import ReverseEngineer from './components/ReverseEngineer';
import ProductStudio from './components/ProductStudio';
import BrandStudio from './components/BrandStudio';
import AgentBuilder from './components/AgentBuilder';
import Sequencer from './components/Sequencer';
import Generator from './components/Generator';
import History from './components/History';
import HelpCenter from './components/HelpCenter';
import Settings from './components/Settings';
import AdminDashboard from './components/AdminDashboard';
import PromptLibrary from './components/PromptLibrary'; // Import
import LearningCenter from './components/LearningCenter'; // Import
import PrdGenerator from './components/PrdGenerator';
import Auth from './components/Auth';
import LandingPage from './components/LandingPage';
import ErrorBoundary from './components/ErrorBoundary';
import { supabase } from './services/supabaseClient';
import { Session } from '@supabase/supabase-js';
import { AppMode, HistoryItem } from './types';
import { Icons } from './components/Icons';
import { TutorialProvider } from './components/TutorialContext';

function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.GENERATOR);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [apiKey, setApiKey] = useState('');
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  // Reuse State
  const [generatorInitialState, setGeneratorInitialState] = useState<{ concept: string, style: string } | undefined>(undefined);

  const handleReusePrompt = (prompt: any) => {
    setGeneratorInitialState({ concept: prompt.concept, style: prompt.style });
    setMode(AppMode.GENERATOR);
  };

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingSession(false);
      if (session) fetchHistory(session.user.id);
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchHistory(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Check API Key
    const key = import.meta.env.VITE_OPENROUTER_API_KEY;
    if (!key || key.includes('YOUR_KEY')) {
      setApiKeyMissing(true);
    } else {
      setApiKey(key);
    }
  }, []);

  const fetchHistory = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('history')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false });

      if (error) throw error;
      if (data) {
        setHistory(data as HistoryItem[]);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const addToHistory = async (input: string, output: any, imageBase64?: string) => {
    if (!session) return;

    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      mode: mode,
      input: input,
      output: output
    };

    // Optimistic Update
    setHistory((prev) => [newItem, ...prev]);

    try {
      // Save to Supabase
      const { error } = await supabase.from('history').insert([{
        user_id: session.user.id,
        mode: mode,
        input: input,
        output: output, // JSONB in DB
        timestamp: new Date().toISOString()
      }]);

      if (error) {
        console.error('Error saving history:', error);
      }
    } catch (err) {
      console.error('Failed to save history entry:', err);
    }
  };

  // Landing Page State
  const [showLogin, setShowLogin] = useState(false);

  if (loadingSession) {
    return (
      <div className="min-h-screen bg-base-black flex items-center justify-center text-neon">
        <Icons.Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Not logged in routing
  if (!session) {
    if (showLogin) {
      return (
        <div className="relative">
          <button
            onClick={() => setShowLogin(false)}
            className="fixed top-4 left-4 z-50 text-neutral-500 hover:text-white flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md"
          >
            <Icons.ArrowLeft className="w-4 h-4" /> Voltar
          </button>
          <Auth />
        </div>
      );
    }
    return <LandingPage onLogin={() => setShowLogin(true)} />;
  }

  if (apiKeyMissing) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-full">
          <Icons.AlertTriangle className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-white">Configuração Necessária</h1>
        <p className="text-neutral-400 max-w-md">
          A chave da API do OpenRouter não foi encontrada.
          <br />
          Por favor, confifique se o arquivo <code className="bg-neutral-800 px-1 py-0.5 rounded text-neon">.env</code> contém a chave correta.
        </p>
        <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800 text-left w-full max-w-md overflow-x-auto">
          <code className="text-xs text-neutral-500 font-mono">
            VITE_OPENROUTER_API_KEY=sk-or-v1-...
          </code>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-neon text-black font-bold rounded-lg hover:bg-neon-light transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  console.log('[App Debug] Current Session:', session ? 'Active' : 'Null');
  console.log('[App Debug] Current Mode:', mode);
  console.log('[App Debug] API Key Missing:', apiKeyMissing);

  return (
    <ErrorBoundary>
      <TutorialProvider>
        <Layout currentMode={mode} setMode={setMode}>
          {mode === AppMode.GENERATOR && <Generator onSaveHistory={addToHistory} initialState={generatorInitialState} />}
          {mode === AppMode.PRODUCT_STUDIO && <ProductStudio onSaveHistory={addToHistory} />}
          {mode === AppMode.AGENT_BUILDER && <AgentBuilder onSaveHistory={addToHistory} />}
          {mode === AppMode.BRAND_STUDIO && <BrandStudio onSaveHistory={addToHistory} />}
          {mode === AppMode.REVERSE_ENGINEER && <ReverseEngineer onSaveHistory={addToHistory} />}
          {mode === AppMode.SEQUENCER && <Sequencer onSaveHistory={addToHistory} />}
          {mode === AppMode.LIBRARY && <PromptLibrary onReuse={handleReusePrompt} />}
          {mode === AppMode.LEARNING_CENTER && <LearningCenter />}
          {mode === AppMode.PRD_GENERATOR && <PrdGenerator />}
          {mode === AppMode.HISTORY && <History history={history} />}
          {mode === AppMode.HELP_CENTER && <HelpCenter />}
          {mode === AppMode.SETTINGS && <Settings />}
          {mode === AppMode.ADMIN && <AdminDashboard />}
        </Layout>
      </TutorialProvider>
    </ErrorBoundary>
  );
}

export default App;
