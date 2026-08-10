import React, { useState, useRef, useEffect } from 'react';
import { StockData } from '../types';
import { MessageSquare, Send, Sparkles, X, User, Bot, RefreshCw } from 'lucide-react';

interface AiChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentStock: StockData | null;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AiChatDrawer: React.FC<AiChatDrawerProps> = ({
  isOpen,
  onClose,
  currentStock,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'أهلاً بك! أنا مستشار منصة فرص تداول - المحلل المالي الذكي برؤية أكبر 10 مؤسسات مالية عالمية (Goldman Sachs, Citadel, Bridgewater, JPMorgan...). كيف يمكنني مساعدتك اليوم في تحليل الأسهم السعودية والأمريكية أو تصميم خطة تداول؟'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: input };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          currentStock: currentStock
        })
      });

      const data = await res.json();
      if (data.content) {
        setMessages([...updatedMessages, { role: 'assistant', content: data.content }]);
      } else {
        setMessages([...updatedMessages, { role: 'assistant', content: 'تعذر الحصول على رد من المستشار الذكي حالياً.' }]);
      }
    } catch (err) {
      console.error('Chat error', err);
      setMessages([...updatedMessages, { role: 'assistant', content: 'حدث خطأ في الاتصال بالخادم.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-full sm:w-[420px] bg-slate-900 border-r border-slate-800 shadow-2xl flex flex-col justify-between">
      {/* Top Bar */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4 fill-slate-950" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">مستشار الفهد المؤسسي الذكي</h3>
            <span className="text-[10px] text-slate-400 block">مدعوم بـ Gemini 3.6 Flash</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="p-4 overflow-y-auto space-y-4 flex-1 text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                m.role === 'user' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-amber-400'
              }`}
            >
              {m.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                m.role === 'user'
                  ? 'bg-amber-500 text-slate-950 font-medium'
                  : 'bg-slate-950 border border-slate-800 text-slate-200'
              }`}
            >
              <p className="whitespace-pre-line">{m.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs p-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
            <span>جاري التفكير وصياغة الرأي المؤسسي...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-3 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اسأل عن أي سهم أو استراتيجية..."
            className="flex-1 bg-slate-900 border border-slate-800 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4 rotate-180" />
          </button>
        </form>
      </div>
    </div>
  );
};
