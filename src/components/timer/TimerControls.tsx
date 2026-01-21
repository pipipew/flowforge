import React from 'react';
import { Play, Pause, RotateCcw, Stop } from 'lucide-react';

interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  remainingSeconds: number;
  totalSeconds: number;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onReset: () => void;
}

export function TimerControls({
  isRunning,
  isPaused,
  remainingSeconds,
  totalSeconds,
  onStart,
  onPause,
  onResume,
  onStop,
  onReset
}: TimerControlsProps) {
  return (
    <div className="flex gap-4 justify-center py-8">
      {/* Start Button */}
      {!isRunning && !isPaused && (
        <button
          onClick={onStart}
          className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
          title="Start timer (Space)"
        >
          <Play size={20} />
          Start
        </button>
      )}

      {/* Pause Button */}
      {isRunning && (
        <button
          onClick={onPause}
          className="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-colors"
          title="Pause timer (Space)"
        >
          <Pause size={20} />
          Pause
        </button>
      )}

      {/* Resume Button */}
      {isPaused && (
        <button
          onClick={onResume}
          className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
          title="Resume timer (Space)"
        >
          <Play size={20} />
          Resume
        </button>
      )}

      {/* Stop Button */}
      {(isRunning || isPaused || remainingSeconds < totalSeconds) && (
        <button
          onClick={onStop}
          className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
          title="Stop timer (S)"
        >
          <Stop size={20} />
          Stop
        </button>
      )}

      {/* Reset Button */}
      {remainingSeconds < totalSeconds && (
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
          title="Reset timer (R)"
        >
          <RotateCcw size={20} />
          Reset
        </button>
      )}
    </div>
  );
}
