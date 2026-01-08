
import React, { useState, useEffect } from 'react';
import { Language } from '../types.ts';

interface LoaderProps {
  language: Language;
}

const Loader: React.FC<LoaderProps> = ({ language }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(s => (s + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const messages = language === 'si' ? [
    { title: "ග්‍රහලෝක පෙළගස්වමින්...", subtitle: "ඔබේ සුවිශේෂී විශ්වීය කම්පනය ගණනය කරමින්..." },
    { title: "දෛවයේ පින්තූරය අඳිමින්...", subtitle: "ඔබේ ලග්නයට අදාළ දිව්‍යමය සිතුවම නිර්මාණය කරමින්..." },
    { title: "තරු මගින් පණිවිඩ එවමින්...", subtitle: "අනාවැකියේ අවසන් තොරතුරු සකසමින්..." }
  ] : [
    { title: "Aligning the Planets", subtitle: "Calculating your unique celestial vibration..." },
    { title: "Painting Your Portrait", subtitle: "Generating a unique mystical artwork for your sign..." },
    { title: "Receiving Stellar Signals", subtitle: "Finalizing your deep-dive astrological analysis..." }
  ];

  const content = messages[step];

  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-10 animate-fade-in">
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 border-[6px] border-purple-500/10 rounded-full"></div>
        <div className="absolute inset-0 border-[6px] border-transparent border-t-purple-500 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
        <div className="absolute inset-4 border-[6px] border-blue-500/10 rounded-full"></div>
        <div className="absolute inset-4 border-[6px] border-transparent border-b-blue-500 rounded-full animate-spin-reverse" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
        <div className="absolute inset-8 border-[6px] border-pink-500/10 rounded-full"></div>
        <div className="absolute inset-8 border-[6px] border-transparent border-r-pink-500 rounded-full animate-spin" style={{ animationDuration: '4s' }}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-8 h-8 text-white animate-pulse" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      </div>
      
      <div className="text-center space-y-4 max-w-sm">
        <h3 className="text-2xl font-bold text-white transition-all duration-1000 tracking-tight">{content.title}</h3>
        <p className="text-white/40 text-sm animate-pulse leading-relaxed uppercase tracking-[0.1em]">{content.subtitle}</p>
      </div>
    </div>
  );
};

export default Loader;
