import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Users, 
  Circle,
  AlertCircle
} from 'lucide-react';

interface ChatMessage {
  id: string;
  nombre: string;
  mensaje: string;
  timestamp: number;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm-1',
    nombre: 'Locutor La Voz',
    mensaje: '¡Bienvenidos a la transmisión en vivo de Radio y TV La Voz Perú! Deja tus saludos en el chat.',
    timestamp: Date.now() - 360000,
  },
  {
    id: 'm-2',
    nombre: 'Carlos (Lima)',
    mensaje: '¡Excelente señal del canal de TV y la emisora Recuerdame!',
    timestamp: Date.now() - 240000,
  },
  {
    id: 'm-3',
    nombre: 'Elena (Arequipa)',
    mensaje: 'Saludos a toda la gente sintonizando la música folclórica y el rock nacional.',
    timestamp: Date.now() - 120000,
  },
];

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('lavoz_chat_msgs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_MESSAGES;
      }
    }
    return INITIAL_MESSAGES;
  });

  const [nombre, setNombre] = useState(() => localStorage.getItem('lavoz_user_name') || '');
  const [mensaje, setMensaje] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [onlineCount, setOnlineCount] = useState(24);

  const boxRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  // Persist local messages
  useEffect(() => {
    localStorage.setItem('lavoz_chat_msgs', JSON.stringify(messages));
  }, [messages]);

  // Try fetching from Firebase Realtime Database
  useEffect(() => {
    let isMounted = true;
    const fetchFirebaseChat = async () => {
      try {
        const res = await fetch('https://radiolavozperu-e3ff2-default-rtdb.firebaseio.com/mensajes_chat.json?orderBy="$key"&limitToLast=25');
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data === 'object' && isMounted) {
            const list: ChatMessage[] = Object.entries(data).map(([key, val]: [string, any]) => ({
              id: key,
              nombre: val?.nombre || 'Invitado',
              mensaje: val?.mensaje || '',
              timestamp: val?.timestamp || Date.now(),
            }));
            list.sort((a, b) => a.timestamp - b.timestamp);
            if (list.length > 0) {
              setMessages(list);
            }
          }
        }
      } catch {
        // Fallback to local messages
      }
    };

    fetchFirebaseChat();
    const interval = setInterval(fetchFirebaseChat, 8000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensaje.trim() || !nombre.trim()) return;

    const nickname = nombre.trim();
    const text = mensaje.trim();
    localStorage.setItem('lavoz_user_name', nickname);

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      nombre: nickname,
      mensaje: text,
      timestamp: Date.now(),
    };

    // Optimistic update
    setMessages((prev) => [...prev, newMsg]);
    setMensaje('');
    setIsSending(true);

    try {
      await fetch('https://radiolavozperu-e3ff2-default-rtdb.firebaseio.com/mensajes_chat.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nickname,
          mensaje: text,
          timestamp: Date.now(),
        }),
      });
    } catch {
      // Offline fallback already updated in local state
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm rounded-2xl border border-cyan-500/35 bg-slate-950 text-white shadow-2xl overflow-hidden flex flex-col h-[520px] max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-slate-900/80">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-cyan-400" />
            <strong className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              CHAT EN VIVO · LA VOZ
            </strong>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>EN LÍNEA</span>
            </span>
            <button
              onClick={onClose}
              className="h-7 w-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Cerrar chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Messages Box */}
        <div
          ref={boxRef}
          className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5 bg-black/40 text-xs"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="p-2.5 rounded-xl border-l-2 border-l-cyan-400 bg-white/5 border border-white/5 flex flex-col gap-1"
            >
              <div className="flex items-center justify-between text-[11px]">
                <b className="text-cyan-400 font-semibold">{msg.nombre}</b>
                <span className="text-slate-400 font-mono text-[10px]">
                  {formatTime(msg.timestamp)}
                </span>
              </div>
              <span className="text-slate-200 break-words leading-relaxed">
                {msg.mensaje}
              </span>
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSend} className="p-3 bg-slate-900/90 border-t border-white/10 flex flex-col gap-2 text-xs">
          <div className="flex gap-2">
            <input
              type="text"
              required
              maxLength={20}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu apodo"
              className="w-1/3 px-2.5 py-2 rounded-lg bg-black border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <input
              type="text"
              required
              maxLength={250}
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="w-2/3 px-2.5 py-2 rounded-lg bg-black border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <button
            type="submit"
            disabled={isSending}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-blue-500 hover:to-cyan-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-98 transition-all shadow-md disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" />
            <span>ENVIAR MENSAJE</span>
          </button>
        </form>

      </div>
    </div>
  );
};
