
import React, { useState, useEffect } from 'react';
import { UserDetails, PredictionData, Language } from './types.ts';
import { getAstrologyPrediction } from './services/geminiService.ts';
import AstroForm from './components/AstroForm.tsx';
import PredictionDisplay from './components/PredictionDisplay.tsx';
import ChatInterface from './components/ChatInterface.tsx';
import Header from './components/Header.tsx';
import Loader from './components/Loader.tsx';
import ConsentModal from './components/ConsentModal.tsx';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rawError, setRawError] = useState<string | null>(null);
  const [debugKey, setDebugKey] = useState<string | null>(null);
  
  const [needsApiKey, setNeedsApiKey] = useState(() => {
    return !process.env.API_KEY && !(import.meta as any).env?.VITE_API_KEY;
  });
  
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    return (localStorage.getItem('cosmic_oracle_lang') as Language) || 'en';
  });

  const [hasConsented, setHasConsented] = useState<boolean>(() => {
    return localStorage.getItem('cosmic_oracle_consent') === 'true';
  });

  useEffect(() => {
    const checkKeyStatus = async () => {
      const hasEnvKey = !!process.env.API_KEY || !!(import.meta as any).env?.VITE_API_KEY;
      
      if (!hasEnvKey) {
        const aistudio = (window as any).aistudio;
        if (aistudio && typeof aistudio.hasSelectedApiKey === 'function') {
          const hasKey = await aistudio.hasSelectedApiKey();
          setNeedsApiKey(!hasKey);
        } else {
          setNeedsApiKey(true);
        }
      } else {
        setNeedsApiKey(false);
      }
    };
    checkKeyStatus();
  }, []);

  const handleSelectKey = async () => {
    const aistudio = (window as any).aistudio;
    if (aistudio && typeof aistudio.openSelectKey === 'function') {
      await aistudio.openSelectKey();
      setNeedsApiKey(false);
    } else {
      setError("Celestial Bridge not found. Ensure VITE_API_KEY is configured.");
    }
  };

  const handleFormSubmit = async (details: UserDetails) => {
    setLoading(true);
    setError(null);
    setRawError(null);
    setDebugKey(null);
    const detailsWithCurrentLang = { ...details, language: currentLanguage };
    
    try {
      const data = await getAstrologyPrediction(detailsWithCurrentLang);
      setUserDetails(detailsWithCurrentLang);
      setPrediction(data);
    } catch (err: any) {
      console.error("Prediction Fetch Error:", err);
      
      const pKey = process.env.API_KEY;
      const vKey = (import.meta as any).env?.VITE_API_KEY;
      setDebugKey(pKey ? `PROCESS_ENV_READY` : vKey ? `VITE_ENV_READY` : "NOT_FOUND");
      
      // Store the actual API error message for debugging
      setRawError(err.message || "Unknown celestial error");

      if (err.message?.includes("Requested entity was not found") || (!pKey && !vKey)) {
        setNeedsApiKey(true);
      }

      setError(currentLanguage === 'si' 
        ? "විශ්වීය දත්ත ලබා ගැනීමට නොහැකි විය. කරුණාකර ඔබගේ API_KEY එක සහ බිල්පත් විස්තර පරීක්ෂා කරන්න." 
        : "The celestial signals are weak. Please check your API key validity and billing status.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUserDetails(null);
    setPrediction(null);
    setError(null);
    setRawError(null);
    setDebugKey(null);
  };

  const toggleLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    localStorage.setItem('cosmic_oracle_lang', lang);
    if (userDetails) {
      setUserDetails({ ...userDetails, language: lang });
    }
  };

  const handleAcceptConsent = () => {
    setHasConsented(true);
    localStorage.setItem('cosmic_oracle_consent', 'true');
  };

  if (needsApiKey) {
    const isLocalBuild = !(window as any).aistudio;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center animate-fade-in">
        <Header />
        <div className="mt-12 p-10 glass rounded-[2.5rem] border border-white/10 max-w-xl w-full space-y-8">
          <h2 className="text-[length:var(--fs-heading-sub)] font-bold text-white uppercase tracking-widest">Establish Connection</h2>
          <p className="text-[length:var(--fs-body)] text-white/50 leading-relaxed">
            The Cosmic Oracle needs an API key to communicate with the stars. 
            {isLocalBuild ? " Please ensure VITE_API_KEY is set in your Vercel settings." : " Please select a paid API key to begin."}
          </p>
          <div className="bg-purple-500/5 border border-purple-500/10 p-5 rounded-2xl text-[11px] text-purple-200/50 text-left space-y-2">
            <p>• Key must be from a <strong>paid</strong> Google Cloud project.</p>
            <p>• Recommended key name: <code className="text-white">VITE_API_KEY</code></p>
          </div>
          {!isLocalBuild ? (
            <button onClick={handleSelectKey} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-5 rounded-xl font-bold uppercase tracking-[0.2em] text-[length:var(--fs-btn-text)] hover:scale-[1.01] active:scale-95 transition-all shadow-xl">
              Select API Key
            </button>
          ) : (
            <div className="p-4 border border-red-500/20 bg-red-500/5 rounded-xl text-red-400 text-xs font-bold uppercase tracking-widest">
              Awaiting Environment Configuration
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-6 md:p-8 overflow-x-hidden text-white">
      <Header />
      {!hasConsented && <ConsentModal onAccept={handleAcceptConsent} language={currentLanguage} onLanguageChange={toggleLanguage} />}
      <main className="w-full max-w-5xl flex-grow mt-8 relative">
        {loading && <div className="absolute inset-0 z-20 bg-[#0a0a1a]/80 backdrop-blur-lg rounded-[2.5rem]"><Loader language={currentLanguage} /></div>}
        <div className={prediction ? 'hidden' : 'block animate-fade-in'}>
          <AstroForm onSubmit={handleFormSubmit} currentLanguage={currentLanguage} onLanguageChange={toggleLanguage} disabled={loading} />
          {error && (
            <div className="mt-8 p-8 glass rounded-[2rem] text-red-400 text-center border border-red-500/20 bg-red-500/5 shadow-2xl animate-fade-in">
              <div className="flex items-center justify-center space-x-3 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                <span className="font-bold uppercase tracking-[0.3em] text-[var(--fs-form-label)]">Celestial Obstacle</span>
              </div>
              <p className="text-[length:var(--fs-body)] font-medium leading-relaxed mb-4">{error}</p>
              
              <div className="mt-4 p-4 bg-black/40 rounded-xl border border-white/5 text-[10px] font-mono tracking-wider space-y-2">
                <p>SOURCE: <span className="text-yellow-400 font-bold">{debugKey}</span></p>
                <p className="text-red-300 opacity-80 break-words">API ERROR: {rawError}</p>
                <div className="pt-2 border-t border-white/5">
                  <button onClick={() => setNeedsApiKey(true)} className="text-purple-400 hover:text-purple-300 underline font-bold uppercase tracking-wider">
                    Update Connection
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {prediction && userDetails && (
          <div className="space-y-12 animate-fade-in pb-24">
            <PredictionDisplay prediction={prediction} userName={userDetails.name} language={currentLanguage} />
            <ChatInterface userDetails={userDetails} prediction={prediction} onLanguageChange={toggleLanguage} currentLanguage={currentLanguage} />
            <div className="flex justify-center">
              <button 
                onClick={handleReset} 
                className="px-12 py-5 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold transition-all transform hover:scale-[1.01] active:scale-[0.98] shadow-[0_15px_40px_rgba(124,58,237,0.3)] tracking-[0.3em] uppercase text-[length:var(--fs-btn-text)]"
              >
                {currentLanguage === 'si' ? "නැවත තරු විමසන්න" : "Return to the Stars"}
              </button>
            </div>
          </div>
        )}
      </main>
      <footer className="mt-auto py-8 text-white/30 text-xs uppercase tracking-[0.4em] text-center w-full border-t border-white/5">
        &copy; {new Date().getFullYear()} Cosmic Oracle • Handcrafted Wisdom
      </footer>
    </div>
  );
};

export default App;
