
import React, { useState, useEffect } from 'react';
import { UserDetails, PredictionData, Language, AppView, SignCategoryPrediction, MatchDetails, MatchPrediction } from './types.ts';
import { getAstrologyPrediction, getAllSignPredictions, getHoroscopeMatch } from './services/geminiService.ts';
import AstroForm from './components/AstroForm.tsx';
import MatchForm from './components/MatchForm.tsx';
import PredictionDisplay from './components/PredictionDisplay.tsx';
import MatchDisplay from './components/MatchDisplay.tsx';
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
  const [matchDetails, setMatchDetails] = useState<MatchDetails | null>(null);
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [matchPrediction, setMatchPrediction] = useState<MatchPrediction | null>(null);
  const [signDetail, setSignDetail] = useState<SignCategoryPrediction | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [signCache, setSignCache] = useState<Partial<Record<Language, Record<string, SignCategoryPrediction>>>>({});
  
  const [needsApiKey, setNeedsApiKey] = useState(false);
  
  // Default language set to English, UI switching disabled
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  
  // Overlay State
  const [adOverlayActive, setAdOverlayActive] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => Promise<void>) | null>(null);

  const [hasConsented, setHasConsented] = useState<boolean>(() => {
    return localStorage.getItem('cosmic_oracle_consent') === 'true';
  });

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
          // If bridge is not available and no env key, we can't do much but we'll show the state
          setNeedsApiKey(true);
        }
      } else {
        setNeedsApiKey(false);
      }
    };
    checkKeyStatus();
  }, []);

  const handleConnectKey = async () => {
    const aistudio = (window as any).aistudio;
    if (aistudio && typeof aistudio.openSelectKey === 'function') {
      await aistudio.openSelectKey();
      setNeedsApiKey(false); // Assume success per race condition handling guidelines
      window.location.reload(); // Reload to re-initialize environment
    }
  };

  const executeFormSubmit = async (details: UserDetails) => {
    if (loading) return; 
    setLoading(true);
    setError(null);
    try {
      const data = await getAstrologyPrediction(details);
      setUserDetails(details);
      setPrediction(data);
      setView('RESULT');
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
        setNeedsApiKey(true);
      }
      setError(currentLanguage === 'si' ? "දත්ත ලබා ගැනීමට නොහැකි විය." : "Failed to fetch celestial data. Please ensure your API key is connected.");
    } finally {
      setLoading(false);
    }
  };

  const executeMatchSubmit = async (details: MatchDetails) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getHoroscopeMatch(details, currentLanguage);
      setMatchDetails(details);
      setMatchPrediction(data);
      setView('MATCH_RESULT');
    } catch (err: any) {
      console.error(err);
      setError(currentLanguage === 'si' ? "ගැළපීම් සිදු කිරීමට නොහැකි විය." : "Failed to perform matching ritual.");
    } finally {
      setLoading(false);
    }
  };

  const executeSignSelect = async (signId: string) => {
    const currentLangCache = signCache[currentLanguage];
    if (currentLangCache && currentLangCache[signId]) {
      setSignDetail(currentLangCache[signId]);
      setView('SIGN_DETAIL');
      return;
    }

    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const allData = await getAllSignPredictions(currentLanguage);
      setSignCache(prev => ({ ...prev, [currentLanguage]: allData }));
      const selectedSignData = allData[signId];
      if (selectedSignData) {
        setSignDetail(selectedSignData);
        setView('SIGN_DETAIL');
      } else {
        throw new Error("Sign data missing.");
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

  const handleMatchSubmit = (details: MatchDetails) => {
    setPendingAction(() => () => executeMatchSubmit(details));
    setAdOverlayActive(true);
  };

  const handleSignSelect = (signId: string) => {
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
    setMatchPrediction(null);
    setMatchDetails(null);
    setError(null);
  };

  const toggleLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
  };

  const handleAcceptConsent = () => {
    setHasConsented(true);
    localStorage.setItem('cosmic_oracle_consent', 'true');
  };

  const isZodiacMode = view === 'HOME' || view === 'SIGN_DETAIL';
  const isPersonalizedMode = view === 'FORM' || view === 'RESULT';
  const isMatchMode = view === 'MATCH_FORM' || view === 'MATCH_RESULT';

  // Only show ads/sidebar if language is English AND we are in a result view
  const showSidebar = currentLanguage === 'en' && (view === 'RESULT' || view === 'MATCH_RESULT' || view === 'SIGN_DETAIL');

  const navButtons = [
    { 
      id: 'zodiac', 
      label: currentLanguage === 'si' ? 'ලග්න පලාපල' : 'Zodiac Signs', 
      action: handleReset,
      gradient: 'from-purple-600 to-indigo-600',
      active: isZodiacMode
    },
    { 
      id: 'personalized', 
      label: currentLanguage === 'si' ? 'කේන්ද්‍ර පලාපල' : 'Birth Chart', 
      action: () => setView('FORM'),
      gradient: 'from-blue-600 to-cyan-600',
      active: isPersonalizedMode
    },
    { 
      id: 'match', 
      label: currentLanguage === 'si' ? 'පොරොන්දම් බැලීම' : 'Horoscope Match', 
      action: () => setView('MATCH_FORM'),
      gradient: 'from-pink-600 to-rose-600',
      active: isMatchMode
    }
  ];

  const visibleButtons = navButtons.filter(btn => !btn.active);
  
  return (
    <div className="min-h-screen flex flex-col items-center p-6 md:p-8 overflow-x-hidden text-white">
      {/* Header Container: Centered Header and Navigation Row */}
      <div className="w-full max-w-[1500px] flex flex-col mb-12 gap-8">
        {/* Row 1: Brand/Header (Centered) */}
        <div className="w-full flex justify-center cursor-pointer" onClick={handleReset}>
          <Header language={currentLanguage} />
        </div>
        
        {/* Row 2: Navigation Buttons - Centered */}
        <div className="w-full flex justify-center items-center gap-6">
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {visibleButtons.map((btn) => (
              <button 
                key={btn.id}
                onClick={btn.action}
                className={`px-5 py-2.5 md:px-8 md:py-3.5 rounded-2xl bg-gradient-to-r ${btn.gradient} hover:brightness-110 text-white text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {needsApiKey && (
        <div className="w-full max-w-2xl mb-12 animate-fade-in">
          <div className="glass p-8 rounded-[2rem] border border-amber-500/20 bg-amber-500/5 text-center space-y-4">
            <h3 className="text-xl font-bold text-amber-300 uppercase tracking-widest">Connect Celestial Source</h3>
            <p className="text-white/60 text-sm leading-relaxed font-light">
              To consult the Cosmic Oracle, you must connect a valid Gemini API key from a paid GCP project.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button 
                onClick={handleConnectKey}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:brightness-110 text-white font-bold uppercase tracking-widest text-xs transition-all shadow-xl"
              >
                Select API Key
              </button>
              <a 
                href="https://ai.google.dev/gemini-api/docs/billing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-amber-400/60 hover:text-amber-400 text-[10px] uppercase tracking-widest underline underline-offset-4"
              >
                Billing Documentation
              </a>
            </div>
          </div>
        </div>
      )}
      
      {!hasConsented && (
        <ConsentModal 
          onAccept={handleAcceptConsent} 
          language={currentLanguage} 
          onLanguageChange={toggleLanguage}
        />
      )}

      {adOverlayActive && (
        <AdOverlay 
          language={currentLanguage} 
          onComplete={handleAdComplete} 
          onClose={() => setAdOverlayActive(false)} 
        />
      )}

      {/* Main Layout Wrapper: Flex container for Content + Sidebar */}
      <div className="w-full max-w-[1500px] flex flex-col lg:flex-row gap-8 items-start">
        <main className={`flex-grow w-full relative ${showSidebar ? 'max-w-5xl' : ''}`}>
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
            />
          )}

          {view === 'SIGN_DETAIL' && signDetail && (
            <div className="animate-fade-in space-y-8">
              <SignPrediction 
                prediction={signDetail} 
                language={currentLanguage} 
                onBack={handleReset} 
                onGoToForm={() => setView('FORM')}
              />
            </div>
          )}

          {view === 'FORM' && (
            <AstroForm 
              onSubmit={handleFormSubmit} 
              currentLanguage={currentLanguage} 
              disabled={loading || needsApiKey}
            />
          )}

          {view === 'MATCH_FORM' && (
            <MatchForm 
              onSubmit={handleMatchSubmit} 
              currentLanguage={currentLanguage} 
              disabled={loading || needsApiKey}
            />
          )}

          {view === 'MATCH_RESULT' && matchPrediction && matchDetails && (
            <div className="space-y-8 animate-fade-in pb-12">
              <MatchDisplay prediction={matchPrediction} details={matchDetails} language={currentLanguage} />
              <div className="flex justify-center">
                <button onClick={handleReset} className="px-12 py-5 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 hover:brightness-110 text-white font-bold uppercase tracking-[0.3em] transition-all hover:scale-[1.01] active:scale-[0.98] shadow-lg shadow-pink-500/20">
                  {currentLanguage === 'si' ? "නැවත මුල් පිටුවට" : "Return to Home"}
                </button>
              </div>
              <Disclaimer language={currentLanguage} />
            </div>
          )}

          {view === 'RESULT' && prediction && userDetails && (
            <div className="space-y-8 animate-fade-in pb-12">
              <PredictionDisplay prediction={prediction} userName={userDetails.name} language={currentLanguage} />
              <ChatInterface userDetails={userDetails} prediction={prediction} currentLanguage={currentLanguage} />
              <div className="flex justify-center">
                <button onClick={handleReset} className="px-12 py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:brightness-110 text-white font-bold uppercase tracking-[0.3em] transition-all hover:scale-[1.01] active:scale-[0.98] shadow-lg shadow-blue-500/20">
                  {currentLanguage === 'si' ? "නැවත මුල් පිටුවට" : "Return to Home"}
                </button>
              </div>
              <Disclaimer language={currentLanguage} />
            </div>
          )}

        </main>

        {/* Sidebar for Advertisements (Desktop sticky, Mobile bottom) - Only shown on result pages in English */}
        {showSidebar && (
          <aside className="w-full lg:w-96 shrink-0 lg:sticky lg:top-8 space-y-6 animate-fade-in">
            <div className="glass rounded-[2rem] border border-white/10 p-6 min-h-[400px] lg:min-h-[600px] flex flex-col items-center justify-start text-white uppercase tracking-[0.4em] font-bold text-xs">
              <div className="mb-6 opacity-60 text-center w-full">
                Celestial Sponsorship
              </div>
              {/* Target container for the ad network script in index.html */}
              <div id="container-184feb0cd95bdf3d09c7ab46b417e225" className="w-full"></div>
            </div>
          </aside>
        )}
      </div>

      <footer className="mt-auto py-8 text-white/30 text-xs uppercase tracking-[0.4em] text-center w-full border-t border-white/5">
        &copy; {new Date().getFullYear()} Cosmic Oracle • Handcrafted Wisdom
      </footer>
    </div>
  );
};

export default App;
