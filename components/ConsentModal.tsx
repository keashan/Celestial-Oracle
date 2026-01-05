
import React from 'react';
import { Language } from '../types';

interface ConsentModalProps {
  onAccept: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const translations = {
  en: {
    title: "Celestial Agreement",
    intro: "Before we consult the stars, please acknowledge the following:",
    item1: "Your birth details are processed by Google Gemini AI to generate predictions.",
    item2: "This service is for entertainment and informational purposes only.",
    item3: "We do not store your personal data on our servers beyond this session.",
    btn: "Enter the Oracle"
  },
  si: {
    title: "Celestial Agreement",
    intro: "තවදුරටත් ඉදිරියට යාමට පෙර කරුණාකර පහත කරුණු කියවා එකඟ වන්න:",
    item1: "ඔබේ උපන් විස්තර අනාවැකි ජනය කිරීම සඳහා Google Gemini AI මගින් process කරනු ලැබේ.",
    item2: "මෙම සේවාව විනෝදාස්වාදය සහ තොරතුරු දැනගැනීම සඳහා පමණි.",
    item3: "අපි ඔබේ පෞද්ගලික දත්ත මෙම සැසියෙන් ඔබ්බට අපගේ server වල ගබඩා කරනු නොලැබේ.",
    btn: "ඇතුල් වන්න"
  }
};

const ConsentModal: React.FC<ConsentModalProps> = ({ onAccept, language, onLanguageChange }) => {
  const t = translations[language];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass max-w-md w-full p-8 rounded-[2.5rem] border border-white/20 shadow-2xl space-y-6">
        
        {/* Language Switcher */}
        <div className="flex justify-center mb-2">
          <div className="bg-white/5 p-1 rounded-xl border border-white/10 flex">
            <button 
              type="button"
              onClick={() => onLanguageChange('en')}
              className={`px-4 py-1 rounded-lg text-xs font-bold transition-all ${language === 'en' ? 'bg-purple-600 text-white shadow-lg' : 'text-white/40 hover:text-white/70'}`}
            >
              English
            </button>
            <button 
              type="button"
              onClick={() => onLanguageChange('si')}
              className={`px-4 py-1 rounded-lg text-xs font-bold transition-all ${language === 'si' ? 'bg-purple-600 text-white shadow-lg' : 'text-white/40 hover:text-white/70'}`}
            >
              සිංහල
            </button>
          </div>
        </div>

        <div className="text-center space-y-2">
          <div className="inline-block p-2 rounded-full bg-purple-500/20 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.040L3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622l-1.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-widest">{t.title}</h2>
          <p className="text-white/60 text-sm italic">{t.intro}</p>
        </div>

        <ul className="space-y-4">
          {[t.item1, t.item2, t.item3].map((item, i) => (
            <li key={i} className="flex items-start space-x-3 text-sm text-white/80">
              <span className="mt-1 text-purple-500">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={onAccept}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {t.btn}
        </button>
      </div>
    </div>
  );
};

export default ConsentModal;
