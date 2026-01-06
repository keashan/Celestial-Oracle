
import React, { useState, useEffect } from 'react';
import { UserDetails, Language } from '../types.ts';

interface AstroFormProps {
  onSubmit: (details: UserDetails) => void;
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  disabled?: boolean;
}

const translations = {
  en: {
    title: "Map Your Destiny",
    nameLabel: "Full Name",
    namePlaceholder: "e.g. Alexander Great",
    dateLabel: "Birth Date",
    timeLabel: "Birth Time",
    cityLabel: "City of Birth",
    cityPlaceholder: "e.g. London or Kandy",
    stateLabel: "State / District",
    statePlaceholder: "e.g. Central Province",
    countryLabel: "Country",
    countryPlaceholder: "e.g. Sri Lanka",
    contextLabel: "Celestial Context (Optional)",
    contextPlaceholder: "Describe your current path (career, love, or spiritual goals) for a more tailored reading...",
    submitBtn: "Manifest My Oracle"
  },
  si: {
    title: "ඔබේ දෛවය හඳුනාගන්න",
    nameLabel: "සම්පූර්ණ නම",
    namePlaceholder: "උදා: නිමල් පෙරේරා",
    dateLabel: "උපන් දිනය",
    timeLabel: "උපන් වේලාව",
    cityLabel: "උපන් නගරය",
    cityPlaceholder: "උදා: මහනුවර හෝ කොළඹ",
    stateLabel: "පළාත / දිස්ත්‍රික්කය",
    statePlaceholder: "උදා: මධ්‍යම පළාත",
    countryLabel: "රට",
    countryPlaceholder: "උදා: ශ්‍රී ලංකාව",
    contextLabel: "අමතර විස්තර (අත්‍යවශ්‍ය නොවේ)",
    contextPlaceholder: "ඔබේ රැකියාව, ආදරය හෝ වර්තමාන ගැටළු පිළිබඳව කෙටි විස්තරයක් ඇතුළත් කිරීමෙන් වඩාත් නිවැරදි අනාවැකි ලබා ගත හැක...",
    submitBtn: "දෛවය විමසන්න"
  }
};

const AstroForm: React.FC<AstroFormProps> = ({ onSubmit, currentLanguage, onLanguageChange, disabled }) => {
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

  useEffect(() => {
    setFormData(prev => ({ ...prev, language: currentLanguage }));
  }, [currentLanguage]);

  const t = translations[currentLanguage];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;
    const { name, birthDate, birthTime, birthLocation, birthState, birthCountry } = formData;
    if (name && birthDate && birthTime && birthLocation && birthState && birthCountry) {
      onSubmit(formData);
    }
  };

  return (
    <div className={`glass p-10 md:p-14 rounded-[3rem] shadow-2xl w-full max-w-3xl mx-auto border border-white/5 relative overflow-hidden transition-all duration-500 ${disabled ? 'opacity-30 pointer-events-none scale-[0.98] grayscale' : 'opacity-100'}`}>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
      
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-10 text-center tracking-tight">{t.title}</h2>
      
      <div className="flex justify-center mb-12">
        <div className="bg-white/5 p-1.5 rounded-2xl border border-white/5 flex shadow-inner">
          <button 
            type="button"
            disabled={disabled}
            onClick={() => onLanguageChange('en')}
            className={`px-12 py-4 rounded-xl text-lg font-bold transition-all duration-300 ${currentLanguage === 'en' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' : 'text-white/30 hover:text-white/60'}`}
          >
            English
          </button>
          <button 
            type="button"
            disabled={disabled}
            onClick={() => onLanguageChange('si')}
            className={`px-12 py-4 rounded-xl text-lg font-bold transition-all duration-300 ${currentLanguage === 'si' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' : 'text-white/30 hover:text-white/60'}`}
          >
            සිංහල
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="col-span-1 md:col-span-2 space-y-4">
          <label className="text-base font-bold text-white/60 uppercase tracking-[0.2em] ml-2">{t.nameLabel}</label>
          <input
            required
            disabled={disabled}
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t.namePlaceholder}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 text-xl md:text-2xl text-white placeholder-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all shadow-inner"
          />
        </div>
        
        <div className="space-y-4">
          <label className="text-base font-bold text-white/60 uppercase tracking-[0.2em] ml-2">{t.dateLabel}</label>
          <input
            required
            disabled={disabled}
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 text-xl md:text-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all [color-scheme:dark]"
          />
        </div>

        <div className="space-y-4">
          <label className="text-base font-bold text-white/60 uppercase tracking-[0.2em] ml-2">{t.timeLabel}</label>
          <input
            required
            disabled={disabled}
            type="time"
            name="birthTime"
            value={formData.birthTime}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 text-xl md:text-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all [color-scheme:dark]"
          />
        </div>

        <div className="space-y-4">
          <label className="text-base font-bold text-white/60 uppercase tracking-[0.2em] ml-2">{t.cityLabel}</label>
          <input
            required
            disabled={disabled}
            name="birthLocation"
            value={formData.birthLocation}
            onChange={handleChange}
            placeholder={t.cityPlaceholder}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 text-xl md:text-2xl text-white placeholder-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
          />
        </div>

        <div className="space-y-4">
          <label className="text-base font-bold text-white/60 uppercase tracking-[0.2em] ml-2">{t.stateLabel}</label>
          <input
            required
            disabled={disabled}
            name="birthState"
            value={formData.birthState}
            onChange={handleChange}
            placeholder={t.statePlaceholder}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 text-xl md:text-2xl text-white placeholder-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
          />
        </div>

        <div className="col-span-1 md:col-span-2 space-y-4">
          <label className="text-base font-bold text-white/60 uppercase tracking-[0.2em] ml-2">{t.countryLabel}</label>
          <input
            required
            disabled={disabled}
            name="birthCountry"
            value={formData.birthCountry}
            onChange={handleChange}
            placeholder={t.countryPlaceholder}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 text-xl md:text-2xl text-white placeholder-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
          />
        </div>

        <div className="col-span-1 md:col-span-2 space-y-4">
          <label className="text-base font-bold text-white/60 uppercase tracking-[0.2em] ml-2">{t.contextLabel}</label>
          <textarea
            name="additionalContext"
            disabled={disabled}
            value={formData.additionalContext}
            onChange={handleChange}
            placeholder={t.contextPlaceholder}
            rows={5}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 text-xl md:text-2xl text-white placeholder-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all resize-none shadow-inner"
          />
        </div>

        <div className="col-span-1 md:col-span-2 pt-10">
          <button
            type="submit"
            disabled={disabled}
            className={`w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-8 rounded-2xl shadow-[0_15px_40px_rgba(124,58,237,0.4)] transition-all transform flex items-center justify-center space-x-4 tracking-[0.2em] uppercase text-xl ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.01] active:scale-[0.99]'}`}
          >
            <span>{t.submitBtn}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AstroForm;
