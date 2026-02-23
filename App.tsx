import React, { useState, useEffect } from 'react';
import { UserDetails, PredictionData, Language, AppView, SignCategoryPrediction, MatchDetails, MatchPrediction } from './types.ts';
import { getAstrologyPrediction, getAllSignPredictions, getHoroscopeMatch } from './services/geminiService.ts';
import AstroForm from './src/components/AstroForm.tsx';
import MatchForm from './src/components/MatchForm.tsx';
import PredictionDisplay from './src/components/PredictionDisplay.tsx';
import MatchDisplay from './src/components/MatchDisplay.tsx';
import ChatInterface from './src/components/ChatInterface.tsx';
import Header from './src/components/Header.tsx';
import Loader from './src/components/Loader.tsx';
import ConsentModal from './src/components/ConsentModal.tsx';
import ZodiacHome from './src/components/ZodiacHome.tsx';
import SignPrediction from './src/components/SignPrediction.tsx';
import Disclaimer from './src/components/Disclaimer.tsx';
import AdOverlay from './src/components/AdOverlay.tsx';
import DailyDestiny from './src/components/DailyDestiny.tsx';
import Sidebar from './src/components/Sidebar.tsx';
import HowTo from './src/components/HowTo.tsx';
import About from './src/components/About.tsx';
import PrivacyPolicy from './src/components/PrivacyPolicy.tsx';
import TermsOfService from './src/components/TermsOfService.tsx';
import Footer from './src/components/Footer.tsx';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  // Default to DAILY view as requested

  const navigate = useNavigate();
  const location = useLocation();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [matchDetails, setMatchDetails] = useState<MatchDetails | null>(null);
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [matchPrediction, setMatchPrediction] = useState<MatchPrediction | null>(null);
  const [signDetail, setSignDetail] = useState<SignCategoryPrediction | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [signCache, setSignCache] = useState<Partial<Record<Language, Record<string, SignCategoryPrediction>>>>({});
  
  const [needsApiKey, setNeedsApiKey] = useState(false);
  
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  
  // Overlay State
  const [adOverlayActive, setAdOverlayActive] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => Promise<void>) | null>(null);

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
          // If bridge is not available and no env key, we can't do much but we'll show the state
          setNeedsApiKey(true);
        }
      }
    };
    checkKeyStatus();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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
      navigate('/result');
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
      navigate('/match-result');
    } catch (err: any) {
      console.error(err);
      setError(currentLanguage === 'si' ? "ගැළපීම් සිදු කිරීමට නොහැකි විය." : "Failed to perform matching ritual.");
    } finally {
      setLoading(false);
    }
  };

  const executeSignSelect = async (signId: string) => {
    // Check local memory cache first, then service (which checks Firestore)
    const currentLangCache = signCache[currentLanguage];
    if (currentLangCache && currentLangCache[signId]) {
      setSignDetail(currentLangCache[signId]);
      navigate('/sign-detail');
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
        navigate('/sign-detail');
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
    setUserDetails(null);
    setPrediction(null);
    setSignDetail(null);
    setMatchPrediction(null);
    setMatchDetails(null);
    setError(null);
    navigate('/');
  };

  const toggleLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
  };

  const handleAcceptConsent = () => {
    setHasConsented(true);
    localStorage.setItem('cosmic_oracle_consent', 'true');
  };

  const isLegalPage = ['/about', '/privacy', '/terms', '/how-to'].includes(location.pathname);

  // Show ads/sidebar on ALL views as requested (including HOME, FORMS, etc.)
  const showSidebar = true;

  const allNavButtons = [

    { 
      id: 'daily', 
      label: currentLanguage === 'si' ? 'අද දවසේ දෛවය' : 'Today\'s Destiny', 
      action: () => { navigate('/'); }, 
      gradient: 'from-amber-600 to-orange-600', 
      active: location.pathname === '/' 
    },
    { 
      id: 'zodiac', 
      label: currentLanguage === 'si' ? 'ලග්න පලාපල (වාර්ෂික)' : 'Zodiac (Yearly)', 
      action: () => { navigate('/zodiac-home'); }, 
      gradient: 'from-purple-600 to-indigo-600', 
      active: location.pathname === '/zodiac-home' || location.pathname === '/sign-detail' 
    },
    { 
      id: 'personalized', 
      label: currentLanguage === 'si' ? 'කේන්ද්‍ර පලාපල' : 'Birth Chart', 
      action: () => { navigate('/form'); }, 
      gradient: 'from-blue-600 to-cyan-600', 
      active: location.pathname === '/form' || location.pathname === '/result' 
    },
    { 
      id: 'match', 
      label: currentLanguage === 'si' ? 'පොරොන්දම් බැලීම' : 'Match', 
      action: () => { navigate('/match-form'); }, 
      gradient: 'from-pink-600 to-rose-600', 
      active: location.pathname === '/match-form' || location.pathname === '/match-result' 
    },
    { 
      id: 'how-to', 
      label: currentLanguage === 'si' ? 'භාවිතා කරන ආකාරය' : 'How To', 
      action: () => { navigate('/how-to'); }, 
      gradient: 'from-green-600 to-teal-600', 
      active: location.pathname === '/how-to' 
    },
    { 
      id: 'about', 
      label: currentLanguage === 'si' ? 'අප ගැන' : 'About Us', 
      action: () => { navigate('/about'); }, 
      gradient: 'from-purple-600 to-indigo-600', 
      active: location.pathname === '/about' 
    },
    { 
      id: 'privacy', 
      label: currentLanguage === 'si' ? 'පුද්ගලිකත්ව ප්‍රතිපත්තිය' : 'Privacy Policy', 
      action: () => { navigate('/privacy'); }, 
      gradient: 'from-pink-600 to-rose-600', 
      active: location.pathname === '/privacy' 
    },
    { 
      id: 'terms', 
      label: currentLanguage === 'si' ? 'සේවා කොන්දේසි' : 'Terms of Service', 
      action: () => { navigate('/terms'); }, 
      gradient: 'from-red-600 to-orange-600', 
      active: location.pathname === '/terms' 
    }
  ];

  const getFilteredNavButtons = () => {
    const appNavButtons = allNavButtons.filter(btn => 
      !['about', 'privacy', 'terms', 'how-to'].includes(btn.id)
    );

    if (isLegalPage) {
      return [
        {
          id: 'home',
          label: currentLanguage === 'si' ? 'මුල් පිටුව' : 'Home',
          action: () => { navigate('/'); },
          gradient: 'from-blue-600 to-cyan-600',
          active: location.pathname === '/'
        }
      ];
    } else {
      // For app pages, show 3 buttons for other apps, excluding the current one
      const currentAppPath = appNavButtons.find(btn => btn.active)?.id;
      const otherAppButtons = appNavButtons.filter(btn => btn.id !== currentAppPath);
      return otherAppButtons.slice(0, 3);
    }
  };

  const visibleButtons = getFilteredNavButtons();

  return (
    <div className="min-h-screen flex flex-col items-center p-6 md:p-8 overflow-x-hidden text-white relative">
      {/* Language Toggle - Absolute Top Left */}
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={() => toggleLanguage(currentLanguage === 'en' ? 'si' : 'en')}
          className="glass px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors border border-white/20"
        >
          {currentLanguage === 'en' ? 'සිංහල' : 'English'}
        </button>
      </div>

      {/* Header Container: Centered Header and Navigation Row */}
      <div className="w-full max-w-[1500px] flex flex-col mb-12 gap-8 mt-6">
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
        <main className={`flex-grow w-full relative ${isLegalPage ? 'max-w-4xl mx-auto' : (showSidebar ? 'max-w-5xl' : '')}`}>
          {loading && <div className="fixed inset-0 z-[100] bg-[#0a0a1a]/80 backdrop-blur-lg flex items-center justify-center"><Loader language={currentLanguage} /></div>}

          {error && (
            <div className="mb-8 p-6 glass rounded-2xl text-red-400 text-center border border-red-500/20 bg-red-500/5 shadow-xl animate-fade-in">
               <p className="font-bold uppercase tracking-widest mb-2">Celestial Obstacle</p>
               <p className="text-sm opacity-80">{error}</p>
               <button onClick={() => setError(null)} className="mt-4 text-xs underline uppercase tracking-widest text-white/50">Dismiss</button>
            </div>
          )}

          <Routes>
            <Route path="/" element={<DailyDestiny language={currentLanguage} />} />
            <Route path="/how-to" element={<HowTo language={currentLanguage} />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            {/* Add other routes as needed, e.g., for forms and results */}
            <Route path="/form" element={<AstroForm onSubmit={handleFormSubmit} currentLanguage={currentLanguage} disabled={loading || needsApiKey} />} />
            <Route path="/match-form" element={<MatchForm onSubmit={handleMatchSubmit} currentLanguage={currentLanguage} disabled={loading || needsApiKey} />} />
            <Route path="/result" element={prediction && userDetails && (
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
            )} />
            <Route path="/match-result" element={matchPrediction && matchDetails && (
              <div className="space-y-8 animate-fade-in pb-12">
                <MatchDisplay prediction={matchPrediction} details={matchDetails} language={currentLanguage} />
                <div className="flex justify-center">
                  <button onClick={handleReset} className="px-12 py-5 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 hover:brightness-110 text-white font-bold uppercase tracking-[0.3em] transition-all hover:scale-[1.01] active:scale-[0.98] shadow-lg shadow-pink-500/20">
                    {currentLanguage === 'si' ? "නැවත මුල් පිටුවට" : "Return to Home"}
                  </button>
                </div>
                <Disclaimer language={currentLanguage} />
              </div>
            )} />
            <Route path="/zodiac-home" element={<ZodiacHome language={currentLanguage} onSignSelect={handleSignSelect} />} />
            <Route path="/sign-detail" element={signDetail && (
              <div className="animate-fade-in space-y-8">
                <SignPrediction prediction={signDetail} language={currentLanguage} onBack={() => navigate('/zodiac-home')} onGoToForm={() => navigate('/form')} />
              </div>
            )} />
          </Routes>

        </main>

        {/* Sidebar for Advertisements (Desktop sticky, Mobile bottom) - Shown on all pages */}
        {showSidebar && (
          <aside className="w-full lg:w-96 shrink-0 lg:sticky lg:top-8 space-y-6 animate-fade-in">
            <div className="glass rounded-[2rem] border border-white/10 p-6 min-h-[400px] lg:min-h-[600px] flex flex-col items-center justify-start text-white uppercase tracking-[0.4em] font-bold text-xs">
              <div className="mb-6 opacity-60 text-center w-full">
                {currentLanguage === 'si' ? 'විශ්වීය අනුග්‍රහය' : 'Celestial Sponsorship'}
              </div>
              {/* Universal Sidebar - Persists across navigation */}
              <Sidebar />
            </div>
          </aside>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default App;
