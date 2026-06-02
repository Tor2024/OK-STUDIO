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

  // Динамические подсказки в зависимости от этапа диалога
  const getSuggestedQuestions = () => {
    const messageCount = messages.filter(m => m.sender === 'user').length;
    const lastBotMessage = [...messages].reverse().find(m => m.sender === 'bot')?.text.toLowerCase() || '';
    
    const suggestions = {
      de: {
        start: [
          'Ich brauche eine Corporate Website',
          'Ich möchte einen Online-Shop',
          'Was kostet eine Website?'
        ],
        features: [
          'Ich brauche Online-Buchung',
          'Mit Zahlungsfunktion',
          'Blog und Kontaktformular'
        ],
        design: [
          'Modern und minimalistisch',
          'Ich habe Referenz-Websites',
          'Wie läuft der Design-Prozess?'
        ],
        final: [
          'Was sind die nächsten Schritte?',
          'Wie lange dauert das?',
          'Wann kann ich ein Angebot bekommen?'
        ]
      },
      ru: {
        start: [
          'Мне нужен корпоративный сайт',
          'Хочу интернет-магазин',
          'Сколько стоит сайт?'
        ],
        features: [
          'Нужна онлайн-запись',
          'С оплатой онлайн',
          'Блог и форма контакта'
        ],
        design: [
          'Современный минималистичный',
          'У меня есть примеры сайтов',
          'Как проходит процесс дизайна?'
        ],
        final: [
          'Какие следующие шаги?',
          'Сколько времени займет?',
          'Когда получу предложение?'
        ]
      },
      en: {
        start: [
          'I need a corporate website',
          'I want an online shop',
          'How much does a website cost?'
        ],
        features: [
          'I need online booking',
          'With payment integration',
          'Blog and contact form'
        ],
        design: [
          'Modern and minimalist',
          'I have reference websites',
          'How does the design process work?'
        ],
        final: [
          'What are the next steps?',
          'How long will it take?',
          'When can I get a quote?'
        ]
      }
    };

    // Определяем этап диалога
    if (messageCount === 0) return suggestions[language].start;
    if (messageCount <= 2 || lastBotMessage.includes('funktion') || lastBotMessage.includes('функци') || lastBotMessage.includes('feature')) {
      return suggestions[language].features;
    }
    if (messageCount <= 4 || lastBotMessage.includes('design') || lastBotMessage.includes('дизайн')) {
      return suggestions[language].design;
    }
    if (messageCount > 4 || lastBotMessage.includes('zusammenfassung') || lastBotMessage.includes('резюме') || lastBotMessage.includes('summary')) {
      return suggestions[language].final;
    }
    
    return suggestions[language].features; // По умолчанию
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
            className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl hover:scale-110 transition-transform overflow-visible relative"
            style={{ backgroundColor: settings.appearance?.primaryColor || '#616752' }}
            aria-label="Open chat"
          >
            {/* Бантик СВЕРХУ СЛЕВА - красный */}
            <motion.div
              className="absolute -left-3 -top-3 z-10"
              animate={{
                rotate: [-5, 5, -5],
                scale: [1, 1.15, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <ellipse cx="6" cy="10" rx="5" ry="7" fill="#ef4444"/>
                <ellipse cx="14" cy="10" rx="5" ry="7" fill="#ef4444"/>
                <circle cx="10" cy="10" r="3" fill="#dc2626"/>
              </svg>
            </motion.div>
            
            {/* Бантик СВЕРХУ СПРАВА - красный */}
            <motion.div
              className="absolute -right-3 -top-3 z-10"
              animate={{
                rotate: [5, -5, 5],
                scale: [1, 1.15, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <ellipse cx="6" cy="10" rx="5" ry="7" fill="#ef4444"/>
                <ellipse cx="14" cy="10" rx="5" ry="7" fill="#ef4444"/>
                <circle cx="10" cy="10" r="3" fill="#dc2626"/>
              </svg>
            </motion.div>
            
            {/* Градиентный фон с анимацией */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                background: [
                  'linear-gradient(135deg, #616752 0%, #7a7a5f 100%)',
                  'linear-gradient(135deg, #7a7a5f 0%, #616752 100%)',
                  'linear-gradient(135deg, #616752 0%, #7a7a5f 100%)'
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Лицо бота */}
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              {/* Глаза */}
              <div className="flex gap-2 mb-1">
                <motion.div 
                  className="w-2 h-2 rounded-full bg-white"
                  animate={{
                    scaleY: [1, 0.2, 1]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                />
                <motion.div 
                  className="w-2 h-2 rounded-full bg-white"
                  animate={{
                    scaleY: [1, 0.2, 1]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                />
              </div>
              
              {/* Улыбка */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <svg width="16" height="8" viewBox="0 0 16 8" fill="none">
                  <path 
                    d="M2 2C3 5 5 6 8 6C11 5 13 5 14 2" 
                    stroke="white" 
                    strokeWidth="2" 
                    strokeLinecap="round"
                  />
                </svg>
              </motion.div>
            </div>
            
            {/* Пульсирующая точка уведомления */}
            <motion.span 
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [1, 0.5, 1]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Искорки вокруг */}
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{
                rotate: [0, 360],
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1
              }}
            >
              <Sparkles className="text-white" size={16} />
            </motion.div>
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
                {/* Анимированная аватарка бота */}
                <motion.div 
                  className="relative w-10 h-10 rounded-full overflow-visible"
                  animate={{
                    boxShadow: [
                      '0 0 0 0 rgba(241, 243, 234, 0.7)',
                      '0 0 0 8px rgba(241, 243, 234, 0)',
                      '0 0 0 0 rgba(241, 243, 234, 0)'
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {/* Бантик СВЕРХУ СЛЕВА - красный */}
                  <motion.div
                    className="absolute -left-2 -top-2 z-10"
                    animate={{
                      rotate: [-5, 5, -5],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                      {/* Левая часть бантика */}
                      <ellipse cx="6" cy="10" rx="5" ry="7" fill="#ef4444"/>
                      {/* Правая часть бантика */}
                      <ellipse cx="14" cy="10" rx="5" ry="7" fill="#ef4444"/>
                      {/* Центр бантика */}
                      <circle cx="10" cy="10" r="3" fill="#dc2626"/>
                    </svg>
                  </motion.div>
                  
                  {/* Бантик СВЕРХУ СПРАВА - красный */}
                  <motion.div
                    className="absolute -right-2 -top-2 z-10"
                    animate={{
                      rotate: [5, -5, 5],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                      {/* Левая часть бантика */}
                      <ellipse cx="6" cy="10" rx="5" ry="7" fill="#ef4444"/>
                      {/* Правая часть бантика */}
                      <ellipse cx="14" cy="10" rx="5" ry="7" fill="#ef4444"/>
                      {/* Центр бантика */}
                      <circle cx="10" cy="10" r="3" fill="#dc2626"/>
                    </svg>
                  </motion.div>
                  
                  {/* Градиентный фон */}
                  <motion.div 
                    className="absolute inset-0 rounded-full"
                    animate={{
                      background: [
                        'linear-gradient(135deg, #F1F3EA 0%, #C5C5C5 100%)',
                        'linear-gradient(135deg, #C5C5C5 0%, #F1F3EA 100%)',
                        'linear-gradient(135deg, #F1F3EA 0%, #C5C5C5 100%)'
                      ]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Лицо бота */}
                  <div className="relative w-full h-full flex items-center justify-center rounded-full">
                    {/* Глаза */}
                    <div className="flex gap-2 mb-1">
                      <motion.div 
                        className="w-1.5 h-1.5 rounded-full bg-[#616752]"
                        animate={{
                          scaleY: [1, 0.1, 1],
                          y: [0, 0, 0]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          repeatDelay: 2,
                          ease: "easeInOut"
                        }}
                      />
                      <motion.div 
                        className="w-1.5 h-1.5 rounded-full bg-[#616752]"
                        animate={{
                          scaleY: [1, 0.1, 1],
                          y: [0, 0, 0]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          repeatDelay: 2,
                          ease: "easeInOut"
                        }}
                      />
                    </div>
                    
                    {/* Улыбка */}
                    <motion.div 
                      className="absolute bottom-3"
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <svg width="12" height="6" viewBox="0 0 12 6" fill="none">
                        <path 
                          d="M1 1C2 4 4 5 6 5C8 5 10 4 11 1" 
                          stroke="#616752" 
                          strokeWidth="1.5" 
                          strokeLinecap="round"
                        />
                      </svg>
                    </motion.div>
                    
                    {/* Искорки интереса */}
                    <motion.div
                      className="absolute -top-1 -right-1"
                      animate={{
                        scale: [0, 1, 0],
                        rotate: [0, 180, 360],
                        opacity: [0, 1, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1,
                        ease: "easeOut"
                      }}
                    >
                      <Sparkles className="text-white" size={12} />
                    </motion.div>
                  </div>
                </motion.div>
                
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

                {/* Quick Replies - динамические подсказки */}
                {!isTyping && messages.length > 0 && messages.length < 15 && (
                  <div className="p-4 pt-0 space-y-2">
                    <p className="font-mono text-[9px] text-[#616752]/70 uppercase tracking-wider mb-2">
                      {language === 'de' ? 'Vorschläge:' : language === 'ru' ? 'Подсказки:' : 'Suggestions:'}
                    </p>
                    {getSuggestedQuestions().map((question: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickReply(question)}
                        className="w-full text-left p-2 border border-[#C5C5C5] hover:bg-[#616752] hover:text-white transition-colors font-mono text-[10px] rounded"
                      >
                        {question}
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
