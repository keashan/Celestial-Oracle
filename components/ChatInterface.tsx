
import React, { useState, useEffect, useRef } from 'react';
import { UserDetails, PredictionData, Message, Language } from '../types';
import { sendChatMessage } from '../services/geminiService';

interface ChatInterfaceProps {
  userDetails: UserDetails;
  prediction: PredictionData;
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ userDetails, prediction, currentLanguage, onLanguageChange }) => {
  const [messages, setMessages] = useState<Message[]>(() => [{ 
    role: 'assistant', 
    content: currentLanguage === 'si' 
      ? `මාර්ගෝපදේශනයක් අවශ්‍යද, ${userDetails.name}? ඔබේ ජන්ම පත්‍රය පිළිබඳ ඕනෑම දෙයක් විමසන්න.`
      : `Seeking guidance, ${userDetails.name}? Ask me anything about your celestial path.` 
  }]);
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    const currentHistory = [...messages];
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    try {
      const botContent = await sendChatMessage(
        userMsg, 
        currentHistory, 
        userDetails, 
        prediction, 
        currentLanguage
      );
      setMessages(prev => [...prev, { role: 'assistant', content: botContent }]);
    } catch (err) {
      console.error("Chat Error:", err);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: currentLanguage === 'si' 
          ? "සන්නිවේදන බාධාවක් ඇති විය. කරුණාකර නැවත උත්සාහ කරන්න." 
          : "An eclipse has blocked our connection. Please try again." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="glass rounded-[2rem] border border-white/10 flex flex-col h-[600px] overflow-hidden shadow-2xl">
      <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
          <span className="text-white/60 text-xs font-bold uppercase tracking-widest">
            {currentLanguage === 'si' ? 'විශ්වීය උපදේශනය' : 'Celestial Bridge'}
          </span>
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-lg border border-white/5">
          <button 
            onClick={() => onLanguageChange('en')}
            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${currentLanguage === 'en' ? 'bg-purple-600 text-white' : 'text-white/40'}`}
          >
            EN
          </button>
          <button 
            onClick={() => onLanguageChange('si')}
            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${currentLanguage === 'si' ? 'bg-purple-600 text-white' : 'text-white/40'}`}
          >
            SI
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user' 
              ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-tr-none shadow-lg' 
              : 'glass text-white/90 rounded-tl-none border border-white/10'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="glass px-4 py-3 rounded-2xl rounded-tl-none border border-white/10">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white/5 border-t border-white/10 shrink-0">
        <div className="flex space-x-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={currentLanguage === 'si' ? "ප්‍රශ්නයක් අසන්න..." : "Ask the stars..."}
            className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:brightness-110 disabled:opacity-30 text-white p-3 rounded-xl transition-all shadow-lg active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
