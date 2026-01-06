
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
  
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    return (localStorage.getItem('cosmic_oracle_lang') as Language) || 'en';
  });

  const [hasConsented, setHasConsented] = useState<boolean>(() => {
    return localStorage.getItem('cosmic_oracle_consent') === 'true';
  });

  const handleFormSubmit = async (details: UserDetails) => {
    // Check if API key is missing before trying to avoid generic failure
    if (!process.env.API_KEY) {
      setError(currentLanguage === 'si' 
        ? "Netlify හි API_KEY එක වින්‍යාස කර නොමැත. කරුණාකර Site Settings පරීක්ෂා කරන්න." 
        : "API_KEY is not configured in Netlify settings. Please check your environment variables.");
      return;
    }

    setLoading(true);
    setError(null);
    const detailsWithCurrentLang = { ...details, language: currentLanguage };
    
    try {
      const data = await getAstrologyPrediction(detailsWithCurrentLang);
      setUserDetails(detailsWithCurrentLang);
      setPrediction(data);
    } catch (err) {
      console.error("Prediction Fetch Error:", err);
      setError(currentLanguage === 'si' 
        ? "විශ්වීය දත්ත ලබා ගැනීමට නොහැකි විය. කරුණාකර ඔබගේ අන්තර්ජාල සබඳතාවය පරීක්ෂා කර නැවත උත්සාහ කරන්න." 
        : "The celestial signals are weak. Please check your connection or API configuration and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUserDetails(null);
    setPrediction(null);
    setError(null);
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
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8 overflow-x-hidden text-white">
      <Header />
      
      {!hasConsented && (
        <ConsentModal 
          onAccept={handleAcceptConsent} 
          language={currentLanguage} 
          onLanguageChange={toggleLanguage}
        />
      )}

      <main className="w-full max-w-4xl flex-grow mt-8 relative">
        {/* Loader Overlay: Keeps form mounted in background */}
        {loading && (
          <div className="absolute inset-0 z-20 bg-[#0a0a1a]/60 backdrop-blur-sm rounded-[2.5rem]">
            <Loader language={currentLanguage} />
          </div>
        )}

        {/* Form Area: Using hidden/block to preserve state */}
        <div className={prediction ? 'hidden' : 'block animate-fade-in'}>
          <AstroForm 
            onSubmit={handleFormSubmit} 
            currentLanguage={currentLanguage} 
            onLanguageChange={toggleLanguage}
            disabled={loading}
          />
          {error && (
            <div className="mt-8 p-6 glass rounded-2xl text-red-400 text-center border border-red-500/30 bg-red-500/5 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
              <div className="flex items-center justify-center space-x-2 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-bold uppercase tracking-widest text-xs">Error</span>
              </div>
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Results Area */}
        {prediction && (
          <div className="space-y-8 animate-fade-in pb-20">
            <PredictionDisplay 
              prediction={prediction} 
              userName={userDetails?.name || 'Traveler'} 
              language={currentLanguage}
            />
            <ChatInterface 
              userDetails={userDetails!} 
              prediction={prediction} 
              onLanguageChange={toggleLanguage}
              currentLanguage={currentLanguage}
            />
            <div className="flex justify-center">
              <button 
                onClick={handleReset}
                className="px-10 py-4 rounded-full glass border border-white/20 text-white/60 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all text-xs font-bold tracking-[0.2em] uppercase"
              >
                {currentLanguage === 'si' ? "නැවත තරු විමසන්න" : "Return to the Stars"}
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-auto py-8 text-white/30 text-[10px] uppercase tracking-widest text-center w-full border-t border-white/5">
        &copy; {new Date().getFullYear()} Cosmic Oracle • Powered by Gemini 3 AI
      </footer>
    </div>
  );
};

export default App;
