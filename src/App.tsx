/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Play, 
  Pause, 
  Upload, 
  Tv, 
  Radio as RadioIcon, 
  MessageSquare, 
  ExternalLink,
  Volume2,
  VolumeX,
  Sparkles,
  Music,
  Share2,
  Layers
} from 'lucide-react';
import { TvModal } from './components/TvModal';
import { RadioPlayerModal, STATIONS, Station } from './components/RadioPlayerModal';
import { ChatModal } from './components/ChatModal';

export default function App() {
  // Modal states
  const [isTvOpen, setIsTvOpen] = useState(false);
  const [isRadioOpen, setIsRadioOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Radio streaming state
  const [activeStation, setActiveStation] = useState<Station>(STATIONS[0]);
  const [isRadioPlaying, setIsRadioPlaying] = useState(false);
  const radioAudioRef = useRef<HTMLAudioElement | null>(null);

  // Local Stage Audio Visualizer state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageAudioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioTitle, setAudioTitle] = useState<string>('');
  const [isStagePlaying, setIsStagePlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAudioConnected, setIsAudioConnected] = useState(false);

  // Format time (mm:ss)
  const timeLabels = useMemo(() => {
    const format = (secs: number) => {
      if (!isFinite(secs) || isNaN(secs)) return '00:00';
      const m = Math.floor(secs / 60);
      const s = Math.floor(secs % 60);
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };
    return {
      current: format(currentTime),
      total: format(duration),
    };
  }, [currentTime, duration]);

  // Load selected audio file
  const handleLoadFile = (file: File | null) => {
    if (!file) return;
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    setAudioTitle(file.name.replace(/\.[^/.]+$/, ''));
    setIsStagePlaying(false);
    setIsAudioConnected(false);

    if (sourceRef.current) {
      try {
        sourceRef.current.disconnect();
      } catch {}
      sourceRef.current = null;
    }

    setTimeout(() => {
      if (stageAudioRef.current) {
        stageAudioRef.current.load();
        stageAudioRef.current.play()
          .then(() => setIsStagePlaying(true))
          .catch(() => {});
      }
    }, 100);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleLoadFile(file);
    e.target.value = '';
  };

  // Connect Web Audio API Analyser
  const setupAudioContext = () => {
    if (!stageAudioRef.current || isAudioConnected) return;
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      if (!sourceRef.current) {
        sourceRef.current = ctx.createMediaElementSource(stageAudioRef.current);
      }
      if (!analyserRef.current) {
        analyserRef.current = ctx.createAnalyser();
        analyserRef.current.fftSize = 256;
        analyserRef.current.smoothingTimeConstant = 0.8;
      }

      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(ctx.destination);
      setIsAudioConnected(true);
    } catch (err) {
      console.log('AudioContext connection skipped:', err);
    }
  };

  // Canvas visualizer animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);
      const analyser = analyserRef.current;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      if (!analyser || !isStagePlaying) {
        // Idle ambient waves
        const barCount = 48;
        const barWidth = width / barCount;
        for (let i = 0; i < barCount; i++) {
          const x = i * barWidth;
          const h = 2 + Math.sin(Date.now() / 400 + i * 0.4) * 2 + Math.random() * 1.5;
          ctx.fillStyle = `rgba(255, 255, 255, ${0.08 + Math.abs(Math.sin(i)) * 0.08})`;
          ctx.fillRect(x + 1, height / 2 - h / 2, barWidth - 2, h);
        }
        return;
      }

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      const bars = 64;
      const step = Math.floor(bufferLength / bars);
      const barWidth = width / bars;

      for (let i = 0; i < bars; i++) {
        const index = i * step;
        const val = (dataArray[index] || 0) / 255;
        const barHeight = Math.max(3, val * (height * 0.95));
        const x = i * barWidth;
        const y = height - barHeight;

        if (val > 0.25) {
          ctx.shadowColor = 'rgba(0, 240, 255, 0.8)';
          ctx.shadowBlur = val * 10;
        } else {
          ctx.shadowBlur = 0;
        }

        const gradient = ctx.createLinearGradient(0, height, 0, 0);
        gradient.addColorStop(0, 'rgba(56, 189, 248, 0.3)');
        gradient.addColorStop(0.7, 'rgba(0, 240, 255, 0.85)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.95)');

        ctx.fillStyle = gradient;
        ctx.fillRect(x + 1, y, barWidth - 2, barHeight);
        ctx.shadowBlur = 0;
      }
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isStagePlaying, isAudioConnected]);

  // Resize canvas for sharp rendering
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvasRef.current.getBoundingClientRect();
        canvasRef.current.width = rect.width * dpr;
        canvasRef.current.height = rect.height * dpr;
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) ctx.scale(dpr, dpr);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Stage Play / Pause handler
  const toggleStagePlay = async () => {
    if (!audioUrl) {
      // Play brief synthesized chime to show audio capability and prompt user
      try {
        if (!audioContextRef.current) {
          const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          audioContextRef.current = new AudioCtx();
        }
        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') await ctx.resume();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } catch {}
      fileInputRef.current?.click();
      return;
    }

    if (!stageAudioRef.current) return;
    if (!isAudioConnected) setupAudioContext();

    if (audioContextRef.current?.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    if (isStagePlaying) {
      stageAudioRef.current.pause();
      setIsStagePlaying(false);
    } else {
      try {
        await stageAudioRef.current.play();
        setIsStagePlaying(true);
      } catch {}
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (stageAudioRef.current) {
      stageAudioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  // Keyboard controls (Space to play/pause stage)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (e.target === document.body || e.target === document.documentElement)) {
        e.preventDefault();
        toggleStagePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [audioUrl, isStagePlaying, isAudioConnected]);

  return (
    <div 
      className="relative w-full min-h-screen bg-[#050507] text-white flex flex-col overflow-x-hidden selection:bg-cyan-500/30"
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('audio/')) {
          handleLoadFile(file);
        }
      }}
    >
      
      {/* Background Concert Stage Visual with Lights & Smoke */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Deep ambient backdrop */}
        <div className="absolute inset-0 bg-radial-at-center from-indigo-950/20 via-black/80 to-[#050507]" />

        {/* Concert Spotlights Simulation */}
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute -top-32 right-1/4 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen" />
        
        {/* Subtle grid texture */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px' 
          }} 
        />
      </div>

      {/* Top Header */}
      <header className="relative z-20 flex items-center justify-between px-4 sm:px-8 pt-6 pb-4 border-b border-white/5 bg-slate-950/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee] animate-pulse" />
          <div className="flex flex-col">
            <span className="font-mono text-[10px] tracking-[0.25em] text-cyan-400 uppercase">
              SEÑAL OFICIAL · PERÚ
            </span>
            <h1 className="font-bold text-lg sm:text-xl tracking-tight text-white flex items-center gap-2">
              <span>RADIO Y TV LA VOZ PERÚ</span>
            </h1>
          </div>
        </div>

        {/* Navigation Quick Triggers */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsTvOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600/90 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md active:scale-95"
          >
            <Tv className="h-3.5 w-3.5" />
            <span>TV EN VIVO</span>
          </button>

          <button
            onClick={() => setIsRadioOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md active:scale-95"
          >
            <RadioIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">6 EMISORAS</span>
            <span className="sm:hidden">RADIOS</span>
          </button>

          <button
            onClick={() => setIsChatOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-600/90 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>CHAT</span>
          </button>
        </div>
      </header>

      {/* Main Interactive Stage Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-8 max-w-5xl mx-auto w-full">
        
        {/* Drag and Drop Overlay Indicator */}
        {isDragging && (
          <div className="absolute inset-4 z-40 bg-black/80 backdrop-blur-md rounded-3xl border-2 border-dashed border-cyan-400 flex items-center justify-center p-6 text-center animate-in fade-in">
            <div>
              <Music className="h-12 w-12 text-cyan-400 mx-auto animate-bounce" />
              <h2 className="text-2xl font-bold text-white mt-2">Suelta tu archivo de audio</h2>
              <p className="text-xs text-slate-400 mt-1 font-mono">WAV · MP3 · FLAC · M4A</p>
            </div>
          </div>
        )}

        {/* Central Stage Headline */}
        <div className="text-center max-w-xl mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-cyan-300">
              Visualizador Sonoro y Transmisiones
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            SONIDO, LUCES Y <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">TRANSMISIÓN</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Disfruta del canal de televisión en vivo, sintoniza las 6 emisoras oficiales y participa en el chat comunitario.
          </p>
        </div>

        {/* Spectrum Equalizer Canvas */}
        <div className="relative w-full max-w-3xl h-28 sm:h-36 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 p-3 overflow-hidden shadow-2xl flex flex-col justify-end">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ width: '100%', height: '100%' }}
          />

          {/* Overlay Info on Canvas */}
          <div className="relative z-10 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-cyan-400 bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-xs">
              <span className={`w-2 h-2 rounded-full ${isStagePlaying ? 'bg-cyan-400 animate-ping' : 'bg-slate-500'}`} />
              <span className="font-bold truncate max-w-[200px] sm:max-w-xs">
                {audioTitle || 'Pista de prueba · Listo para escuchar'}
              </span>
            </div>

            <div className="text-slate-400 bg-black/60 px-2 py-1 rounded-lg">
              {isStagePlaying ? '• ANALIZADOR DE ESPECTRO ACTIVO' : '• EN ESPERA'}
            </div>
          </div>
        </div>

        {/* Audio Player Controls Bar */}
        <div className="w-full max-w-3xl mt-4 p-4 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-xl flex flex-col gap-3">
          
          {/* Seeker line */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-slate-400 min-w-[40px]">
              {timeLabels.current}
            </span>

            <div className="relative flex-1 flex items-center">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
              />
            </div>

            <span className="font-mono text-[11px] text-slate-400 min-w-[40px] text-right">
              {timeLabels.total}
            </span>
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleStagePlay}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-950 hover:bg-slate-200 active:scale-95 transition-all shadow-md font-bold"
                aria-label={isStagePlaying ? 'Pausar audio' : 'Reproducir audio'}
              >
                {isStagePlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
              </button>

              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-semibold text-white">
                  {audioTitle || 'Carga tu audio o usa la barra espaciadora'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Visualizador reactivo a frecuencias en tiempo real
                </span>
              </div>
            </div>

            {/* Upload or Change Audio File */}
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-semibold text-slate-200 hover:text-white transition-all active:scale-95"
              >
                <Upload className="h-3.5 w-3.5 text-cyan-400" />
                <span>{audioUrl ? 'Cambiar pista' : 'Cargar tu audio'}</span>
              </button>
            </div>
          </div>

        </div>

      </main>

      {/* Persistent Side & Bottom Floating Widgets */}
      
      {/* 1. Left Side: Chat Launcher */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-30 flex items-center gap-2 px-2.5 py-4 rounded-r-2xl bg-slate-900/95 hover:bg-slate-800 text-cyan-400 border-y border-r border-cyan-500/40 shadow-2xl font-bold text-xs tracking-wider transition-all hover:pl-3.5"
        style={{ writingMode: 'vertical-rl' }}
        title="Abrir chat en vivo"
      >
        <MessageSquare className="h-3.5 w-3.5 mb-1" />
        <span>CHAT EN VIVO</span>
      </button>

      {/* 2. Bottom Center: TV Launcher (with direct reference to user requested link) */}
      <button
        onClick={() => setIsTvOpen(true)}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs tracking-wider shadow-[0_10px_30px_rgba(239,35,60,0.4)] active:scale-95 transition-all border border-red-400/40"
        title="Ver televisión en vivo (ssh101.com id=bandera)"
      >
        <Tv className="h-4 w-4" />
        <span>▶ TV EN VIVO</span>
      </button>

      {/* 3. Right Side: Radio Launcher */}
      <button
        onClick={() => setIsRadioOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-30 flex items-center gap-2 px-2.5 py-4 rounded-l-2xl bg-slate-900/95 hover:bg-slate-800 text-emerald-400 border-y border-l border-emerald-500/40 shadow-2xl font-bold text-xs tracking-wider transition-all hover:pr-3.5"
        style={{ writingMode: 'vertical-rl' }}
        title="Abrir reproductor de 6 emisoras"
      >
        <RadioIcon className="h-3.5 w-3.5 mb-1" />
        <span>♫ ESCUCHA RADIOS AQUÍ</span>
      </button>

      {/* Native Background Audio element for the 6 radio stations */}
      <audio
        ref={radioAudioRef}
        preload="none"
        onEnded={() => setIsRadioPlaying(false)}
        onError={() => setIsRadioPlaying(false)}
      />

      {/* Audio element for the Stage visualizer */}
      <audio
        ref={stageAudioRef}
        src={audioUrl || undefined}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onPlay={() => setIsStagePlaying(true)}
        onPause={() => setIsStagePlaying(false)}
        onEnded={() => setIsStagePlaying(false)}
        crossOrigin="anonymous"
      />

      {/* TV Modal with the user requested URL */}
      <TvModal
        isOpen={isTvOpen}
        onClose={() => setIsTvOpen(false)}
      />

      {/* Radio Modal for 6 stations */}
      <RadioPlayerModal
        isOpen={isRadioOpen}
        onClose={() => setIsRadioOpen(false)}
        activeStation={activeStation}
        setActiveStation={setActiveStation}
        isPlaying={isRadioPlaying}
        setIsPlaying={setIsRadioPlaying}
        audioRef={radioAudioRef}
      />

      {/* Live Chat Modal */}
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

    </div>
  );
}
