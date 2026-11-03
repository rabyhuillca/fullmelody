import React, { useState, useEffect, useRef } from 'react';
import { 
  Tv, 
  X, 
  ExternalLink, 
  Maximize2, 
  RefreshCw, 
  Volume2, 
  Radio, 
  Play, 
  Pause,
  AlertCircle
} from 'lucide-react';
import Hls from 'hls.js';

interface TvModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TvModal: React.FC<TvModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'web' | 'hls'>('web');
  const [isPlayingHls, setIsPlayingHls] = useState(false);
  const [hlsStatus, setHlsStatus] = useState('Presiona reproducir para iniciar la señal directa');
  const [iframeKey, setIframeKey] = useState(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  // The exact TV URL provided by the user
  const tvWebUrl = "https://ssh101.com/securelive/index.php?id=bandera";
  // The direct HLS video stream
  const tvHlsUrl = "https://lbgo.bozztv.com/ssh101/ssh101/bandera/chunks.m3u8?lb_backend_hint=7";

  useEffect(() => {
    if (!isOpen) {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      setIsPlayingHls(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (activeTab === 'hls' && isOpen) {
      initHls();
    } else {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
  }, [activeTab, isOpen]);

  const initHls = () => {
    const video = videoRef.current;
    if (!video) return;

    setHlsStatus('Conectando con la señal HLS de Bandera TV...');

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = tvHlsUrl;
      video.play()
        .then(() => {
          setIsPlayingHls(true);
          setHlsStatus('EN VIVO · Transmisión HLS Activa');
        })
        .catch(() => {
          setHlsStatus('Señal lista. Presiona el botón de reproducir.');
        });
    } else if (Hls.isSupported()) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hlsRef.current = hls;

      hls.loadSource(tvHlsUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setHlsStatus('Señal HLS lista. Reproduciendo...');
        video.play()
          .then(() => setIsPlayingHls(true))
          .catch(() => setHlsStatus('Haz clic en play para iniciar el video.'));
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          setHlsStatus('Señal HLS no disponible en este momento. Usa la pestaña Señal Web (ssh101).');
          hls.destroy();
          hlsRef.current = null;
        }
      });
    } else {
      setHlsStatus('Tu navegador no admite reproducción HLS directa. Usa la Señal Web.');
    }
  };

  const handleRefreshIframe = () => {
    setIframeKey((prev) => prev + 1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl rounded-2xl border border-cyan-500/30 bg-slate-950 text-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-600 text-white font-bold text-xs shadow-md">
              <Tv className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide text-white flex items-center gap-2">
                <span>CANAL DE TV · LA VOZ PERÚ</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-600/30 text-red-400 border border-red-500/30 uppercase">
                  Canal Bandera
                </span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={tvWebUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-cyan-300 hover:text-white bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 rounded-lg transition-colors"
              title="Abrir en ssh101.com directamente"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">ssh101.com</span>
            </a>
            <button
              onClick={onClose}
              className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Cerrar reproductor de TV"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900/40 border-b border-white/5 text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('web')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'web'
                  ? 'bg-red-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Señal Web (ssh101.com)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('hls')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'hls'
                  ? 'bg-red-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Señal Directa (HLS)
            </button>
          </div>

          {activeTab === 'web' && (
            <button
              onClick={handleRefreshIframe}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-300 transition-colors"
              title="Recargar reproductor web"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Recargar señal</span>
            </button>
          )}
        </div>

        {/* Video Screen Area */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
          {activeTab === 'web' ? (
            <iframe
              key={iframeKey}
              src={tvWebUrl}
              title="Canal de TV Bandera en ssh101.com"
              className="w-full h-full border-0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              scrolling="no"
            />
          ) : (
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <video
                ref={videoRef}
                controls
                playsInline
                className="w-full h-full object-contain"
                onPlay={() => setIsPlayingHls(true)}
                onPause={() => setIsPlayingHls(false)}
              />
              {!isPlayingHls && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs p-4 text-center">
                  <button
                    onClick={initHls}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-500 shadow-lg active:scale-95 transition-all"
                  >
                    <Play className="h-6 w-6 ml-0.5" />
                  </button>
                  <p className="mt-3 text-xs text-slate-300 font-medium">
                    {hlsStatus}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer / Status */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 py-3 bg-slate-900/90 border-t border-white/10 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span className="font-medium">
              {activeTab === 'web' 
                ? 'Transmitiendo señal en vivo desde ssh101.com (id=bandera)' 
                : hlsStatus}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://ssh101.com/securelive/index.php?id=bandera"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Ver señal original</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
