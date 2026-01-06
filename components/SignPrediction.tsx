
import React from 'react';
import { SignCategoryPrediction, Language } from '../types.ts';
import Disclaimer from './Disclaimer.tsx';

interface SignPredictionProps {
  prediction: SignCategoryPrediction;
  language: Language;
  onBack: () => void;
}

const SignPrediction: React.FC<SignPredictionProps> = ({ prediction, language, onBack }) => {
  const categoryMeta = [
    { key: 'general', icon: '✨', title: language === 'en' ? 'General Path' : 'විශ්වීය මාවත', color: 'from-blue-500/20 to-purple-500/20' },
    { key: 'love', icon: '❤️', title: language === 'en' ? 'Love & Romance' : 'ආදරය සහ ප්‍රේමය', color: 'from-pink-500/20 to-rose-500/20' },
    { key: 'money', icon: '💰', title: language === 'en' ? 'Wealth & Money' : 'ධනය සහ මුදල්', color: 'from-emerald-500/20 to-teal-500/20' },
    { key: 'career', icon: '💼', title: language === 'en' ? 'Career & Job' : 'වෘත්තිය සහ රැකියාව', color: 'from-indigo-500/20 to-blue-500/20' },
    { key: 'education', icon: '🎓', title: language === 'en' ? 'Education' : 'අධ්‍යාපනය', color: 'from-amber-500/20 to-orange-500/20' },
    { key: 'health', icon: '🧘', title: language === 'en' ? 'Health' : 'සෞඛ්‍යය', color: 'from-cyan-500/20 to-sky-500/20' },
  ];

  return (
    <div className="space-y-12 pb-20">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-white/50 hover:text-white transition-colors group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-xs uppercase tracking-[0.3em] font-bold">{language === 'en' ? 'Back' : 'ආපසු'}</span>
        </button>

        <div className="text-right">
          <div className="text-4xl md:text-6xl font-bold flex items-center justify-end space-x-4">
            <span>{prediction.sign}</span>
            <span className="opacity-50">{prediction.symbol}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categoryMeta.map((cat) => (
          <div 
            key={cat.key} 
            className={`glass p-10 rounded-[2.5rem] border border-white/10 hover:border-white/20 transition-all relative overflow-hidden shadow-2xl group`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold tracking-wide text-white/90">{cat.title}</h3>
                <span className="text-3xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{cat.icon}</span>
              </div>
              <p className="text-[length:var(--fs-body)] leading-relaxed text-white/80 font-light">
                {prediction.categories[cat.key as keyof typeof prediction.categories]}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Disclaimer language={language} />

      <div className="flex justify-center pt-8">
        <button 
          onClick={onBack} 
          className="px-12 py-5 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold transition-all transform hover:scale-[1.01] active:scale-[0.98] shadow-[0_15px_40px_rgba(124,58,237,0.3)] tracking-[0.3em] uppercase text-[length:var(--fs-btn-text)]"
        >
          {language === 'si' ? "ලග්න ලැයිස්තුවට" : "Return to Signs"}
        </button>
      </div>
    </div>
  );
};

export default SignPrediction;
