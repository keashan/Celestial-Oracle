
import React, { useEffect } from 'react';

const AdBanner: React.FC = () => {
  useEffect(() => {
    try {
      const adsbygoogle = (window as any).adsbygoogle || [];
      adsbygoogle.push({});
    } catch (err) {
      console.error('AdSense banner error:', err);
    }
  }, []);

  return (
    <div className="w-full mt-12 mb-4 flex justify-center items-center bg-white/5 rounded-3xl p-6 border border-white/5 relative overflow-hidden min-h-[120px]">
      <div className="text-[10px] text-white/10 uppercase tracking-[0.3em] absolute top-2 left-1/2 -translate-x-1/2 z-0">
        Celestial Sponsor
      </div>
      <div className="relative z-10 w-full flex justify-center">
        {/* 
          IMPORTANT: Replace 'data-ad-slot' with a valid Display Ad Unit ID from your Google AdSense console.
          The current ID is a placeholder. 
        */}
        <ins className="adsbygoogle"
             style={{ display: 'block', width: '100%' }}
             data-ad-client="pub-6948526409518233"
             data-ad-slot="8934512765"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      </div>
    </div>
  );
};

export default AdBanner;
