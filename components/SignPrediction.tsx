
import React from 'react';
import { SignCategoryPrediction, Language, ZODIAC_SIGNS } from '../types.ts';
import Disclaimer from './Disclaimer.tsx';

interface SignPredictionProps {
  prediction: SignCategoryPrediction;
  language: Language;
  onBack: () => void;
  onGoToForm: () => void;
}

const SignPrediction: React.FC<SignPredictionProps> = ({ prediction, language, onBack, onGoToForm }) => {
  const categoryMeta = [
    { key: 'general', icon: '✨', title: language === 'en' ? 'General Path' : 'විශ්වීය මාවත', color: 'from-blue-600/30 to-purple-600/30', isHero: true },
    { key: 'love', icon: '❤️', title: language === 'en' ? 'Love & Romance' : 'ආදරය සහ ප්‍රේමය', color: 'from-pink-500/20 to-rose-500/20', isHero: false },
    { key: 'money', icon: '💰', title: language === 'en' ? 'Wealth & Money' : 'ධනය සහ මුදල්', color: 'from-emerald-500/20 to-teal-500/20', isHero: false },
    { key: 'career', icon: '💼', title: language === 'en' ? 'Career & Job' : 'වෘත්තිය සහ රැකියාව', color: 'from-indigo-500/20 to-blue-500/20', isHero: false },
    { key: 'education', icon: '🎓', title: language === 'en' ? 'Education' : 'අධ්‍යාපනය', color: 'from-amber-500/20 to-orange-500/20', isHero: false },
    { key: 'health', icon: '🧘', title: language === 'en' ? 'Health' : 'සෞඛ්‍යය', color: 'from-cyan-500/20 to-sky-500/20', isHero: false },
  ];

  const t = language === 'si' ? {
    predictionHeader: "ඉදිරි මාස 12 සඳහා අනාවැකි",
    ctaTitle: "වැඩිදුර විස්තර සඳහා?",
    ctaDesc: "ඔබේ උපන් වේලාව සහ ස්ථානය අනුව සැකසූ පෞද්ගලික කේන්ද්‍ර පලාපල මෙතැනින් ලබාගන්න.",
    ctaBtn: "කේන්ද්‍ර පලාපල ලබාගන්න",
    backBtn: "ලග්න ලැයිස්තුවට"
  } : {
    predictionHeader: "Prediction for Next 12 Months",
    ctaTitle: "Seeking more depth?",
    ctaDesc: "Get a highly personalized 12-month analysis based on your exact birth time and location.",
    ctaBtn: "Get My Birth Chart",
    backBtn: "Return to Signs"
  };

  const signInfo = ZODIAC_SIGNS.find(s => 
    prediction.sign.toLowerCase().includes(s.en.toLowerCase()) || 
    prediction.sign.toLowerCase().includes(s.id)
  );

  const signNameDisplay = signInfo 
    ? `${signInfo.en} (${signInfo.si})` 
    : prediction.sign;
    
  const signSymbol = signInfo ? signInfo.symbol : '✨';

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-white/50 hover:text-white transition-colors group self-start"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-xs uppercase tracking-[0.3em] font-bold">{language === 'en' ? 'Back' : 'ආපසු'}</span>
        </button>

        <div className="text-left md:text-right space-y-2">
          <div className="text-white/40 uppercase tracking-[0.4em] text-[10px] md:text-xs font-bold">
            {t.predictionHeader}
          </div>
          <div className="flex items-center md:justify-end space-x-4">
            <span className="text-3xl md:text-5xl font-bold text-white tracking-tight">{signNameDisplay}</span>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(124,58,237,0.4)] border border-white/20">
              {signSymbol}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
        {categoryMeta.map((cat) => (
          <div 
            key={cat.key} 
            className={`glass rounded-[2rem] border border-white/10 hover:border-white/20 transition-all relative overflow-hidden shadow-2xl group flex flex-col ${cat.isHero ? 'md:col-span-2 p-8 md:p-10' : 'p-6'}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} ${cat.isHero ? 'opacity-30' : 'opacity-20'} group-hover:opacity-40 transition-opacity`}></div>
            
            <div className="relative z-10 space-y-3 md:space-y-4">
              <div className="flex items-center justify-between">
                <h3 className={`${cat.isHero ? 'text-xl md:text-2xl' : 'text-base md:text-lg'} font-bold tracking-wide text-white/90`}>{cat.title}</h3>
                <span className={`${cat.isHero ? 'text-4xl' : 'text-2xl'} filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]`}>{cat.icon}</span>
              </div>
              <p className={`${cat.isHero ? 'text-base md:text-lg' : 'text-xs md:text-sm'} leading-relaxed text-white/80 font-light whitespace-pre-line`}>
                {prediction.categories[cat.key as keyof typeof prediction.categories]}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="glass p-8 md:p-10 rounded-[2.5rem] border border-blue-500/20 bg-blue-500/5 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none transform group-hover:scale-110 transition-transform duration-700">
           <svg className="w-32 h-32 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd"/></svg>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-2">
            <h3 className="text-xl font-bold text-blue-300 uppercase tracking-widest">{t.ctaTitle}</h3>
            <p className="text-white/70 text-sm font-light max-w-xl">{t.ctaDesc}</p>
          </div>
          <button 
            onClick={onGoToForm}
            className="whitespace-nowrap px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:brightness-110 text-white font-bold uppercase tracking-widest text-[10px] transition-all transform hover:scale-[1.05] active:scale-95 shadow-lg"
          >
            {t.ctaBtn}
          </button>
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <button 
          onClick={onBack} 
          className="px-12 py-5 rounded-2xl bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-600 hover:to-blue-600 text-white border border-white/10 font-bold transition-all transform hover:scale-[1.01] active:scale-[0.98] tracking-[0.3em] uppercase text-[12px] shadow-lg shadow-purple-500/20"
        >
          {t.backBtn}
        </button>
      </div>

      <Disclaimer language={language} />
    </div>
  );
};

export default SignPrediction;
