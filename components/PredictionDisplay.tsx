
import React from 'react';
import { PredictionData, Language } from '../types.ts';

interface PredictionDisplayProps {
  prediction: PredictionData;
  userName: string;
  language: Language;
}

const PredictionDisplay: React.FC<PredictionDisplayProps> = ({ prediction, userName, language }) => {
  const intro = language === 'si' 
    ? `ආයුබෝවන්, ${userName}. ඔබ වෙනුවෙන් සැකසූ ගැඹුරු විශ්වීය විශ්ලේෂණය මෙන්න.`
    : `Greetings, ${userName}. Your personalized deep-dive celestial analysis has been manifested.`;

  const analysisHeader = language === 'si' ? "ඔබේ දෛවයේ ගැඹුරු විශ්ලේෂණය" : "Your Deep-Dive Analysis";
  const monthlyHeader = language === 'si' ? "මාසික මඟපෙන්වීම" : "Monthly Cosmic Guidance";

  return (
    <div className="space-y-16">
      {/* Sign Header Hero */}
      <div className="glass p-10 md:p-16 rounded-[3rem] relative overflow-hidden border border-white/10 shadow-2xl flex flex-col md:flex-row items-center gap-10">
        <div className="absolute top-0 right-0 p-10 text-[15rem] opacity-[0.03] pointer-events-none select-none">
          {prediction.symbol}
        </div>
        
        <div className="text-8xl md:text-[10rem] drop-shadow-[0_0_30px_rgba(255,255,255,0.4)] animate-pulse shrink-0">
          {prediction.symbol}
        </div>
        
        <div className="relative z-10 text-center md:text-left space-y-4">
          <div className="text-white/40 uppercase tracking-[0.4em] text-xs font-bold">{intro}</div>
          <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-none italic font-serif">
            {prediction.zodiacSign}
          </h2>
        </div>
      </div>

      {/* Main Deep Dive Section */}
      <div className="glass p-10 md:p-20 rounded-[3.5rem] border border-purple-500/10 bg-purple-500/5 shadow-[0_0_60px_rgba(168,85,247,0.1)] relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-xs font-bold uppercase tracking-[0.3em] shadow-xl">
          {analysisHeader}
        </div>
        
        <div className="relative z-10">
          <div className="prose prose-invert max-w-none">
            <p className="text-white/90 text-lg md:text-xl leading-[1.8] font-light whitespace-pre-line text-justify md:text-left">
              {prediction.prediction}
            </p>
          </div>
        </div>
        
        <div className="absolute bottom-4 right-10 opacity-20 text-4xl">✨</div>
      </div>

      {/* Monthly Breakdown Grid */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold uppercase tracking-[0.4em] text-white/60">{monthlyHeader}</h3>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {prediction.monthlyBreakdown.map((item, index) => (
            <div key={index} className="glass p-10 rounded-[2.5rem] hover:bg-white/10 transition-all border border-white/5 hover:border-purple-500/20 hover:scale-[1.02] duration-300 group shadow-xl flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-purple-400 font-bold text-sm group-hover:text-purple-300 transition-colors uppercase tracking-[0.3em]">{item.month}</h3>
                <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-xs opacity-40">0{index + 1}</div>
              </div>
              <p className="text-white/80 text-sm md:text-base leading-relaxed font-light flex-grow">{item.highlight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PredictionDisplay;
