import React from 'react';

const MOOD_EMOJIS = ['😢', '😕', '😐', '🙂', '😄'];
const MOOD_LABELS = ['Very Bad', 'Bad', 'Neutral', 'Good', 'Excellent'];

interface MoodCheckInProps {
  title: string;
  mood: number | null;
  onMoodChange: (mood: number) => void;
  subtitle?: string;
}

export function MoodCheckIn({ title, mood, onMoodChange, subtitle }: MoodCheckInProps) {
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-2">{title}</h3>
      {subtitle && <p className="text-xs text-gray-500 mb-4">{subtitle}</p>}
      
      <div className="flex justify-between gap-2">
        {MOOD_EMOJIS.map((emoji, index) => {
          const moodValue = index + 1;
          const isSelected = mood === moodValue;
          
          return (
            <button
              key={index}
              onClick={() => onMoodChange(moodValue)}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all ${
                isSelected
                  ? 'bg-indigo-500 scale-110 shadow-lg'
                  : 'bg-slate-700 hover:bg-slate-600'
              }`}
              title={MOOD_LABELS[index]}
            >
              <span className="text-3xl">{emoji}</span>
              <span className="text-xs text-gray-300 font-medium">{moodValue}</span>
            </button>
          );
        })}
      </div>
      
      {mood && (
        <p className="text-xs text-gray-400 mt-3 text-center">
          {MOOD_LABELS[mood - 1]}
        </p>
      )}
    </div>
  );
}
