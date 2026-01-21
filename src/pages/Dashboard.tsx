import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { HabitSection } from '../components/habits/HabitSection';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'focus' | 'habits'>('focus');

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back! 👋</h1>
          <p className="text-gray-400">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('focus')}
            className={`px-4 py-3 font-medium transition border-b-2 ${
              activeTab === 'focus'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            🔥 Focus Session
          </button>
          <button
            onClick={() => setActiveTab('habits')}
            className={`px-4 py-3 font-medium transition border-b-2 ${
              activeTab === 'habits'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            📅 Habits
          </button>
        </div>

        {/* Focus Tab */}
        {activeTab === 'focus' && (
          <div className="space-y-8">
            <Card className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Start a Focus Session</h2>
              <p className="text-gray-400 mb-6">
                Choose your focus duration and category to begin
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <Button>25m Pomodoro</Button>
                <Button>45m Deep Work</Button>
                <Button>90m Flow State</Button>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">Today's Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                    <span className="text-gray-400">Focus Sessions</span>
                    <span className="text-2xl font-bold">2</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                    <span className="text-gray-400">Total Focus Time</span>
                    <span className="text-2xl font-bold">52m</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Mood Average</span>
                    <span className="text-2xl font-bold">8.5/10</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Button className="w-full">View Previous Sessions</Button>
                  <Button className="w-full" variant="secondary">
                    Analytics Dashboard
                  </Button>
                  <Button className="w-full" variant="secondary">
                    Settings
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Habits Tab */}
        {activeTab === 'habits' && (
          <div className="space-y-8">
            <HabitSection />
          </div>
        )}
      </div>
    </Layout>
  );
};

