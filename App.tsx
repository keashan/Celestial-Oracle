
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
    setLoading(true);
    setError(null);
    const detailsWithCurrentLang = { ...details, language: currentLanguage };
    
    try {
      // We rely on the SDK to use process.env.API_KEY. 
      // If it fails, the catch block will provide a helpful message.
      const data = await getAstrologyPrediction(detailsWithCurrentLang);
      setUserDetails(detailsWithCurrentLang);
      setPrediction(data);
    } catch (err) {
      console.error("Prediction Fetch Error:", err);
      setError(currentLanguage === 'si' 
        ? "විශ්වීය දත්ත ලබා ගැනීමට නොහැකි විය. කරුණාකර ඔබගේ Netlify API_KEY එක නිවැරදි දැයි පරීක්ෂා කර නැවත උත්සාහ කරන්න." 
        : "The celestial signals are weak. Please ensure your API_KEY is correctly set in Netlify and try again.");
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
          <div className="absolute inset-0 z-20 bg-[#0a0a1a]/70 backdrop-blur-md rounded-[3rem]">
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
            <div className="mt-10 p-10 glass rounded-[2rem] text-red-400 text-center border border-red-500/30 bg-red-500/5 shadow-[0_0_40px_rgba(239,68,68,0.15)] animate-pulse">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-bold uppercase tracking-[0.4em] text-sm">Celestial Obstacle</span>
              </div>
              <p className="text-xl md:text-2xl font-medium leading-relaxed">{error}</p>
            </div>
          )}
        </div>

        {prediction && (userDetails && (
          <div className="space-y-12 animate-fade-in pb-24">
            <PredictionDisplay 
              prediction={prediction} 
              userName={userDetails.name || 'Traveler'} 
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
                className="px-14 py-6 rounded-full glass border border-white/20 text-white/70 hover:text-white hover:border-white/50 hover:bg-white/10 transition-all text-base font-bold tracking-[0.3em] uppercase shadow-xl"
              >
                {currentLanguage === 'si' ? "නැවත තරු විමසන්න" : "Return to the Stars"}
              </button>
            </div>
          </div>
        ))}
      </main>

      <footer className="mt-auto py-10 text-white/40 text-xs uppercase tracking-[0.4em] text-center w-full border-t border-white/5">
        &copy; {new Date().getFullYear()} Cosmic Oracle • Powered by Gemini 3 AI
      </footer>
    </div>
  );
};

export default App;
