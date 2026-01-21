'use client';

import React from 'react';
import { useInsights } from '@/providers/InsightsProvider';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface Insight {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  generated_at: Date;
  metadata?: Record<string, unknown>;
}

export function InsightsDashboard() {
  const { insights, loading, error, fetchInsights } = useInsights();

  React.useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 bg-red-50 border border-red-200">
        <h3 className="text-lg font-semibold text-red-900">Error Loading Insights</h3>
        <p className="text-red-700 mt-2">{error}</p>
        <Button onClick={fetchInsights} className="mt-4" variant="outline">
          Retry
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">AI-Powered Insights</h2>
        <Button onClick={fetchInsights} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      {insights.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600">No insights generated yet. Keep tracking your habits!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {insights.map((insight: Insight) => (
            <Card key={insight.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{insight.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(insight.generated_at).toLocaleDateString()}
                  </p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {insight.category}
                </span>
              </div>
              <p className="text-gray-700 mt-4">{insight.description}</p>
              {insight.metadata && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <details className="text-sm text-gray-600">
                    <summary className="cursor-pointer font-medium">View Details</summary>
                    <pre className="mt-2 bg-gray-50 p-3 rounded text-xs overflow-auto">
                      {JSON.stringify(insight.metadata, null, 2)}
                    </pre>
                  </details>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
