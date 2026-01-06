import React from 'react';
import { ToneOption } from '../types';

interface ToneSelectorProps {
  selectedTone: ToneOption;
  onSelect: (tone: ToneOption) => void;
}

export const ToneSelector: React.FC<ToneSelectorProps> = ({ selectedTone, onSelect }) => {
  const tones = Object.values(ToneOption);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-stone-500 ml-4">Vibe Check</label>
      <div className="flex flex-wrap gap-2">
        {tones.map((tone) => (
          <button
            key={tone}
            onClick={() => onSelect(tone)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
              ${selectedTone === tone 
                ? 'bg-black text-white border-black shadow-md transform scale-105' 
                : 'bg-white text-stone-500 border-stone-200 hover:border-stone-300 hover:bg-stone-50'}
            `}
          >
            {tone}
          </button>
        ))}
      </div>
    </div>
  );
};