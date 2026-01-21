import React from 'react';

interface TimerDisplayProps {
  remainingSeconds: number;
  totalSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function TimerDisplay({
  remainingSeconds,
  totalSeconds,
  isRunning,
  isPaused
}: TimerDisplayProps) {
  const progressPercentage = (remainingSeconds / totalSeconds) * 100;
  
  // Determine color based on state
  const getColor = () => {
    if (!isRunning && remainingSeconds === totalSeconds) return 'text-gray-400';
    if (remainingSeconds <= 0) return 'text-green-500';
    if (isPaused) return 'text-yellow-500';
    if (isRunning) return 'text-blue-500';
    return 'text-indigo-500';
  };
  
  const getCircleColor = () => {
    if (!isRunning && remainingSeconds === totalSeconds) return 'from-gray-300 to-gray-400';
    if (remainingSeconds <= 0) return 'from-green-400 to-green-500';
    if (isPaused) return 'from-yellow-400 to-yellow-500';
    if (isRunning) return 'from-blue-400 to-blue-500';
    return 'from-indigo-400 to-indigo-500';
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Circular Progress Display */}
      <div className="relative w-64 h-64 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center shadow-2xl">
        {/* Progress Ring */}
        <svg
          className="absolute w-full h-full transform -rotate-90"
          viewBox="0 0 200 200"
        >
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="#1e293b"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth="8"
            strokeDasharray={`${(progressPercentage / 100) * 2 * Math.PI * 90} ${2 * Math.PI * 90}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 1s linear' }}
          />
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isRunning ? '#3b82f6' : remainingSeconds <= 0 ? '#22c55e' : '#a78bfa'} />
              <stop offset="100%" stopColor={isRunning ? '#2563eb' : remainingSeconds <= 0 ? '#16a34a' : '#8b5cf6'} />
            </linearGradient>
          </defs>
        </svg>

        {/* Time Display */}
        <div className="absolute flex flex-col items-center justify-center">
          <div className={`text-6xl font-bold font-mono ${getColor()} transition-colors duration-300`}>
            {formatTime(remainingSeconds)}
          </div>
          <div className="text-sm text-gray-400 mt-2 font-medium">
            {isRunning ? 'Running' : isPaused ? 'Paused' : remainingSeconds === totalSeconds ? 'Ready' : 'Stopped'}
          </div>
        </div>
      </div>

      {/* Progress Info */}
      <div className="mt-8 text-center">
        <p className="text-gray-400 text-sm">
          Total: {formatTime(totalSeconds)}
        </p>
        <p className="text-gray-500 text-xs mt-1">
          {Math.round(progressPercentage)}% Complete
        </p>
      </div>
    </div>
  );
}
