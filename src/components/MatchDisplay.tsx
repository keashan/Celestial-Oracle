
import React from 'react';
import { MatchPrediction, MatchDetails, Language } from '../../types.ts';

interface MatchDisplayProps {
  prediction: MatchPrediction;
  details: MatchDetails;
  language: Language;
}

const MatchDisplay: React.FC<MatchDisplayProps> = ({ prediction, details, language }) => {
  const categories = [
    { key: 'emotional', icon: '🌙', title: language === 'si' ? 'මානසික ගැළපීම' : 'Emotional Bond', color: 'text-blue-400' },
    { key: 'physical', icon: '🔥', title: language === 'si' ? 'කායික ගැළපීම' : 'Physical Bond', color: 'text-pink-400' },
    { key: 'intellectual', icon: '💎', title: language === 'si' ? 'බුද්ධිමය ගැළපීම' : 'Intellectual Bond', color: 'text-amber-400' },
    { key: 'spiritual', icon: '🌌', title: language === 'si' ? 'ආත්මීය ගැළපීම' : 'Spiritual Bond', color: 'text-purple-400' },
  ];

  const getScoreColor = (score: number) => {
    if (score > 80) return 'text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.3)]';
    if (score > 50) return 'text-blue-400';
    return 'text-rose-400';
  };

  return (
    <div className="space-y-12">
      <div className="glass p-10 md:p-16 rounded-[3rem] border border-white/10 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 space-y-6">
          <div className="flex justify-center items-center space-x-6 text-2xl font-bold uppercase tracking-widest text-white/60">
            <span>{details.person1.name}</span>
            <span className="text-pink-500 text-4xl">∞</span>
            <span>{details.person2.name}</span>
          </div>

          <div className="py-8">
            <div className={`text-8xl md:text-9xl font-bold mb-2 transition-all duration-1000 ${getScoreColor(prediction.score)}`}>
              {prediction.score}%
            </div>
            <div className="text-sm uppercase tracking-[0.5em] text-white/40">{language === 'si' ? 'ගැළපීම් ප්‍රතිශතය' : 'Celestial Harmony Score'}</div>
          </div>

          <p className="text-lg md:text-2xl font-light italic leading-relaxed text-white/90 max-w-3xl mx-auto">
            "{prediction.summary}"
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((cat) => (
          <div key={cat.key} className="glass p-10 rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-all shadow-xl group">
            <div className="flex items-center space-x-5 mb-6">
              <span className="text-4xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{cat.icon}</span>
              <h3 className={`text-xl font-bold tracking-wide ${cat.color} uppercase`}>{cat.title}</h3>
            </div>
            <p className="text-white/80 leading-relaxed font-light text-[15px]">
              {prediction.categories[cat.key as keyof typeof prediction.categories]}
            </p>
          </div>
        ))}
      </div>

      <div className="glass p-12 rounded-[3rem] border border-pink-500/10 bg-pink-500/5 shadow-2xl relative">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <svg className="w-24 h-24 text-pink-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18l-6-6h12l-6 6z"/></svg>
        </div>
        <h3 className="text-2xl font-bold text-pink-300 mb-6 uppercase tracking-widest">{language === 'si' ? 'විශ්වීය ආශිර්වාදය' : 'Celestial Blessing'}</h3>
        <p className="text-xl text-white/90 font-light leading-relaxed">
          {prediction.conclusion}
        </p>
      </div>
    </div>
  );
};

export default MatchDisplay;
