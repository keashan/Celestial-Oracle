
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
    title: "සම්මුති එකඟතාවය",
    intro: "තවදුරටත් ඉදිරියට යාමට පෙර කරුණාකර පහත කරුණු කියවා එකඟ වන්න:",
    item1: "ඔබේ උපන් විස්තර අනාවැකි ජනනය කිරීම සඳහා Google Gemini AI මගින් process කරනු ලැබේ.",
    item2: "මෙම සේවාව විනෝදාස්වාදය සහ තොරතුරු දැනගැනීම සඳහා පමණි.",
    item3: "අපි ඔබේ පෞද්ගලික දත්ත මෙම සැසියෙන් ඔබ්බට අපගේ server වල ගබඩා කරනු නොලැබේ.",
    btn: "Oracle වෙත පිවිසෙන්න"
  }
};

const ConsentModal: React.FC<ConsentModalProps> = ({ onAccept, language, onLanguageChange }) => {
  const t = translations[language];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0a1a]/90 backdrop-blur-xl animate-fade-in">
      <div className="glass max-w-md w-full p-8 md:p-10 rounded-[2.5rem] border border-white/10 shadow-[0_0_50px_rgba(139,92,246,0.15)] space-y-8">
        
        <div className="flex justify-center">
          <div className="bg-white/5 p-1.5 rounded-2xl border border-white/5 flex shadow-inner">
            <button 
              type="button"
              onClick={() => onLanguageChange('en')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${language === 'en' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' : 'text-white/30 hover:text-white/60'}`}
            >
              English
            </button>
            <button 
              type="button"
              onClick={() => onLanguageChange('si')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${language === 'si' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' : 'text-white/30 hover:text-white/60'}`}
            >
              සිංහල
            </button>
          </div>
        </div>

        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full animate-pulse"></div>
            <div className="relative p-4 rounded-full bg-white/5 border border-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-widest uppercase">{t.title}</h2>
          <p className="text-white/40 text-sm italic max-w-[280px] mx-auto leading-relaxed">{t.intro}</p>
        </div>

        <div className="space-y-5 bg-white/5 p-6 rounded-2xl border border-white/5">
          <div className="flex items-start space-x-4">
            <div className="mt-1.5 shrink-0">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.6)]"></div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed font-medium">{t.item1}</p>
          </div>
          <div className="flex items-start space-x-4">
            <div className="mt-1.5 shrink-0">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.6)]"></div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed font-medium">{t.item2}</p>
          </div>
          <div className="flex items-start space-x-4">
            <div className="mt-1.5 shrink-0">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.6)]"></div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed font-medium">{t.item3}</p>
          </div>
        </div>

        <button
          onClick={onAccept}
          className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 p-[1px] transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="relative rounded-2xl bg-[#1a1a2e]/40 py-4 transition-all group-hover:bg-transparent">
            <span className="text-white font-bold tracking-widest uppercase text-sm">{t.btn}</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ConsentModal;
