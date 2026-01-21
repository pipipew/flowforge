import React, { useState } from 'react';
import { useTimer } from '../components/timer/useTimer';
import CategorySelector from '../components/timer/CategorySelector';
import MoodCheckIn from '../components/timer/MoodCheckIn';
import TimerDisplay from '../components/timer/TimerDisplay';
import TimerControls from '../components/timer/TimerControls';
import { SessionStats } from '../components/SessionStats';
import '../styles/timer.css';

interface TimerPageState {
  sessionCategory: string;
  moodRating: number | null;
  isSessionStarted: boolean;
}

const Timer: React.FC = () => {
  const [pageState, setPageState] = useState<TimerPageState>({
    sessionCategory: 'work',
    moodRating: null,
    isSessionStarted: false,
  });

  const timer = useTimer({
    workDuration: 25 * 60,
    breakDuration: 5 * 60,
  });

  const handleCategoryChange = (category: string) => {
    setPageState((prev) => ({
      ...prev,
      sessionCategory: category,
    }));
  };

  const handleMoodSelect = (rating: number) => {
    setPageState((prev) => ({
      ...prev,
      moodRating: rating,
    }));
  };

  const handleStartSession = () => {
    setPageState((prev) => ({
      ...prev,
      isSessionStarted: true,
    }));
    timer.start();
  };

  return (
    <div className="timer-page">
      <div className="timer-container">
        <h1>Focus Timer</h1>
        
        {!pageState.isSessionStarted ? (
          <div className="timer-setup">
            <CategorySelector
              selectedCategory={pageState.sessionCategory}
              onCategoryChange={handleCategoryChange}
            />
            
            <div className="mood-section">
              <h2>How are you feeling right now?</h2>
              <MoodCheckIn
                selectedMood={pageState.moodRating}
                onMoodSelect={handleMoodSelect}
              />
            </div>
            
            <button
              className="start-button"
              onClick={handleStartSession}
              disabled={pageState.moodRating === null}
            >
              Start Session
            </button>
          </div>
        ) : (
          <div className="timer-active">
            <TimerDisplay
              totalSeconds={timer.totalSeconds}
              elapsedSeconds={timer.elapsedSeconds}
              isRunning={timer.isRunning}
              currentPhase={timer.currentPhase}
            />
            
            <TimerControls
              isRunning={timer.isRunning}
              onStart={timer.start}
              onPause={timer.pause}
              onResume={timer.resume}
              onStop={timer.stop}
              onReset={timer.reset}
            />
            
            <div className="session-info">
              <p>Category: <strong>{pageState.sessionCategory}</strong></p>
              <p>Mood: <strong>{pageState.moodRating}/5</strong></p>
            </div>

             <SessionStats userId={pageState.sessionCategory} className="mt-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Timer;
