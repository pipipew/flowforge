'use client';

import React, { createContext, useContext, ReactNode } from 'react';

interface Connection {
  id: string;
  user_id: string;
  connected_user_id: string;
  status: 'pending' | 'accepted' | 'blocked';
  connected_at: Date;
  metadata?: Record<string, unknown>;
}

interface SocialContextType {
  connections: Connection[];
  loading: boolean;
  error: string | null;
  fetchConnections: () => Promise<void>;
  sendConnectionRequest: (userId: string) => Promise<Connection>;
  acceptConnection: (connectionId: string) => Promise<Connection>;
  rejectConnection: (connectionId: string) => Promise<void>;
  blockUser: (userId: string) => Promise<void>;
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

export function SocialConnectionsProvider({ children }: { children: ReactNode }) {
  const [connections, setConnections] = React.useState<Connection[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchConnections = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/social/connections');
      if (!response.ok) throw new Error('Failed to fetch connections');
      const data = await response.json();
      setConnections(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const sendConnectionRequest = React.useCallback(async (userId: string): Promise<Connection> => {
    setLoading(true);
    try {
      const response = await fetch('/api/social/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connected_user_id: userId, status: 'pending' }),
      });
      if (!response.ok) throw new Error('Failed to send connection request');
      const data = await response.json();
      setConnections((prev) => [data, ...prev]);
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

  const acceptConnection = React.useCallback(async (connectionId: string): Promise<Connection> => {
    setLoading(true);
    try {
      const response = await fetch(`/api/social/connections/${connectionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'accepted' }),
      });
      if (!response.ok) throw new Error('Failed to accept connection');
      const data = await response.json();
      setConnections((prev) => prev.map((c) => (c.id === connectionId ? data : c)));
      setError(null);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const rejectConnection = React.useCallback(async (connectionId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/social/connections/${connectionId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to reject connection');
      setConnections((prev) => prev.filter((c) => c.id !== connectionId));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const blockUser = React.useCallback(async (userId: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/social/connections/block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
      });
      if (!response.ok) throw new Error('Failed to block user');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  return (
    <SocialContext.Provider value={{ connections, loading, error, fetchConnections, sendConnectionRequest, acceptConnection, rejectConnection, blockUser }}>
      {children}
    </SocialContext.Provider>
  );
}

export function useSocialConnections() {
  const context = useContext(SocialContext);
  if (context === undefined) {
    throw new Error('useSocialConnections must be used within a SocialConnectionsProvider');
  }
  return context;
}
