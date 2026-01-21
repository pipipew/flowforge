'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Flame, Target, Zap } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  type: 'milestone' | 'streak' | 'milestone-complete' | 'sharing' | 'other';
  unlockedAt: string;
  icon?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AchievementCardProps {
  achievement: Achievement;
  isNew?: boolean;
}

const achievementIcons: Record<string, React.FC<{className?: string}>> = {
  milestone: Trophy,
  streak: Flame,
  'milestone-complete': Star,
  sharing: Zap,
  other: Target,
};

const rarityStyles: Record<string, {bg: string; border: string; text: string}> = {
  common: {
    bg: 'bg-gray-100',
    border: 'border-gray-300',
    text: 'text-gray-700',
  },
  rare: {
    bg: 'bg-blue-100',
    border: 'border-blue-400',
    text: 'text-blue-700',
  },
  epic: {
    bg: 'bg-purple-100',
    border: 'border-purple-500',
    text: 'text-purple-700',
  },
  legendary: {
    bg: 'bg-yellow-100',
    border: 'border-yellow-600',
    text: 'text-yellow-900',
  },
};

const rarityBadgeStyles: Record<string, string> = {
  common: 'bg-gray-200 text-gray-800',
  rare: 'bg-blue-200 text-blue-900',
  epic: 'bg-purple-200 text-purple-900',
  legendary: 'bg-yellow-200 text-yellow-900',
};

export const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  isNew = false,
}) => {
  const rarityStyle = rarityStyles[achievement.rarity];
  const IconComponent = achievementIcons[achievement.type];
  const unlockedDate = new Date(achievement.unlockedAt);
  const isRecentlyUnlocked = Date.now() - unlockedDate.getTime() < 24 * 60 * 60 * 1000;

  return (
    <Card
      className={`
        relative overflow-hidden transition-all duration-300 hover:shadow-lg
        ${rarityStyle.bg} ${rarityStyle.border} border-2
        ${isRecentlyUnlocked ? 'ring-2 ring-yellow-400 ring-offset-2' : ''}
      `}
    >
      {/* Glow effect for new achievements */}
      {isNew && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse" />
      )}

      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className={`text-lg font-bold ${rarityStyle.text}`}>
              {achievement.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {achievement.description}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <Badge className={rarityBadgeStyles[achievement.rarity]}>
                {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
              </Badge>
              {isRecentlyUnlocked && (
                <Badge variant="default" className="bg-green-500 text-white">
                  New!
                </Badge>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Unlocked {unlockedDate.toLocaleDateString()}
            </div>
          </div>
          <div className={`flex-shrink-0 p-3 rounded-lg ${rarityStyle.bg}`}>
            {IconComponent ? (
              <IconComponent className={`w-8 h-8 ${rarityStyle.text}`} />
            ) : (
              <Trophy className={`w-8 h-8 ${rarityStyle.text}`} />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/* Grid component for displaying multiple achievements */
interface AchievementsGridProps {
  achievements: Achievement[];
  title?: string;
  emptyMessage?: string;
}

export const AchievementsGrid: React.FC<AchievementsGridProps> = ({
  achievements,
  title = 'Achievements',
  emptyMessage = 'No achievements unlocked yet. Keep working on your goals!',
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        {achievements.length > 0 && (
          <p className="text-gray-600 mt-1">
            You have unlocked {achievements.length} achievement{achievements.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {achievements.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map(achievement => {
            const isNew = Date.now() - new Date(achievement.unlockedAt).getTime() < 24 * 60 * 60 * 1000;
            return (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                isNew={isNew}
              />
            );
          })}
        </div>
      )}

      {/* Rarity Distribution */}
      {achievements.length > 0 && (
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-gray-200">
          <h3 className="font-semibold mb-3">Achievements by Rarity</h3>
          <div className="grid grid-cols-4 gap-2">
            {(['common', 'rare', 'epic', 'legendary'] as const).map(rarity => {
              const count = achievements.filter(a => a.rarity === rarity).length;
              return (
                <div key={rarity} className="text-center p-3 bg-white rounded border">
                  <div className="text-lg font-bold">{count}</div>
                  <div className="text-xs text-gray-600 capitalize">
                    {rarity}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
