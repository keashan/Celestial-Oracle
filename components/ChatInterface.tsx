
import React, { useState, useEffect, useRef } from 'react';
import { UserDetails, PredictionData, Message, Language } from '../types.ts';
import { sendChatMessage } from '../services/geminiService.ts';

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
    <div className="glass rounded-[2.5rem] border border-white/10 flex flex-col h-[650px] overflow-hidden shadow-2xl">
      <div className="bg-white/5 px-8 py-5 border-b border-white/10 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-4">
          <div className="w-4 h-4 rounded-full bg-purple-400 animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
          <span className="text-white/70 text-sm font-bold uppercase tracking-[0.3em]">
            {currentLanguage === 'si' ? 'විශ්වීය උපදේශනය' : 'Celestial Bridge'}
          </span>
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
          <button 
            onClick={() => onLanguageChange('en')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${currentLanguage === 'en' ? 'bg-purple-600 text-white shadow-lg' : 'text-white/40'}`}
          >
            EN
          </button>
          <button 
            onClick={() => onLanguageChange('si')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${currentLanguage === 'si' ? 'bg-purple-600 text-white shadow-lg' : 'text-white/40'}`}
          >
            SI
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className={`max-w-[85%] px-6 py-4 rounded-2xl text-[length:var(--fs-chat-msg)] leading-relaxed shadow-xl ${
              msg.role === 'user' 
              ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-tr-none' 
              : 'glass text-white/95 rounded-tl-none border border-white/10'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="glass px-6 py-4 rounded-2xl rounded-tl-none border border-white/10">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white/5 border-t border-white/10 shrink-0">
        <div className="flex space-x-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={currentLanguage === 'si' ? "ප්‍රශ්නයක් අසන්න..." : "Ask the stars..."}
            className="flex-grow bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-[length:var(--fs-form-input)] text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:brightness-110 disabled:opacity-30 text-white p-4 rounded-xl transition-all shadow-lg active:scale-95"
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
