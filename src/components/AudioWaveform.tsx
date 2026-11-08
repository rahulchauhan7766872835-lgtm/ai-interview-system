import React, { useEffect, useRef } from 'react';

interface AudioWaveformProps {
  isActive: boolean;
  barColor?: string;
  barCount?: number;
  height?: number;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  isActive,
  barColor = '#6366f1',
  barCount = 28,
  height = 40
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const h = canvas.height;
      const spacing = width / barCount;
      const barWidth = Math.max(2, spacing * 0.55);

      for (let i = 0; i < barCount; i++) {
        let barHeight = 4; // idle baseline
        if (isActive) {
          // Dynamic sine + random noise modulation
          const sinFactor = Math.sin(phase + i * 0.35);
          const noise = Math.random() * 0.4 + 0.6;
          barHeight = Math.max(6, Math.abs(sinFactor) * (h * 0.85) * noise);
        }

        const x = i * spacing + (spacing - barWidth) / 2;
        const y = (h - barHeight) / 2;

        ctx.fillStyle = barColor;
        ctx.beginPath();
        // Rounded bar
        ctx.roundRect(x, y, barWidth, barHeight, 3);
        ctx.fill();
      }

      if (isActive) {
        phase += 0.12;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isActive, barColor, barCount]);

  return (
    <div className="w-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={240}
        height={height}
        className="w-full max-w-[240px] h-[40px]"
      />
    </div>
  );
};
