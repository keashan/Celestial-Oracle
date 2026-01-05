
import React, { useState, useEffect } from 'react';
import { UserDetails, Language } from '../types';

interface AstroFormProps {
  onSubmit: (details: UserDetails) => void;
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

const translations = {
  en: {
    title: "Reveal Your Celestial Map",
    nameLabel: "Full Name",
    namePlaceholder: "John Doe",
    dateLabel: "Birth Date",
    timeLabel: "Birth Time",
    cityLabel: "City of Birth",
    cityPlaceholder: "e.g. Colombo or New York",
    stateLabel: "State / District",
    statePlaceholder: "e.g. Western Province or NY",
    countryLabel: "Country",
    countryPlaceholder: "e.g. Sri Lanka or USA",
    contextLabel: "Additional Context (Optional)",
    contextPlaceholder: "Describe your current life situation, career goals, or specific concerns for better accuracy...",
    submitBtn: "Consult the Oracle"
  },
  si: {
    title: "Reveal Your Celestial Map",
    nameLabel: "සම්පූර්ණ නම",
    namePlaceholder: "ප්‍රියන්ත පෙරේරා",
    dateLabel: "උපන් දිනය",
    timeLabel: "උපන් වේලාව",
    cityLabel: "උපන් නගරය",
    cityPlaceholder: "උදා: කොළඹ හෝ මහනුවර",
    stateLabel: "පළාත / දිස්ත්‍රික්කය",
    statePlaceholder: "උදා: බස්නාහිර පළාත",
    countryLabel: "රට",
    countryPlaceholder: "උදා: ශ්‍රී ලංකාව",
    contextLabel: "අමතර තොරතුරු (විකල්ප)",
    contextPlaceholder: "වඩාත් නිවැරදි අනාවැකි සඳහා ඔබේ වර්තමාන ජීවන තත්ත්වය හෝ ගැටළු මෙහි සඳහන් කරන්න...",
    submitBtn: "දෛවය විමසන්න"
  }
};

const AstroForm: React.FC<AstroFormProps> = ({ onSubmit, currentLanguage, onLanguageChange }) => {
  const [formData, setFormData] = useState<UserDetails>({
    name: '',
    birthDate: '',
    birthTime: '',
    birthLocation: '',
    birthState: '',
    birthCountry: '',
    language: currentLanguage,
    additionalContext: ''
  });

  // Sync internal language state with global state
  useEffect(() => {
    setFormData(prev => ({ ...prev, language: currentLanguage }));
  }, [currentLanguage]);

  const t = translations[currentLanguage];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, birthDate, birthTime, birthLocation, birthState, birthCountry } = formData;
    if (name && birthDate && birthTime && birthLocation && birthState && birthCountry) {
      onSubmit(formData);
    }
  };

  return (
    <div className="glass p-8 md:p-12 rounded-[2rem] shadow-2xl w-full max-w-2xl mx-auto border border-white/10">
      <h2 className="text-3xl font-semibold text-white mb-8 text-center">{t.title}</h2>
      
      <div className="flex justify-center mb-8">
        <div className="bg-white/5 p-1 rounded-xl border border-white/10 flex">
          <button 
            type="button"
            onClick={() => onLanguageChange('en')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${currentLanguage === 'en' ? 'bg-purple-600 text-white shadow-lg' : 'text-white/40 hover:text-white/70'}`}
          >
            English
          </button>
          <button 
            type="button"
            onClick={() => onLanguageChange('si')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${currentLanguage === 'si' ? 'bg-purple-600 text-white shadow-lg' : 'text-white/40 hover:text-white/70'}`}
          >
            සිංහල
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1 md:col-span-2 space-y-2">
          <label className="text-xs font-bold text-white/50 uppercase tracking-wider ml-1">{t.nameLabel}</label>
          <input
            required
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t.namePlaceholder}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-bold text-white/50 uppercase tracking-wider ml-1">{t.dateLabel}</label>
          <input
            required
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all [color-scheme:dark]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-white/50 uppercase tracking-wider ml-1">{t.timeLabel}</label>
          <input
            required
            type="time"
            name="birthTime"
            value={formData.birthTime}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all [color-scheme:dark]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-white/50 uppercase tracking-wider ml-1">{t.cityLabel}</label>
          <input
            required
            name="birthLocation"
            value={formData.birthLocation}
            onChange={handleChange}
            placeholder={t.cityPlaceholder}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-white/50 uppercase tracking-wider ml-1">{t.stateLabel}</label>
          <input
            required
            name="birthState"
            value={formData.birthState}
            onChange={handleChange}
            placeholder={t.statePlaceholder}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
          />
        </div>

        <div className="col-span-1 md:col-span-2 space-y-2">
          <label className="text-xs font-bold text-white/50 uppercase tracking-wider ml-1">{t.countryLabel}</label>
          <input
            required
            name="birthCountry"
            value={formData.birthCountry}
            onChange={handleChange}
            placeholder={t.countryPlaceholder}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
          />
        </div>

        <div className="col-span-1 md:col-span-2 space-y-2">
          <label className="text-xs font-bold text-white/50 uppercase tracking-wider ml-1">{t.contextLabel}</label>
          <textarea
            name="additionalContext"
            value={formData.additionalContext}
            onChange={handleChange}
            placeholder={t.contextPlaceholder}
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none"
          />
        </div>

        <div className="col-span-1 md:col-span-2 pt-4">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
          >
            <span>{t.submitBtn}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AstroForm;
