
import React, { useState } from 'react';
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
  
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    return (localStorage.getItem('cosmic_oracle_lang') as Language) || 'en';
  });

  const [hasConsented, setHasConsented] = useState<boolean>(() => {
    return localStorage.getItem('cosmic_oracle_consent') === 'true';
  });

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
      
      // Capturing what the app sees as the API Key for debugging
      const currentKey = process.env.API_KEY;
      setDebugKey(currentKey === undefined ? "UNDEFINED" : currentKey === "" ? "EMPTY STRING" : `EXISTS (${currentKey.substring(0, 4)}...)`);

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

  return (
    <div className="min-h-screen flex flex-col items-center p-6 md:p-12 overflow-x-hidden text-white">
      <Header />
      
      {!hasConsented && (
        <ConsentModal 
          onAccept={handleAcceptConsent} 
          language={currentLanguage} 
          onLanguageChange={toggleLanguage}
        />
      )}

      <main className="w-full max-w-5xl flex-grow mt-12 relative">
        {loading && (
          <div className="absolute inset-0 z-20 bg-[#0a0a1a]/80 backdrop-blur-lg rounded-[3.5rem]">
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
            <div className="mt-12 p-10 glass rounded-[2.5rem] text-red-400 text-center border border-red-500/30 bg-red-500/5 shadow-[0_0_50px_rgba(239,68,68,0.2)] animate-fade-in">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-bold uppercase tracking-[0.5em] text-lg">Celestial Obstacle</span>
              </div>
              <p className="text-2xl md:text-3xl font-medium leading-relaxed mb-4">{error}</p>
              
              {/* DEBUG INFO */}
              <div className="mt-6 p-4 bg-black/40 rounded-xl border border-white/10 text-xs font-mono tracking-wider opacity-70">
                <p>DEBUG [process.env.API_KEY]: <span className="text-yellow-400 font-bold">{debugKey}</span></p>
                <p className="mt-2 text-[10px] text-white/30 uppercase">If 'UNDEFINED', your build tool or Netlify is not injecting the variable correctly.</p>
              </div>
            </div>
          )}
        </div>

        {prediction && userDetails && (
          <div className="space-y-16 animate-fade-in pb-32">
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
                className="px-16 py-8 rounded-full glass border border-white/20 text-white/80 hover:text-white hover:border-white/50 hover:bg-white/10 transition-all text-xl font-bold tracking-[0.4em] uppercase shadow-2xl active:scale-95"
              >
                {currentLanguage === 'si' ? "නැවත තරු විමසන්න" : "Return to the Stars"}
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-auto py-12 text-white/30 text-sm uppercase tracking-[0.5em] text-center w-full border-t border-white/5">
        &copy; {new Date().getFullYear()} Cosmic Oracle • Handcrafted for the Awakened
      </footer>
    </div>
  );
};

export default App;
