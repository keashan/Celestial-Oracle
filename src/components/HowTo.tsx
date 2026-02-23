import React from 'react';
import { Language } from '../../types.ts';

interface HowToProps {
  language: Language;
}

const HowTo: React.FC<HowToProps> = ({ language }) => {
  const t = language === 'si' ? {
    title: "භාවිතා කරන ආකාරය",
    intro: "කොස්මික් ඔරකල් භාවිතා කරන ආකාරය මෙන්න.",
    steps: [
      { title: "ඔබේ දෛනික අනාවැකි බලන්න", description: "මුල් පිටුවට ගොස් 'අද දවසේ දෛවය' තෝරන්න." },
      { title: "ලග්න පලාපල බලන්න", description: "'ලග්න පලාපල (වාර්ෂික)' තෝරා ඔබේ ලග්නය තෝරන්න." },
      { title: "ඔබේ කේන්ද්‍ර පලාපල ලබාගන්න", description: "'කේන්ද්‍ර පලාපල' තෝරා ඔබේ උපන් විස්තර ඇතුළත් කරන්න." },
      { title: "පොරොන්දම් බලන්න", description: "'පොරොන්දම් බැලීම' තෝරා පුද්ගලයන් දෙදෙනෙකුගේ විස්තර ඇතුළත් කරන්න." }
    ]
  } : {
    title: "How to Use Cosmic Oracle",
    intro: "Here's a quick guide to navigating the celestial insights.",
    steps: [
      { title: "View Your Daily Destiny", description: "Go to the home page and select 'Today's Destiny'." },
      { title: "Explore Zodiac Predictions", description: "Select 'Zodiac (Yearly)' and choose your sign." },
      { title: "Get Your Birth Chart", description: "Select 'Birth Chart' and enter your birth details." },
      { title: "Check Compatibility", description: "Select 'Match' and enter details for two individuals." }
    ]
  };

  return (
    <div className="glass p-8 md:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-4xl mx-auto border border-white/10 relative overflow-hidden animate-fade-in">
      <h2 className="text-[length:var(--fs-heading-main)] font-bold text-white mb-10 text-center tracking-tight leading-tight">{t.title}</h2>
      <p className="text-white/70 text-center mb-10 text-lg leading-relaxed">{t.intro}</p>

      <div className="space-y-8">
        {t.steps.map((step, index) => (
          <div key={index} className="bg-white/5 p-6 rounded-2xl border border-white/10 flex items-start space-x-4">
            <div className="w-8 h-8 flex items-center justify-center bg-purple-600/20 rounded-full text-purple-300 font-bold text-lg shrink-0">
              {index + 1}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
              <p className="text-white/70 text-sm leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowTo;
