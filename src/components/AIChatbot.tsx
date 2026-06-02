import { useState, useEffect, useRef } from 'react';
import { X, Send, MessageCircle, Minimize2, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../hooks/useData';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function AIChatbot() {
  const { data: settings } = useData<any>('chatbot-settings.json');
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState<'de' | 'en' | 'ru'>('de');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  // Определяем язык по тексту
  const detectLanguage = (text: string): 'de' | 'en' | 'ru' => {
    const cyrillicPattern = /[а-яА-ЯёЁ]/;
    const germanPattern = /\b(wie|was|ist|der|die|das|ich|sie|können|möchte|website|preis|kosten)\b/i;
    
    if (cyrillicPattern.test(text)) return 'ru';
    if (germanPattern.test(text)) return 'de';
    return 'en';
  };

  // Приветствие при открытии
  useEffect(() => {
    if (isOpen && messages.length === 0 && settings) {
      const greeting = settings.greeting[language] || settings.greeting.de;
      setMessages([{
        id: '1',
        text: greeting,
        sender: 'bot',
        timestamp: new Date()
      }]);
    }
  }, [isOpen, language, settings]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Определяем язык из сообщения пользователя
    const detectedLang = detectLanguage(inputText);
    setLanguage(detectedLang);

    try {
      // Отправляем на AI API
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputText,
          language: detectedLang,
          history: messages.slice(-6), // последние 6 сообщений для контекста
          settings: settings
        })
      });

      if (!response.ok) throw new Error('AI unavailable');

      const data = await response.json();

      setIsTyping(false);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      // Если AI предлагает контакт, уведомляем через Telegram
      if (data.shouldContact) {
        await fetch('/api/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Chatbot Lead',
            email: data.email || 'N/A',
            message: `Новый лид из чат-бота!\n\nПоследнее сообщение: ${inputText}\n\nКонтекст: ${messages.slice(-3).map(m => `${m.sender}: ${m.text}`).join('\n')}`
          })
        });
      }
    } catch (error) {
      setIsTyping(false);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: detectedLang === 'de' 
          ? 'Entschuldigung, ich hatte ein technisches Problem. Bitte versuchen Sie es erneut.'
          : detectedLang === 'ru'
          ? 'Извините, возникла техническая проблема. Попробуйте ещё раз.'
          : 'Sorry, I had a technical issue. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleQuickReply = (text: string) => {
    setInputText(text);
    setTimeout(() => handleSendMessage(), 100);
  };

  // Не показывать если отключен в настройках
  if (!settings || !settings.enabled) return null;

  return (
    <>
      {/* Кнопка открытия чата */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
            style={{ backgroundColor: settings.appearance?.primaryColor || '#616752' }}
            aria-label="Open chat"
          >
            <MessageCircle className="text-white" size={28} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Окно чата */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-6 right-6 z-50 flex flex-col shadow-2xl border-2"
            style={{
              width: isMinimized ? '320px' : '380px',
              height: isMinimized ? '60px' : '600px',
              maxHeight: 'calc(100vh - 100px)',
              backgroundColor: settings.appearance?.backgroundColor || '#F1F3EA',
              borderColor: settings.appearance?.borderColor || '#C5C5C5'
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-4 border-b"
              style={{
                backgroundColor: settings.appearance?.primaryColor || '#616752',
                borderColor: settings.appearance?.borderColor || '#C5C5C5'
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-white uppercase tracking-wide">
                    {settings.name || 'OK Studio'}
                  </h3>
                  <p className="font-mono text-[9px] text-white/70">KI-ASSISTENT • 24/7</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-white/10 rounded transition-colors"
                  aria-label={isMinimized ? 'Maximize' : 'Minimize'}
                >
                  <Minimize2 className="text-white" size={18} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded transition-colors"
                  aria-label="Close chat"
                >
                  <X className="text-white" size={18} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg font-mono text-[11px] leading-relaxed ${
                          message.sender === 'user'
                            ? 'bg-[#616752] text-white'
                            : 'bg-white border border-[#C5C5C5] text-[#141414]'
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-[#C5C5C5] p-3 rounded-lg flex items-center gap-2">
                        <Loader2 className="animate-spin text-[#616752]" size={14} />
                        <span className="font-mono text-[10px] text-[#616752]">Schreibt...</span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Replies */}
                {messages.length === 1 && settings.quickReplies && (
                  <div className="p-4 pt-0 space-y-2">
                    <p className="font-mono text-[9px] text-[#616752]/70 uppercase tracking-wider mb-2">
                      Häufige Fragen:
                    </p>
                    {settings.quickReplies[language]?.map((reply: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickReply(reply)}
                        className="w-full text-left p-2 border border-[#C5C5C5] hover:bg-[#616752] hover:text-white transition-colors font-mono text-[10px] rounded"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-[#C5C5C5]">
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder={
                        language === 'de'
                          ? 'Ihre Nachricht...'
                          : language === 'ru'
                          ? 'Ваше сообщение...'
                          : 'Your message...'
                      }
                      className="flex-1 px-3 py-2 border border-[#C5C5C5] focus:outline-none focus:border-[#616752] font-mono text-[11px] bg-white"
                      disabled={isTyping}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputText.trim() || isTyping}
                      className="px-4 py-2 font-mono text-[10px] transition-colors disabled:opacity-50"
                      style={{ backgroundColor: settings.appearance?.primaryColor || '#616752' }}
                      aria-label="Send message"
                    >
                      <Send className="text-white" size={16} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
