import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import {
  HabitForm,
  HabitList,
  HabitStats,
  StreakDisplay,
} from '../components/habits';

export const Habits: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Habit Tracking</h1>
          <p className="text-gray-400">
            Build consistency and track your daily habits. Limited to 3 habits on free tier.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8">
          <HabitStats />
        </div>

        {/* Streak Display */}
        <div className="mb-8">
          <StreakDisplay />
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="mb-8">
            <HabitForm
              onSubmit={() => setShowForm(false)}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Habit List */}
        <div className="mb-8">
          <HabitList onCreateClick={() => setShowForm(true)} />
        </div>
      </div>
    </Layout>
  );
};

