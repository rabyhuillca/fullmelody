import React, { useState, useRef, useEffect } from 'react';
import { 
  Radio as RadioIcon, 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Music2,
  Disc3,
  ExternalLink
} from 'lucide-react';

export interface Station {
  id: string;
  nombre: string;
  url: string;
  img: string;
  tagline: string;
}

export const STATIONS: Station[] = [
  {
    id: '1',
    nombre: '1. RECUERDAME',
    url: 'https://stream.zeno.fm/ljlrehvfkdotv',
    img: 'https://i.postimg.cc/m2X8S2WY/PLAY-RADIO-LA-VOZ-PERU.png',
    tagline: 'Baladas del recuerdo y clásicos inolvidables',
  },
  {
    id: '2',
    nombre: '2. BAILABLES',
    url: 'https://stream.zeno.fm/nmvvf3o11lctv',
    img: 'https://i.postimg.cc/XNpPcxcR/LOGO-RADIO-LA-VOZ-PERU.png',
    tagline: 'Cumbia, salsa y el ritmo bailable del Perú',
  },
  {
    id: '3',
    nombre: '3. BANDERA DEL ROCK',
    url: 'https://stream.zeno.fm/rtpqqbwifudtv',
    img: 'https://i.postimg.cc/m2X8S2WY/PLAY-RADIO-LA-VOZ-PERU.png',
    tagline: 'Lo mejor del rock nacional e internacional',
  },
  {
    id: '4',
    nombre: '4. LA VOZ PERU',
    url: 'https://stream.zeno.fm/jqmfghcszwlvv',
    img: 'https://cp.usastreams.com/playerHTML5/img/equalizer1.gif',
    tagline: 'La señal principal con noticias y música',
  },
  {
    id: '5',
    nombre: '5. FOLCLORE PERU',
    url: 'https://stream.zeno.fm/mtimrvcbnu2uv',
    img: 'https://cp.usastreams.com/playerHTML5/img/equalizer1.gif',
    tagline: 'Nuestra música andina, huayno y tradiciones',
  },
  {
    id: '6',
    nombre: '6. VOCES PERUANAS',
    url: 'https://stream.zeno.fm/zhiunct47shtv',
    img: 'https://i.postimg.cc/XNpPcxcR/LOGO-RADIO-LA-VOZ-PERU.png',
    tagline: 'Grandes intérpretes y voces del Perú',
  },
];

interface RadioPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeStation: Station;
  setActiveStation: (st: Station) => void;
  isPlaying: boolean;
  setIsPlaying: (p: boolean) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

export const RadioPlayerModal: React.FC<RadioPlayerModalProps> = ({
  isOpen,
  onClose,
  activeStation,
  setActiveStation,
  isPlaying,
  setIsPlaying,
  audioRef,
}) => {
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Listo para reproducir');

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted, audioRef]);

  const handleSelectStation = (st: Station) => {
    if (activeStation.id === st.id) {
      togglePlay();
      return;
    }
    setActiveStation(st);
    setStatusMessage(`Sintonizando ${st.nombre}...`);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = st.url;
      audioRef.current.load();
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setStatusMessage(`Transmitiendo en vivo: ${st.nombre}`);
        })
        .catch(() => {
          setIsPlaying(false);
          setStatusMessage(`Presiona reproducir para iniciar ${st.nombre}`);
        });
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setStatusMessage(`Pausado: ${activeStation.nombre}`);
    } else {
      if (!audioRef.current.src || audioRef.current.src !== activeStation.url) {
        audioRef.current.src = activeStation.url;
        audioRef.current.load();
      }
      setStatusMessage(`Conectando con ${activeStation.nombre}...`);
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setStatusMessage(`En vivo: ${activeStation.nombre}`);
        })
        .catch(() => {
          setIsPlaying(false);
          setStatusMessage(`Señal en espera. Intenta de nuevo.`);
        });
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-2xl border border-emerald-500/30 bg-slate-950 text-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs shadow-md">
              <RadioIcon className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide text-white">
                ESCUCHA RADIOS EN VIVO
              </h3>
              <p className="text-[10px] text-emerald-400 font-mono">
                6 Emisoras exclusivas · La Voz Perú
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Cerrar reproductor de radios"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Current Active Station Showcase */}
        <div className="p-4 bg-gradient-to-b from-slate-900/80 to-slate-950 border-b border-white/10 flex flex-col items-center text-center">
          <div className="relative">
            <img
              src={activeStation.img}
              alt={activeStation.nombre}
              className={`w-20 h-20 rounded-full object-cover border-2 transition-all ${
                isPlaying 
                  ? 'border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.4)] scale-105' 
                  : 'border-white/20 opacity-80'
              }`}
            />
            {isPlaying && (
              <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 border-2 border-slate-950 animate-ping" />
            )}
          </div>

          <h4 className="mt-3 text-base font-bold text-white tracking-wide">
            {activeStation.nombre}
          </h4>
          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
            {activeStation.tagline}
          </p>

          {/* Equalizer animation when playing */}
          <div className="flex items-center gap-1 h-5 mt-2">
            {[4, 10, 6, 12, 8, 14, 5, 11, 7].map((baseHeight, i) => (
              <span
                key={i}
                className="w-1 bg-emerald-400 rounded-full transition-all duration-150"
                style={{
                  height: isPlaying ? `${Math.max(4, (baseHeight * (i % 2 === 0 ? 1.2 : 0.8)))}px` : '3px',
                  opacity: isPlaying ? 0.9 : 0.3,
                }}
              />
            ))}
          </div>

          <div className="mt-2 text-[11px] font-mono text-emerald-400/90">
            {statusMessage}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 mt-3">
            <button
              onClick={togglePlay}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg active:scale-95 transition-all"
              aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
            </button>

            <div className="flex items-center gap-2 bg-slate-900/60 px-3 py-1.5 rounded-full border border-white/10">
              <button
                onClick={toggleMute}
                className="text-slate-400 hover:text-white transition-colors"
                title={isMuted ? 'Activar sonido' : 'Silenciar'}
              >
                {isMuted || volume === 0 ? <VolumeX className="h-4 w-4 text-red-400" /> : <Volume2 className="h-4 w-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                className="w-16 h-1 bg-white/20 rounded-lg accent-emerald-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Stations Selection List */}
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
            Selecciona una emisora:
          </div>

          {STATIONS.map((st) => {
            const isCurrent = activeStation.id === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => handleSelectStation(st)}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                  isCurrent
                    ? 'border-emerald-500 bg-emerald-950/40 text-white shadow-sm ring-1 ring-emerald-500/50'
                    : 'border-white/5 bg-slate-900/60 hover:bg-slate-900 hover:border-white/15 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={st.img}
                    alt=""
                    className="w-9 h-9 rounded-lg object-cover bg-slate-800 shrink-0"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-xs truncate">
                      {st.nombre}
                    </span>
                    <span className="text-[11px] text-slate-400 truncate">
                      {st.tagline}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 pl-2">
                  {isCurrent && isPlaying ? (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-slate-950">
                      <Pause className="h-3 w-3" />
                    </span>
                  ) : (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-white hover:bg-emerald-500 hover:text-slate-950 transition-colors">
                      <Play className="h-3 w-3 ml-0.5" />
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
