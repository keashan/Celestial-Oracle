
import React, { useState, useEffect } from 'react';
import { UserDetails, PredictionData, Language } from './types';
import { getAstrologyPrediction } from './services/geminiService';
import AstroForm from './components/AstroForm';
import PredictionDisplay from './components/PredictionDisplay';
import ChatInterface from './components/ChatInterface';
import Header from './components/Header';
import Loader from './components/Loader';
import ConsentModal from './components/ConsentModal';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize language from localStorage or default to 'en'
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    return (localStorage.getItem('cosmic_oracle_lang') as Language) || 'en';
  });

  const [hasConsented, setHasConsented] = useState<boolean>(() => {
    return localStorage.getItem('cosmic_oracle_consent') === 'true';
  });

  const handleFormSubmit = async (details: UserDetails) => {
    setLoading(true);
    setError(null);
    // Use the language from global state to ensure consistency
    const detailsWithCurrentLang = { ...details, language: currentLanguage };
    try {
      const data = await getAstrologyPrediction(detailsWithCurrentLang);
      setUserDetails(detailsWithCurrentLang);
      setPrediction(data);
    } catch (err) {
      console.error(err);
      setError(currentLanguage === 'si' ? "තරු පෙනීම අවහිර වී ඇත. කරුණාකර නැවත උත්සාහ කරන්න." : "The stars are currently obscured. Please try again later.");
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
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8 overflow-x-hidden">
      <Header />
      
      {!hasConsented && (
        <ConsentModal 
          onAccept={handleAcceptConsent} 
          language={currentLanguage} 
          onLanguageChange={toggleLanguage}
        />
      )}

      <main className="w-full max-w-4xl flex-grow mt-8">
        {loading ? (
          <Loader language={currentLanguage} />
        ) : !prediction ? (
          <div className="animate-fade-in">
            <AstroForm 
              onSubmit={handleFormSubmit} 
              currentLanguage={currentLanguage} 
              onLanguageChange={toggleLanguage} 
            />
            {error && (
              <div className="mt-4 p-4 glass rounded-xl text-red-400 text-center border-red-500/30">
                {error}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
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
            <div className="flex justify-center pb-8">
              <button 
                onClick={handleReset}
                className="px-6 py-2 rounded-full glass border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-all text-sm"
              >
                {currentLanguage === 'si' ? "නැවත තරු විමසන්න" : "Consult the Stars Again"}
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-auto py-6 text-white/30 text-xs text-center w-full">
        &copy; {new Date().getFullYear()} Cosmic Oracle • Powered by Gemini AI
      </footer>
    </div>
  );
};

export default App;
