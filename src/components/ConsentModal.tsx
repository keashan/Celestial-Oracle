
import React from 'react';
import { Language } from '../../types.ts';

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
    item2: "This service is for informational purposes only.",
    item3: "We do not store your personal data on our servers beyond this session.",
    btn: "Enter the Oracle"
  },
  si: {
    title: "දිව්‍යමය එකඟතාවය",
    intro: "තරු විමසීමට පෙර කරුණාකර පහත කරුණු කියවා එකඟ වන්න:",
    item1: "ඔබේ විස්තර අනාවැකි ජනනය කිරීම සඳහා Google Gemini AI වෙත යවනු ලැබේ.",
    item2: "මෙම සේවාව තොරතුරු දැනගැනීම සඳහා පමණි.",
    item3: "අපි ඔබේ පෞද්ගලික දත්ත මෙම සැසියෙන් ඔබබට අපගේ server වල ගබඩා කරනු නොලැබේ.",
    btn: "විශ්වීය දෛවඥයා වෙත පිවිසෙන්න"
  }
};

const ConsentModal: React.FC<ConsentModalProps> = ({ onAccept, language, onLanguageChange }) => {
  const t = translations[language];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0a0a1a]/95 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div className="glass max-w-2xl w-full p-8 md:p-10 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-8 my-auto relative overflow-hidden">
        
        <div className="text-center space-y-3">
          <h2 className="text-[length:var(--fs-heading-main)] font-bold text-white tracking-widest uppercase">{t.title}</h2>
          
          <p className="text-white/50 text-[length:var(--fs-body)] italic max-w-lg mx-auto leading-relaxed mt-4">{t.intro}</p>
        </div>

        <div className="space-y-6 bg-white/5 p-8 rounded-2xl border border-white/5">
          {[t.item1, t.item2, t.item3].map((item, i) => (
            <div key={i} className="flex items-start space-x-4">
              <div className="mt-2 shrink-0">
                <div className="w-2.5 h-2.5 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.6)]"></div>
              </div>
              <p className="text-[length:var(--fs-modal-item)] text-white/90 leading-relaxed">{item}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onAccept}
          className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 p-[1px] transition-all hover:scale-[1.01] active:scale-[0.98]"
        >
          <div className="relative rounded-2xl bg-[#1a1a2e]/60 py-4 transition-all group-hover:bg-transparent">
            <span className="text-white font-bold tracking-[0.3em] uppercase text-[length:var(--fs-btn-text)]">{t.btn}</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ConsentModal;
