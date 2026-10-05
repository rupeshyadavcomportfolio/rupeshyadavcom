import React from 'react';

interface SectionDividerProps {
  accent?: 'rose' | 'blue' | 'emerald' | 'amber' | 'indigo' | 'default';
  label?: string;
}

export function SectionDivider({ accent = 'default', label }: SectionDividerProps) {
  const getAccentColors = () => {
    switch (accent) {
      case 'rose':
        return {
          glow: 'via-rose-300/25',
          line: 'via-rose-400/60',
          dot: 'bg-rose-500',
        };
      case 'blue':
        return {
          glow: 'via-blue-300/25',
          line: 'via-blue-400/60',
          dot: 'bg-blue-600',
        };
      case 'emerald':
        return {
          glow: 'via-emerald-300/25',
          line: 'via-emerald-400/60',
          dot: 'bg-emerald-500',
        };
      case 'amber':
        return {
          glow: 'via-amber-300/25',
          line: 'via-amber-400/60',
          dot: 'bg-amber-500',
        };
      default:
        return {
          glow: 'via-indigo-300/25',
          line: 'via-indigo-400/60',
          dot: 'bg-indigo-500',
        };
    }
  };

  const colors = getAccentColors();

  return (
    <div className="relative w-full overflow-hidden select-none pointer-events-none py-3" aria-hidden="true">
      {/* Soft Ambient Radial Glow */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-3/4 max-w-xl h-8 bg-gradient-to-r from-transparent ${colors.glow} to-transparent blur-xl`}
      />

      {/* Main Multi-Stop Precision Gradient Line */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div
          className={`w-full h-[1px] bg-gradient-to-r from-transparent via-neutral-300/70 ${colors.line} via-neutral-300/70 to-transparent`}
        />

        {/* Center Stylish Pill Badge */}
        <div className="absolute flex items-center gap-2 px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full bg-white/95 border border-neutral-200/90 shadow-2xs backdrop-blur-md">
          <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
          {label && (
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-neutral-600">
              {label}
            </span>
          )}
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
        </div>
      </div>
    </div>
  );
}
