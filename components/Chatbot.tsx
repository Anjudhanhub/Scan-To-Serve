
import React, { useState, useRef, useEffect } from 'react';
import { SparklesIcon, CloseIcon, PaperAirplaneIcon, MicrophoneIcon, StopIcon, SpeakerWaveIcon } from './Icons';
import { getChatResponse } from '../services/geminiService';
import type { ChatMessage } from '../types';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hi! I am your AI food assistant. Can I help you find something tasty today?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Handle Text-to-Speech (Voice Output)
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    
    // Cancel any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.pitch = 1;
    utterance.rate = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleSendMessage = async (e?: React.FormEvent, overrideText?: string) => {
    e?.preventDefault();
    const textToSend = overrideText || inputText;
    
    if (!textToSend.trim()) return;

    const userMessage: ChatMessage = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const responseText = await getChatResponse(userMessage.text, messages);
      const botMessage: ChatMessage = { role: 'model', text: responseText };
      setMessages(prev => [...prev, botMessage]);
      speakText(responseText);
    } catch (error) {
      const errorMessage = 'Sorry, I am having trouble connecting right now.';
      setMessages(prev => [...prev, { role: 'model', text: errorMessage }]);
      speakText(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Speech Recognition (Voice Input)
  const handleVoiceInput = () => {
    if (isListening) return;

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      // Auto-send after voice input for smoother "Voice Chat" feel
      handleSendMessage(undefined, transcript); 
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
      
      if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        alert(
          "Microphone access is blocked.\n\n" +
          "To enable voice input:\n" +
          "1. Click the lock icon (🔒) in your browser's address bar.\n" +
          "2. Allow 'Microphone' access.\n" +
          "3. Try again."
        );
      }
    };

    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-primary text-white rounded-full shadow-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
        aria-label="Open AI Chatbot"
      >
        {isOpen ? <CloseIcon className="w-8 h-8" /> : <SparklesIcon className="w-8 h-8" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-slide-up" style={{ maxHeight: '500px', height: '60vh' }}>
          {/* Header */}
          <div className="bg-primary p-4 flex items-center justify-between gap-3 shadow-sm">
             <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                    {isSpeaking ? (
                         <SpeakerWaveIcon className="w-6 h-6 text-white animate-pulse" />
                    ) : (
                        <SparklesIcon className="w-6 h-6 text-white" />
                    )}
                </div>
                <div>
                    <h3 className="text-white font-bold text-lg">AI Assistant</h3>
                    <p className="text-white/80 text-xs">Ask me about the menu!</p>
                </div>
             </div>
             {isSpeaking && (
                 <button onClick={stopSpeaking} className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10" title="Stop Speaking">
                     <StopIcon className="w-6 h-6" />
                 </button>
             )}
          </div>

          {/* Messages Area */}
          <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-white text-textPrimary shadow-sm border border-gray-100 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                  </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
            <button
                type="button"
                onClick={handleVoiceInput}
                className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                title="Speak"
            >
                <MicrophoneIcon className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isListening ? "Listening..." : "Type a message..."}
              className="flex-grow p-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm px-4"
            />
            <button 
              type="submit" 
              disabled={isLoading || !inputText.trim()}
              className="p-2 bg-primary text-white rounded-full hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <PaperAirplaneIcon className="w-5 h-5 transform rotate-90" />
            </button>
          </form>
        </div>
      )}
      <style>{`
        @keyframes slide-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
            animation: slide-up 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default Chatbot;
