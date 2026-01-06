
import React, { useState, useEffect } from 'react';
import { UserDetails, PredictionData, Language, AppView, SignCategoryPrediction, ZODIAC_SIGNS } from './types.ts';
import { getAstrologyPrediction, getAllSignPredictions } from './services/geminiService.ts';
import AstroForm from './components/AstroForm.tsx';
import PredictionDisplay from './components/PredictionDisplay.tsx';
import ChatInterface from './components/ChatInterface.tsx';
import Header from './components/Header.tsx';
import Loader from './components/Loader.tsx';
import ConsentModal from './components/ConsentModal.tsx';
import ZodiacHome from './components/ZodiacHome.tsx';
import SignPrediction from './components/SignPrediction.tsx';
import Disclaimer from './components/Disclaimer.tsx';
import AdOverlay from './components/AdOverlay.tsx';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<AppView>('HOME');
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [signDetail, setSignDetail] = useState<SignCategoryPrediction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rawError, setRawError] = useState<string | null>(null);
  
  // Cache for all sign predictions to avoid repeated API calls
  const [signCache, setSignCache] = useState<Partial<Record<Language, Record<string, SignCategoryPrediction>>>>({});

  // Freemium Ad State
  const [adOverlayActive, setAdOverlayActive] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => Promise<void>) | null>(null);
  
  const [needsApiKey, setNeedsApiKey] = useState(() => {
    return !process.env.API_KEY && !(import.meta as any).env?.VITE_API_KEY;
  });
  
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    return (localStorage.getItem('cosmic_oracle_lang') as Language) || 'en';
  });

  const [hasConsented, setHasConsented] = useState<boolean>(() => {
    return localStorage.getItem('cosmic_oracle_consent') === 'true';
  });

  // Effect to reset scroll position on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

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
      setError("Celestial Bridge not found.");
    }
  };

  const executeFormSubmit = async (details: UserDetails) => {
    setLoading(true);
    setError(null);
    setRawError(null);
    try {
      const data = await getAstrologyPrediction(details);
      setUserDetails(details);
      setPrediction(data);
      setView('RESULT');
    } catch (err: any) {
      setRawError(err.message || "Unknown celestial error");
      setError(currentLanguage === 'si' ? "දත්ත ලබා ගැනීමට නොහැකි විය." : "Failed to fetch celestial data.");
    } finally {
      setLoading(false);
    }
  };

  const executeSignSelect = async (signId: string) => {
    // 1. Check if we already have the predictions for ALL signs in this language
    const currentLangCache = signCache[currentLanguage];
    
    if (currentLangCache && currentLangCache[signId]) {
      // Instant reveal from cache
      setSignDetail(currentLangCache[signId]);
      setView('SIGN_DETAIL');
      return;
    }

    // 2. Otherwise, fetch all 12 signs in one network request
    setLoading(true);
    setError(null);
    try {
      const allData = await getAllSignPredictions(currentLanguage);
      
      // Update cache
      setSignCache(prev => ({
        ...prev,
        [currentLanguage]: allData
      }));

      // Pick the one the user clicked on
      const selectedSignData = allData[signId];
      if (selectedSignData) {
        setSignDetail(selectedSignData);
        setView('SIGN_DETAIL');
      } else {
        throw new Error("Sign data missing from alignment.");
      }
    } catch (err: any) {
      console.error(err);
      setError(currentLanguage === 'si' ? "දත්ත ලබා ගැනීමට නොහැකි විය." : "Failed to fetch celestial data.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (details: UserDetails) => {
    setPendingAction(() => () => executeFormSubmit(details));
    setAdOverlayActive(true);
  };

  const handleSignSelect = (signId: string) => {
    // ALWAYS trigger the ad view irrespective of whether the data is cached or not.
    setPendingAction(() => () => executeSignSelect(signId));
    setAdOverlayActive(true);
  };

  const handleAdComplete = () => {
    setAdOverlayActive(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const handleReset = () => {
    setView('HOME');
    setUserDetails(null);
    setPrediction(null);
    setSignDetail(null);
    setError(null);
  };

  const toggleLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    localStorage.setItem('cosmic_oracle_lang', lang);
  };

  const handleAcceptConsent = () => {
    setHasConsented(true);
    localStorage.setItem('cosmic_oracle_consent', 'true');
  };

  const isAtHome = view === 'HOME';
  const headerBtnText = isAtHome 
    ? (currentLanguage === 'si' ? "කේන්ද්‍ර පලාපල" : "Personalized Chart")
    : (currentLanguage === 'si' ? "ලග්න පලාපල" : "Zodiac Horoscopes");

  if (needsApiKey) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center animate-fade-in">
        <Header />
        <div className="mt-12 p-10 glass rounded-[2.5rem] border border-white/10 max-w-xl w-full space-y-8">
          <h2 className="text-2xl font-bold text-white uppercase tracking-widest">Establish Connection</h2>
          <p className="text-white/50 leading-relaxed">The Cosmic Oracle needs an API key to communicate with the stars.</p>
          <button onClick={handleSelectKey} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-5 rounded-xl font-bold uppercase tracking-[0.2em] hover:scale-[1.01] active:scale-95 transition-all shadow-xl">
            Select API Key
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-6 md:p-8 overflow-x-hidden text-white">
      <div className="w-full max-w-5xl flex justify-between items-center mb-8">
        <div className="cursor-pointer" onClick={handleReset}>
          <Header />
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={() => isAtHome ? setView('FORM') : handleReset()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-[11px] font-bold uppercase tracking-[0.2em] transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_10px_20px_rgba(124,58,237,0.2)]"
          >
            {headerBtnText}
          </button>
        </div>
      </div>
      
      {!hasConsented && <ConsentModal onAccept={handleAcceptConsent} language={currentLanguage} onLanguageChange={toggleLanguage} />}

      {adOverlayActive && (
        <AdOverlay 
          language={currentLanguage} 
          onComplete={handleAdComplete} 
          onClose={() => setAdOverlayActive(false)} 
        />
      )}

      <main className="w-full max-w-5xl flex-grow relative">
        {loading && <div className="fixed inset-0 z-[100] bg-[#0a0a1a]/80 backdrop-blur-lg flex items-center justify-center"><Loader language={currentLanguage} /></div>}

        {error && (
          <div className="mb-8 p-6 glass rounded-2xl text-red-400 text-center border border-red-500/20 bg-red-500/5 shadow-xl animate-fade-in">
             <p className="font-bold uppercase tracking-widest mb-2">Celestial Obstacle</p>
             <p className="text-sm opacity-80">{error}</p>
             <button onClick={() => setError(null)} className="mt-4 text-xs underline uppercase tracking-widest text-white/50">Dismiss</button>
          </div>
        )}

        {view === 'HOME' && (
          <ZodiacHome 
            language={currentLanguage} 
            onSignSelect={handleSignSelect} 
            onLanguageChange={toggleLanguage}
          />
        )}

        {view === 'SIGN_DETAIL' && signDetail && (
          <div className="animate-fade-in space-y-12">
            <SignPrediction prediction={signDetail} language={currentLanguage} onBack={handleReset} />
          </div>
        )}

        {view === 'FORM' && (
          <AstroForm 
            onSubmit={handleFormSubmit} 
            currentLanguage={currentLanguage} 
            onLanguageChange={toggleLanguage}
            disabled={loading}
          />
        )}

        {view === 'RESULT' && prediction && userDetails && (
          <div className="space-y-12 animate-fade-in pb-24">
            <PredictionDisplay prediction={prediction} userName={userDetails.name} language={currentLanguage} />
            <ChatInterface userDetails={userDetails} prediction={prediction} onLanguageChange={toggleLanguage} currentLanguage={currentLanguage} />
            
            <Disclaimer language={currentLanguage} />

            <div className="flex justify-center">
              <button 
                onClick={handleReset} 
                className="px-12 py-5 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold transition-all transform hover:scale-[1.01] active:scale-[0.98] shadow-[0_15px_40px_rgba(124,58,237,0.3)] tracking-[0.3em] uppercase text-[length:var(--fs-btn-text)]"
              >
                {currentLanguage === 'si' ? "නැවත මුල් පිටුවට" : "Return to Home"}
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
