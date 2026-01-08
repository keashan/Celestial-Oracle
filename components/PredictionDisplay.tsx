
import React from 'react';
import { PredictionData, Language, ZODIAC_SIGNS } from '../types.ts';

interface PredictionDisplayProps {
  prediction: PredictionData;
  userName: string;
  language: Language;
}

const PredictionDisplay: React.FC<PredictionDisplayProps> = ({ prediction, userName, language }) => {
  const intro = language === 'si' 
    ? "ඔබ වෙනුවෙන් සැකසූ ගැඹුරු විශ්වීය විශ්ලේෂණය මෙන්න."
    : "Your personalized deep-dive celestial analysis has been manifested.";

  const analysisHeader = language === 'si' ? "ඔබේ දෛවයේ ගැඹුරු විශ්ලේෂණය" : "Your Deep-Dive Analysis";
  const monthlyHeader = language === 'si' ? "මාසික මඟපෙන්වීම" : "Monthly Cosmic Guidance";

  const signInfo = ZODIAC_SIGNS.find(s => s.symbol === prediction.symbol);
  const signNameDisplay = signInfo 
    ? `${signInfo.si} (${signInfo.en})`
    : prediction.zodiacSign;

  return (
    <div className="space-y-8">
      {/* Hero Section with Image focus */}
      <div className="glass p-8 md:p-12 rounded-[3.5rem] relative overflow-hidden border border-white/10 shadow-2xl flex flex-col md:flex-row items-center gap-10">
        {/* Background Image Watermark */}
        {prediction.imageUrl && (
          <div className="absolute inset-0 opacity-[0.15] pointer-events-none select-none blur-2xl">
            <img src={prediction.imageUrl} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        
        {/* Main Generated Artwork */}
        <div className="relative shrink-0 z-10">
          <div className="absolute inset-0 bg-purple-500/30 blur-[40px] rounded-full animate-pulse"></div>
          <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-[3rem] overflow-hidden border-2 border-white/20 shadow-[0_0_50px_rgba(168,85,247,0.4)] transform hover:scale-[1.02] transition-transform duration-700">
            {prediction.imageUrl ? (
              <img src={prediction.imageUrl} alt={prediction.zodiacSign} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-900 to-black flex items-center justify-center text-7xl">
                {prediction.symbol}
              </div>
            )}
          </div>
        </div>
        
        <div className="relative z-10 text-center md:text-left space-y-4 flex-grow">
          <div className="space-y-1">
            <div className="text-white/40 uppercase tracking-[0.4em] text-[10px] md:text-xs font-bold">{intro}</div>
            <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter leading-none italic font-serif">
              {userName}
            </h2>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <div className="glass px-6 py-3 rounded-2xl border border-purple-500/20 shadow-xl flex items-center">
              <span className="text-purple-400 font-bold text-xl md:text-2xl font-serif">
                {signNameDisplay}
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-2 text-white/20">
              <div className="h-[1px] w-12 bg-white/10"></div>
              <span className="text-[10px] uppercase tracking-[0.3em]">Celestial Identity</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Analysis Section */}
      <div className="glass p-10 md:p-16 rounded-[4rem] border border-purple-500/10 bg-purple-500/5 shadow-[0_0_80px_rgba(168,85,247,0.1)] relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-xs font-bold uppercase tracking-[0.4em] shadow-2xl">
          {analysisHeader}
        </div>
        
        <div className="relative z-10">
          <div className="prose prose-invert max-w-none">
            <p className="text-white/90 text-lg md:text-xl leading-[1.8] font-light whitespace-pre-line text-justify md:text-left selection:bg-purple-500/30">
              {prediction.prediction}
            </p>
          </div>
        </div>
        
        <div className="absolute bottom-6 right-12 opacity-10 text-6xl select-none">✨</div>
      </div>

      {/* Monthly Breakdown Section */}
      <div className="space-y-8">
        <div className="text-center space-y-3">
          <h3 className="text-2xl font-bold uppercase tracking-[0.5em] text-white/40">{monthlyHeader}</h3>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prediction.monthlyBreakdown.map((item, index) => (
            <div key={index} className="glass p-8 md:p-10 rounded-[3rem] hover:bg-white/10 transition-all border border-white/5 hover:border-purple-500/30 hover:scale-[1.03] duration-500 group shadow-2xl flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-[0.02] text-7xl font-black pointer-events-none">{index + 1}</div>
              <div className="flex items-center justify-between mb-6 relative z-10">
                <h3 className="text-purple-400 font-bold text-sm group-hover:text-purple-300 transition-colors uppercase tracking-[0.4em]">{item.month}</h3>
                <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-[10px] font-bold text-white/30 border border-white/5 shadow-inner">0{index + 1}</div>
              </div>
              <p className="text-white/80 text-sm md:text-base leading-relaxed font-light flex-grow relative z-10">{item.highlight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PredictionDisplay;
