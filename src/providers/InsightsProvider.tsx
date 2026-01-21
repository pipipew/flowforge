'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import type { Database } from '@/types/database';

interface Insight {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  generated_at: Date;
  metadata?: Record<string, unknown>;
}

interface InsightsContextType {
  insights: Insight[];
  loading: boolean;
  error: string | null;
  fetchInsights: () => Promise<void>;
  generateInsight: (prompt: string) => Promise<Insight>;
  deleteInsight: (id: string) => Promise<void>;
}

const InsightsContext = createContext<InsightsContextType | undefined>(undefined);

export function InsightsProvider({ children }: { children: ReactNode }) {
  const [insights, setInsights] = React.useState<Insight[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchInsights = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/insights');
      if (!response.ok) throw new Error('Failed to fetch insights');
      const data = await response.json();
      setInsights(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const generateInsight = React.useCallback(async (prompt: string): Promise<Insight> => {
    setLoading(true);
    try {
      const response = await fetch('/api/insights/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (!response.ok) throw new Error('Failed to generate insight');
      const data = await response.json();
      setInsights((prev) => [data, ...prev]);
      setError(null);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteInsight = React.useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/insights/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete insight');
      setInsights((prev) => prev.filter((i) => i.id !== id));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  return (
    <InsightsContext.Provider value={{ insights, loading, error, fetchInsights, generateInsight, deleteInsight }}>
      {children}
    </InsightsContext.Provider>
  );
}

export function useInsights() {
  const context = useContext(InsightsContext);
  if (context === undefined) {
    throw new Error('useInsights must be used within an InsightsProvider');
  }
  return context;
}
