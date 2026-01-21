'use client';

import React, { createContext, useContext, ReactNode } from 'react';

interface Share {
  id: string;
  user_id: string;
  goal_id: string;
  shared_user_id: string;
  shared_at: Date;
  access_type: 'view' | 'edit';
  metadata?: Record<string, unknown>;
}

interface GoalSharingContextType {
  shares: Share[];
  loading: boolean;
  error: string | null;
  fetchShares: () => Promise<void>;
  shareGoal: (goalId: string, userId: string, accessType: 'view' | 'edit') => Promise<Share>;
  updateShare: (shareId: string, accessType: 'view' | 'edit') => Promise<Share>;
  revokeShare: (shareId: string) => Promise<void>;
  getSharedGoals: () => Promise<void>;
}

const GoalSharingContext = createContext<GoalSharingContextType | undefined>(undefined);

export function GoalSharingProvider({ children }: { children: ReactNode }) {
  const [shares, setShares] = React.useState<Share[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchShares = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/goal-sharing/my-shares');
      if (!response.ok) throw new Error('Failed to fetch shares');
      const data = await response.json();
      setShares(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const shareGoal = React.useCallback(async (goalId: string, userId: string, accessType: 'view' | 'edit'): Promise<Share> => {
    setLoading(true);
    try {
      const response = await fetch('/api/goal-sharing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal_id: goalId, shared_user_id: userId, access_type: accessType }),
      });
      if (!response.ok) throw new Error('Failed to share goal');
      const data = await response.json();
      setShares((prev) => [data, ...prev]);
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

  const updateShare = React.useCallback(async (shareId: string, accessType: 'view' | 'edit'): Promise<Share> => {
    setLoading(true);
    try {
      const response = await fetch(`/api/goal-sharing/${shareId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_type: accessType }),
      });
      if (!response.ok) throw new Error('Failed to update share');
      const data = await response.json();
      setShares((prev) => prev.map((s) => (s.id === shareId ? data : s)));
      setError(null);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const revokeShare = React.useCallback(async (shareId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/goal-sharing/${shareId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to revoke share');
      setShares((prev) => prev.filter((s) => s.id !== shareId));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const getSharedGoals = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/goal-sharing/shared-with-me');
      if (!response.ok) throw new Error('Failed to fetch shared goals');
      const data = await response.json();
      setShares(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchShares();
  }, [fetchShares]);

  return (
    <GoalSharingContext.Provider value={{ shares, loading, error, fetchShares, shareGoal, updateShare, revokeShare, getSharedGoals }}>
      {children}
    </GoalSharingContext.Provider>
  );
}

export function useGoalSharing() {
  const context = useContext(GoalSharingContext);
  if (context === undefined) {
    throw new Error('useGoalSharing must be used within a GoalSharingProvider');
  }
  return context;
}
