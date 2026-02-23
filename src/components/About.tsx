import React from 'react';

const About: React.FC = () => {
  return (
    <div className="p-8 glass rounded-[2rem] border border-white/10 bg-white/5 shadow-xl animate-fade-in space-y-6 text-white/80">
      <h2 className="text-3xl font-bold text-center text-amber-300 uppercase tracking-widest mb-6">About Cosmic Oracle</h2>
      
      <p className="text-lg leading-relaxed">
        Welcome to Cosmic Oracle, your personalized guide to the celestial tapestry that influences our lives. 
        We believe in the profound wisdom of the stars and their ability to illuminate our paths, 
        offering insights into daily destinies, zodiacal influences, and personal compatibility.
      </p>

      <p className="text-lg leading-relaxed">
        Our mission is to blend ancient astrological knowledge with cutting-edge AI technology, 
        specifically leveraging the power of Gemini 3.1 Pro, to provide you with unique and deeply 
        personalized astrological readings. Whether you're seeking guidance for your day, 
        understanding your birth chart, or exploring compatibility with others, Cosmic Oracle 
        is designed to be your trusted companion on this cosmic journey.
      </p>

      <p className="text-lg leading-relaxed">
        We are committed to delivering accurate, insightful, and inspiring content, 
        helping you navigate life's complexities with greater clarity and purpose. 
        Thank you for choosing Cosmic Oracle to explore the mysteries of the universe 
        and your place within it.
      </p>

      <div className="text-center pt-8">
        <p className="text-sm uppercase tracking-widest text-white/50">
          Handcrafted Wisdom, Powered by the Stars and Gemini AI.
        </p>
      </div>
    </div>
  );
};

export default About;
