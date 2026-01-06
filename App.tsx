
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
  const [debugKey, setDebugKey] = useState<string | null>(null);
  
  // Start with needsApiKey true if the environment variable is explicitly missing
  const [needsApiKey, setNeedsApiKey] = useState(() => !process.env.API_KEY);
  
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    return (localStorage.getItem('cosmic_oracle_lang') as Language) || 'en';
  });

  const [hasConsented, setHasConsented] = useState<boolean>(() => {
    return localStorage.getItem('cosmic_oracle_consent') === 'true';
  });

  useEffect(() => {
    const checkKeyStatus = async () => {
      if (!process.env.API_KEY) {
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
      // Per instructions: assume success and proceed to the app immediately
      setNeedsApiKey(false);
    } else {
      console.error("AIStudio bridge not found.");
      setError("Celestial Bridge not found in this environment.");
    }
  };

  const handleFormSubmit = async (details: UserDetails) => {
    setLoading(true);
    setError(null);
    setDebugKey(null);
    const detailsWithCurrentLang = { ...details, language: currentLanguage };
    
    try {
      const data = await getAstrologyPrediction(detailsWithCurrentLang);
      setUserDetails(detailsWithCurrentLang);
      setPrediction(data);
    } catch (err: any) {
      console.error("Prediction Fetch Error:", err);
      
      const currentKey = process.env.API_KEY;
      setDebugKey(currentKey === undefined ? "UNDEFINED" : currentKey === "" ? "EMPTY STRING" : `EXISTS (${currentKey.substring(0, 4)}...)`);

      // If the key is revoked or missing mid-session, prompt for selection again
      if (err.message?.includes("Requested entity was not found") || !currentKey) {
        setNeedsApiKey(true);
      }

      setError(currentLanguage === 'si' 
        ? "විශ්වීය දත්ත ලබා ගැනීමට නොහැකි විය. කරුණාකර ඔබගේ API_KEY එක පරීක්ෂා කර නැවත උත්සාහ කරන්න." 
        : "The celestial signals are weak. Please check your API_KEY configuration and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUserDetails(null);
    setPrediction(null);
    setError(null);
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
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center animate-fade-in">
        <Header />
        <div className="mt-12 p-10 glass rounded-[2.5rem] border border-white/10 max-w-xl w-full space-y-8">
          <h2 className="text-[length:var(--fs-heading-sub)] font-bold text-white uppercase tracking-widest">Connect to Gemini</h2>
          <p className="text-[length:var(--fs-body)] text-white/50 leading-relaxed">
            The Cosmic Oracle requires a connection to Google's celestial processors. Please select a paid API key to begin your journey.
          </p>
          <div className="bg-purple-500/5 border border-purple-500/10 p-5 rounded-2xl text-[11px] text-purple-200/50 text-left space-y-2">
            <p>• A key from a paid GCP project is required.</p>
            <p>• Visit the <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">billing docs</a> for details.</p>
          </div>
          <button 
            onClick={handleSelectKey}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-5 rounded-xl font-bold uppercase tracking-[0.2em] text-[length:var(--fs-btn-text)] hover:scale-[1.01] active:scale-95 transition-all shadow-xl"
          >
            Select API Key
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-6 md:p-8 overflow-x-hidden text-white">
      <Header />
      
      {!hasConsented && (
        <ConsentModal 
          onAccept={handleAcceptConsent} 
          language={currentLanguage} 
          onLanguageChange={toggleLanguage}
        />
      )}

      <main className="w-full max-w-5xl flex-grow mt-8 relative">
        {loading && (
          <div className="absolute inset-0 z-20 bg-[#0a0a1a]/80 backdrop-blur-lg rounded-[2.5rem]">
            <Loader language={currentLanguage} />
          </div>
        )}

        <div className={prediction ? 'hidden' : 'block animate-fade-in'}>
          <AstroForm 
            onSubmit={handleFormSubmit} 
            currentLanguage={currentLanguage} 
            onLanguageChange={toggleLanguage}
            disabled={loading}
          />
          {error && (
            <div className="mt-8 p-8 glass rounded-[2rem] text-red-400 text-center border border-red-500/20 bg-red-500/5 shadow-2xl animate-fade-in">
              <div className="flex items-center justify-center space-x-3 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-bold uppercase tracking-[0.3em] text-[var(--fs-form-label)]">Celestial Obstacle</span>
              </div>
              <p className="text-[length:var(--fs-body)] font-medium leading-relaxed mb-4">{error}</p>
              
              <div className="mt-4 p-3 bg-black/40 rounded-xl border border-white/5 text-[9px] font-mono tracking-wider opacity-60">
                <p>DEBUG [process.env.API_KEY]: <span className="text-yellow-400 font-bold">{debugKey}</span></p>
                <button 
                  onClick={() => setNeedsApiKey(true)}
                  className="mt-2 text-purple-400 hover:text-purple-300 underline font-bold uppercase tracking-wider"
                >
                  Reset Connection / Change Key
                </button>
              </div>
            </div>
          )}
        </div>

        {prediction && userDetails && (
          <div className="space-y-12 animate-fade-in pb-24">
            <PredictionDisplay 
              prediction={prediction} 
              userName={userDetails.name} 
              language={currentLanguage}
            />
            <ChatInterface 
              userDetails={userDetails} 
              prediction={prediction} 
              onLanguageChange={toggleLanguage}
              currentLanguage={currentLanguage}
            />
            <div className="flex justify-center">
              <button 
                onClick={handleReset}
                className="px-10 py-4 rounded-full glass border border-white/20 text-white/70 hover:text-white hover:border-white/50 hover:bg-white/10 transition-all text-[length:var(--fs-btn-text)] font-bold tracking-[0.4em] uppercase shadow-xl active:scale-95"
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
