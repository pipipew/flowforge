'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Medal, TrendingUp } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  initials: string;
  rank: number;
  score: number;
  goalsCompleted: number;
  achievementsCount: number;
  isCurrentUser?: boolean;
}

interface LeaderboardCardProps {
  title?: string;
  entries: LeaderboardEntry[];
  isLoading?: boolean;
}

const getRankBadgeColor = (rank: number): {bg: string; text: string; icon: string} => {
  if (rank === 1) return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '🥇' };
  if (rank === 2) return { bg: 'bg-gray-200', text: 'text-gray-800', icon: '🥈' };
  if (rank === 3) return { bg: 'bg-orange-100', text: 'text-orange-800', icon: '🥉' };
  return { bg: 'bg-blue-50', text: 'text-blue-800', icon: '' };
};

export const LeaderboardCard: React.FC<LeaderboardCardProps> = ({
  title = 'Leaderboard',
  entries = [],
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Medal className="w-5 h-5" />
          {title}
        </CardTitle>
        <CardDescription>
          Top performers this month
        </CardDescription>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No leaderboard entries yet
          </div>
        ) : (
          <div className="space-y-2">
            {entries.slice(0, 10).map((entry) => {
              const rankStyle = getRankBadgeColor(entry.rank);
              return (
                <div
                  key={entry.id}
                  className={`
                    flex items-center justify-between p-3 rounded-lg border transition-all
                    ${entry.isCurrentUser 
                      ? 'border-blue-300 bg-blue-50 shadow-md' 
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Rank Badge */}
                    <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full font-bold ${rankStyle.bg} ${rankStyle.text}`}>
                      {rankStyle.icon || entry.rank}
                    </div>

                    {/* User Info */}
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Avatar className="w-8 h-8">
                        {entry.avatar && <AvatarImage src={entry.avatar} />}
                        <AvatarFallback>{entry.initials}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="font-medium text-sm truncate">
                          {entry.username}
                          {entry.isCurrentUser && (
                            <Badge className="ml-2 bg-blue-500 text-white text-xs">You</Badge>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {entry.goalsCompleted} goals · {entry.achievementsCount} achievements
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="flex-shrink-0 ml-2 text-right">
                    <div className="flex items-center gap-1 font-bold text-lg text-blue-600">
                      <TrendingUp className="w-4 h-4" />
                      {entry.score}
                    </div>
                    <div className="text-xs text-gray-500">pts</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

/* Leaderboard Grid for multiple time periods */
interface LeaderboardsGridProps {
  allTimeLeaderboard: LeaderboardEntry[];
  monthlyLeaderboard: LeaderboardEntry[];
  weeklyLeaderboard: LeaderboardEntry[];
  isLoading?: boolean;
}

export const LeaderboardsGrid: React.FC<LeaderboardsGridProps> = ({
  allTimeLeaderboard,
  monthlyLeaderboard,
  weeklyLeaderboard,
  isLoading = false,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <LeaderboardCard
        title="Weekly Leaders"
        entries={weeklyLeaderboard}
        isLoading={isLoading}
      />
      <LeaderboardCard
        title="Monthly Leaders"
        entries={monthlyLeaderboard}
        isLoading={isLoading}
      />
      <LeaderboardCard
        title="All Time Leaders"
        entries={allTimeLeaderboard}
        isLoading={isLoading}
      />
    </div>
  );
};
