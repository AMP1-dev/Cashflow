import React from 'react';

export function AudioVisualizer({ isPlaying, barCount = 18, color = 'bg-pink-500' }) {
  const bars = Array.from({ length: barCount }, (_, i) => i);

  return (
    <div className="flex items-end gap-1 h-6">
      {bars.map((i) => {
        // Pseudo-random animation delays and heights for a live energetic equalizer effect
        const randomHeight = isPlaying ? `${Math.floor(20 + Math.random() * 80)}%` : '20%';
        const animDuration = `${0.3 + (i % 5) * 0.15}s`;

        return (
          <span
            key={i}
            className={`w-1 rounded-full ${color} transition-all duration-150 ${
              isPlaying ? 'animate-pulse' : 'opacity-40'
            }`}
            style={{
              height: isPlaying ? randomHeight : '20%',
              animationDuration: animDuration
            }}
          ></span>
        );
      })}
    </div>
  );
}
