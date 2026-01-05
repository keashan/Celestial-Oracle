
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { UserDetails, PredictionData, Message, Language } from '../types';
import { createChatBridge } from '../services/geminiService';

interface ChatInterfaceProps {
  userDetails: UserDetails;
  prediction: PredictionData;
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ userDetails, prediction, currentLanguage, onLanguageChange }) => {
  const [messages, setMessages] = useState<Message[]>(() => [{ 
    role: 'assistant', 
    content: userDetails.language === 'si' 
      ? `තරු ඔබ සමඟ කතා කිරීමට සූදානම්, ${userDetails.name}. ඔබේ ජීවන මාවතේ ඔබට වඩාත් ගැඹුරින් දැනගත යුත්තේ කුමක්ද?`
      : `The stars are open for conversation, ${userDetails.name}. What specific area of your path would you like to explore deeper?` 
  }]);
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // We use a bridge to abstract whether we're calling a proxy or the SDK directly
  const chatBridge = useMemo(() => {
    return createChatBridge(userDetails, prediction, currentLanguage);
  }, [userDetails, prediction, currentLanguage]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
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
      // Pass history to the bridge to support stateless proxy calls
      const botContent = await chatBridge.sendMessage(userMsg, currentHistory);
      setMessages(prev => [...prev, { role: 'assistant', content: botContent || "..." }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: currentLanguage === 'si' ? "සම්බන්ධතාවයට බාධාවක් ඇති විය. කරුණාකර නැවත උත්සාහ කරන්න." : "An eclipse has blocked our connection. Please try again." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="glass rounded-[2rem] border border-white/10 flex flex-col h-[600px] overflow-hidden shadow-2xl">
      <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-white/60 text-xs font-bold uppercase tracking-widest">
            {currentLanguage === 'si' ? 'සජීවී විශ්ව උපදේශනය' : 'Live Cosmic Consultation'}
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

      <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user' 
              ? 'bg-purple-600 text-white rounded-tr-none' 
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
                <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce delay-100"></div>
                <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white/5 border-t border-white/10">
        <div className="flex space-x-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={currentLanguage === 'si' ? "ප්‍රශ්නයක් අසන්න..." : "Ask the oracle..."}
            className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white p-3 rounded-xl transition-colors shadow-lg"
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
