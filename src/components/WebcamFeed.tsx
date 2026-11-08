import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, Mic, MicOff, AlertCircle, CheckCircle2 } from 'lucide-react';

interface WebcamFeedProps {
  isListening: boolean;
  onToggleMic: () => void;
}

export const WebcamFeed: React.FC<WebcamFeedProps> = ({
  isListening,
  onToggleMic
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(true);
  const [streamError, setStreamError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    if (cameraActive) {
      navigator.mediaDevices?.getUserMedia({ video: { width: { ideal: 640 }, height: { ideal: 480 } }, audio: false })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
          setStreamError(null);
        })
        .catch((err) => {
          console.warn('Webcam access failed or denied:', err);
          setStreamError('Camera unavailable or permission denied');
          setCameraActive(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraActive]);

  const toggleCamera = () => {
    setCameraActive(prev => !prev);
  };

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-center">
      {/* Video Feed */}
      {cameraActive && !streamError ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover transform scale-x-[-1]"
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-6 text-center text-slate-500">
          <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center mb-3">
            <CameraOff className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-sm font-medium text-slate-300">Camera Off</p>
          <p className="text-xs text-slate-500 mt-1 max-w-[200px]">
            {streamError || 'Click the camera button below to turn on webcam simulation.'}
          </p>
        </div>
      )}

      {/* Center Eye-Level Guide Overlay */}
      {cameraActive && !streamError && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30 hover:opacity-70 transition-opacity">
          <div className="w-44 h-56 border-2 border-dashed border-indigo-400/60 rounded-[48%] flex items-center justify-center">
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-300 bg-slate-950/80 px-2 py-0.5 rounded">
              Eye Line Target
            </span>
          </div>
        </div>
      )}

      {/* Top Status Indicators */}
      <div className="absolute top-3 left-3 flex items-center space-x-2">
        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-950/80 backdrop-blur border border-slate-700/60 text-slate-200 flex items-center space-x-1.5 shadow">
          <span className={`w-2 h-2 rounded-full ${cameraActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
          <span>Candidate Feed</span>
        </span>

        {isListening && (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center space-x-1 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>MIC LIVE</span>
          </span>
        )}
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="absolute bottom-3 right-3 flex items-center space-x-2 bg-slate-950/80 backdrop-blur-md border border-slate-700/60 p-1.5 rounded-xl shadow-lg">
        {/* Toggle Mic */}
        <button
          onClick={onToggleMic}
          className={`p-2 rounded-lg transition-colors ${
            isListening
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
          title={isListening ? 'Mute microphone' : 'Unmute microphone'}
        >
          {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
        </button>

        {/* Toggle Camera */}
        <button
          onClick={toggleCamera}
          className={`p-2 rounded-lg transition-colors ${
            cameraActive
              ? 'bg-slate-800 text-emerald-400 hover:text-white'
              : 'bg-slate-800 text-slate-500 hover:text-slate-300'
          }`}
          title={cameraActive ? 'Turn off camera' : 'Turn on camera'}
        >
          {cameraActive ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
