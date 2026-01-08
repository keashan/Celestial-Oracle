
import React, { useState } from 'react';
import { MatchDetails, UserDetails, Language } from '../types.ts';

interface MatchFormProps {
  onSubmit: (details: MatchDetails) => void;
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  disabled?: boolean;
}

const MatchForm: React.FC<MatchFormProps> = ({ onSubmit, currentLanguage, onLanguageChange, disabled }) => {
  const [person1, setPerson1] = useState<UserDetails>({
    name: '', birthDate: '', birthTime: '', birthLocation: '', birthState: '', birthCountry: '', language: currentLanguage, additionalContext: ''
  });
  const [person2, setPerson2] = useState<UserDetails>({
    name: '', birthDate: '', birthTime: '', birthLocation: '', birthState: '', birthCountry: '', language: currentLanguage, additionalContext: ''
  });

  const t = currentLanguage === 'si' ? {
    title: "පොරොන්දම් ගැලපීම",
    p1: "පළමු පුද්ගලයා",
    p2: "දෙවන පුද්ගලයා",
    name: "නම",
    date: "උපන් දිනය",
    time: "වේලාව",
    city: "නගරය",
    state: "පළාත / දිස්ත්‍රික්කය",
    country: "රට",
    submit: "ගැළපීම පරීක්ෂා කරන්න"
  } : {
    title: "Horoscope Matching",
    p1: "Person One",
    p2: "Person Two",
    name: "Full Name",
    date: "Birth Date",
    time: "Birth Time",
    city: "City of Birth",
    state: "Province / District",
    country: "Country",
    submit: "Compare Celestial Paths"
  };

  const handlePersonChange = (person: 1 | 2, field: string, value: string) => {
    if (person === 1) setPerson1(prev => ({ ...prev, [field]: value }));
    else setPerson2(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;
    onSubmit({ person1, person2 });
  };

  const renderFields = (person: 1 | 2, data: UserDetails) => (
    <div className="space-y-4 bg-white/5 p-6 rounded-[2rem] border border-white/5 shadow-inner">
      <h3 className="text-purple-400 font-bold uppercase tracking-widest text-[10px] mb-4 px-2 border-b border-purple-500/20 pb-2">{person === 1 ? t.p1 : t.p2}</h3>
      
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-2">{t.name}</label>
        <input
          required
          placeholder={t.name}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm text-white placeholder-white/10 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
          value={data.name}
          onChange={e => handlePersonChange(person, 'name', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-2">{t.date}</label>
          <input
            required
            type="date"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm text-white [color-scheme:dark] focus:outline-none focus:ring-1 focus:ring-purple-500/50"
            value={data.birthDate}
            onChange={e => handlePersonChange(person, 'birthDate', e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-2">{t.time}</label>
          <input
            required
            type="time"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm text-white [color-scheme:dark] focus:outline-none focus:ring-1 focus:ring-purple-500/50"
            value={data.birthTime}
            onChange={e => handlePersonChange(person, 'birthTime', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-2">{t.city}</label>
        <input
          required
          placeholder={t.city}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm text-white placeholder-white/10 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
          value={data.birthLocation}
          onChange={e => handlePersonChange(person, 'birthLocation', e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-2">{t.state}</label>
        <input
          required
          placeholder={t.state}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm text-white placeholder-white/10 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
          value={data.birthState}
          onChange={e => handlePersonChange(person, 'birthState', e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-2">{t.country}</label>
        <input
          required
          placeholder={t.country}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm text-white placeholder-white/10 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
          value={data.birthCountry}
          onChange={e => handlePersonChange(person, 'birthCountry', e.target.value)}
        />
      </div>
    </div>
  );

  return (
    <div className={`glass p-8 md:p-12 rounded-[2.5rem] w-full max-w-4xl mx-auto border border-white/10 animate-fade-in relative overflow-hidden ${disabled ? 'opacity-30 pointer-events-none' : ''}`}>
      {/* Circle/Gradient Bar Effect */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
      
      <h2 className="text-[length:var(--fs-heading-main)] font-bold text-white mb-8 text-center">{t.title}</h2>
      
      <div className="flex justify-center mb-10">
        <div className="bg-white/5 p-1 rounded-xl flex border border-white/5 shadow-inner">
          <button onClick={() => onLanguageChange('en')} className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${currentLanguage === 'en' ? 'bg-purple-600 text-white shadow-lg' : 'text-white/30'}`}>English</button>
          <button onClick={() => onLanguageChange('si')} className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${currentLanguage === 'si' ? 'bg-purple-600 text-white shadow-lg' : 'text-white/30'}`}>සිංහල</button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {renderFields(1, person1)}
          {renderFields(2, person2)}
        </div>
        <button
          type="submit"
          disabled={disabled}
          className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:brightness-110 text-white font-bold py-5 rounded-2xl shadow-xl transition-all transform hover:scale-[1.01] active:scale-[0.98] uppercase tracking-[0.3em] text-sm"
        >
          {t.submit}
        </button>
      </form>
    </div>
  );
};

export default MatchForm;
