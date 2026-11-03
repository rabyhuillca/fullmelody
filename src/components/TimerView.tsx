import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  CheckCircle, 
  Clock, 
  Flame
} from 'lucide-react';
import { TimerMode, PomodoroSession, Language } from '../types';
import { translations } from '../i18n';

interface TimerViewProps {
  language: Language;
  onSessionComplete: (session: PomodoroSession) => void;
  sessions: PomodoroSession[];
}

export const TimerView: React.FC<TimerViewProps> = ({
  language,
  onSessionComplete,
  sessions,
}) => {
  const t = translations[language];

  const durations: Record<TimerMode, number> = {
    work: 25 * 60,
    short_break: 5 * 60,
    long_break: 15 * 60,
  };

  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(durations.work);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const totalTime = durations[mode];
  const progressPercent = ((totalTime - timeLeft) / totalTime) * 100;

  // Sound chime via Web Audio API
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch {
      // AudioContext unavailable or restricted
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      playChime();
      setIsRunning(false);

      const durationMins = durations[mode] / 60;
      onSessionComplete({
        id: `pomo-${Date.now()}`,
        type: mode,
        durationMinutes: durationMins,
        completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, mode]);

  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(durations[newMode]);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(durations[mode]);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalFocusMinutes = sessions
    .filter((s) => s.type === 'work')
    .reduce((acc, curr) => acc + curr.durationMinutes, 0);

  return (
    <div className="flex flex-col gap-6 pb-12">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.timer.title}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t.timer.subtitle}
          </p>
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 transition-colors self-start sm:self-auto"
        >
          {soundEnabled ? <Volume2 className="h-3.5 w-3.5 text-indigo-600" /> : <VolumeX className="h-3.5 w-3.5 text-slate-400" />}
          <span>{soundEnabled ? 'Aviso sonoro activado' : 'Aviso silenciado'}</span>
        </button>
      </div>

      {/* Main Timer Display Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Timer Card (2 Cols) */}
        <div className="lg:col-span-2 p-8 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 flex flex-col items-center justify-center gap-8 shadow-xs">
          
          {/* Mode Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg dark:bg-slate-800 text-xs font-medium">
            <button
              onClick={() => switchMode('work')}
              className={`px-4 py-2 rounded-md transition-colors ${
                mode === 'work'
                  ? 'bg-white text-indigo-600 font-semibold shadow-xs dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {t.timer.modes.work}
            </button>
            <button
              onClick={() => switchMode('short_break')}
              className={`px-4 py-2 rounded-md transition-colors ${
                mode === 'short_break'
                  ? 'bg-white text-indigo-600 font-semibold shadow-xs dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {t.timer.modes.short_break}
            </button>
            <button
              onClick={() => switchMode('long_break')}
              className={`px-4 py-2 rounded-md transition-colors ${
                mode === 'long_break'
                  ? 'bg-white text-indigo-600 font-semibold shadow-xs dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {t.timer.modes.long_break}
            </button>
          </div>

          {/* Circular Countdown Ring */}
          <div className="relative flex items-center justify-center">
            <svg className="w-64 h-64 -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                className="stroke-slate-100 dark:stroke-slate-800"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                className="stroke-indigo-600 dark:stroke-indigo-500 transition-all duration-300"
                strokeWidth="6"
                strokeDasharray={2 * Math.PI * 44}
                strokeDashoffset={2 * Math.PI * 44 * (1 - progressPercent / 100)}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            <div className="absolute flex flex-col items-center">
              <span className="text-5xl font-mono font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
                {formattedTime}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                {isRunning ? t.timer.status.running : t.timer.status.idle}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-sm"
            >
              {isRunning ? (
                <>
                  <Pause className="h-4 w-4" />
                  <span>{t.timer.pauseBtn}</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>{t.timer.startBtn}</span>
                </>
              )}
            </button>

            <button
              onClick={resetTimer}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
              title="Reiniciar temporizador"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{t.timer.resetBtn}</span>
            </button>
          </div>

        </div>

        {/* Focus Stats & Session History (1 Col) */}
        <div className="p-6 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              {t.timer.recentSessions}
            </h2>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 my-4">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  {t.timer.stats.totalFocusTime}
                </span>
                <span className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1 block">
                  {totalFocusMinutes} min
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  {t.timer.stats.completedIntervals}
                </span>
                <span className="text-xl font-bold font-mono tabular-nums text-indigo-600 dark:text-indigo-400 mt-1 block">
                  {sessions.filter((s) => s.type === 'work').length}
                </span>
              </div>
            </div>

            {/* Session Items */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2 max-h-60 overflow-y-auto">
              {sessions.map((sess) => (
                <div key={sess.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {sess.type === 'work' ? 'Bloque de Concentración' : 'Pausa de Descanso'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px] tabular-nums">
                    <span>{sess.durationMinutes} min</span>
                    <span>·</span>
                    <span>{sess.completedAt}</span>
                  </div>
                </div>
              ))}

              {sessions.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
                  {t.timer.noSessionsYet}
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
            Consejo: Tras 4 bloques de trabajo, toma un descanso largo de 15 minutos para recargar energías.
          </div>
        </div>

      </div>

    </div>
  );
};
