
import React, { useEffect, useState } from 'react';
import { DailyPrediction, Language, ZODIAC_SIGNS } from '../types.ts';
import { getDailyPredictions } from '../services/geminiService.ts';
import Loader from './Loader.tsx';

interface DailyDestinyProps {
  language: Language;
}

const DailyDestiny: React.FC<DailyDestinyProps> = ({ language }) => {
  const [predictions, setPredictions] = useState<Record<string, DailyPrediction> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDaily = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getDailyPredictions(language);
        setPredictions(data);
      } catch (err) {
        console.error(err);
        setError(language === 'si' ? "දෛනික අනාවැකි ලබා ගැනීමට නොහැකි විය." : "Failed to fetch daily insights.");
      } finally {
        setLoading(false);
      }
    };

    fetchDaily();
  }, [language]);

  if (loading) return <div className="min-h-[50vh] flex items-center justify-center"><Loader language={language} /></div>;
  if (error) return <div className="text-center text-red-400 p-10 glass rounded-3xl">{error}</div>;
  if (!predictions) return null;

  const title = language === 'si' ? "අද දවසේ දෛවය" : "Today's Destiny";
  const subtitle = language === 'si' ? new Date().toLocaleDateString('si-LK', { dateStyle: 'full' }) : new Date().toLocaleDateString('en-US', { dateStyle: 'full' });

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-[length:var(--fs-heading-main)] font-bold tracking-tight text-white">{title}</h2>
        <p className="text-purple-300 uppercase tracking-[0.2em] text-xs font-bold">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ZODIAC_SIGNS.map((sign) => {
          const data = predictions[sign.id];
          if (!data) return null;

          return (
            <div key={sign.id} className="glass p-6 rounded-[2rem] border border-white/5 hover:border-purple-500/30 transition-all hover:scale-[1.02] shadow-xl flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] text-6xl group-hover:scale-110 transition-transform duration-700 select-none">
                {sign.symbol}
              </div>
              
              <div className="flex items-center space-x-3 mb-4 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-xl shadow-lg">
                  {sign.symbol}
                </div>
                <div>
                  <h3 className="font-bold text-white uppercase tracking-wider text-sm">{sign.en}</h3>
                  <p className="text-[10px] text-purple-300">{sign.si}</p>
                </div>
              </div>

              <p className="text-white/80 text-sm leading-relaxed font-light mb-4 flex-grow">
                {data.prediction}
              </p>

              <div className="grid grid-cols-3 gap-2 text-[10px] border-t border-white/10 pt-4 text-white/60">
                <div className="text-center">
                   <div className="uppercase tracking-widest text-[8px] opacity-50 mb-1">{language === 'si' ? 'වර්ණය' : 'Color'}</div>
                   <div className="font-bold text-white">{data.luckyColor}</div>
                </div>
                <div className="text-center border-l border-white/10">
                   <div className="uppercase tracking-widest text-[8px] opacity-50 mb-1">{language === 'si' ? 'අංකය' : 'Number'}</div>
                   <div className="font-bold text-white">{data.luckyNumber}</div>
                </div>
                <div className="text-center border-l border-white/10">
                   <div className="uppercase tracking-widest text-[8px] opacity-50 mb-1">{language === 'si' ? 'මනෝභාවය' : 'Mood'}</div>
                   <div className="font-bold text-white">{data.mood}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyDestiny;
