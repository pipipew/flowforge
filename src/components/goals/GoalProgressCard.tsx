'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, Target, TrendingUp, Edit2, Share2 } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  targetDate: string;
  progress: number;
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
}

interface GoalProgressCardProps {
  goal: Goal;
  onEdit?: (goal: Goal) => void;
  onShare?: (goal: Goal) => void;
  onUpdateProgress?: (goalId: string, progress: number) => void;
}

const categoryColors: Record<string, string> = {
  personal: 'bg-blue-100 text-blue-800',
  professional: 'bg-purple-100 text-purple-800',
  health: 'bg-green-100 text-green-800',
  financial: 'bg-amber-100 text-amber-800',
  learning: 'bg-pink-100 text-pink-800',
  other: 'bg-gray-100 text-gray-800',
};

const statusIcons = {
  active: <Circle className="w-4 h-4 fill-current" />,
  completed: <CheckCircle className="w-4 h-4" />,
  paused: <Circle className="w-4 h-4" />,
};

const statusColors = {
  active: 'bg-green-50 border-green-200',
  completed: 'bg-blue-50 border-blue-200',
  paused: 'bg-gray-50 border-gray-200',
};

export const GoalProgressCard: React.FC<GoalProgressCardProps> = ({
  goal,
  onEdit,
  onShare,
  onUpdateProgress,
}) => {
  const daysRemaining = Math.ceil(
    (new Date(goal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  
  const isOverdue = daysRemaining < 0;
  const categoryLabel = goal.category.charAt(0).toUpperCase() + goal.category.slice(1);

  return (
    <Card className={`border-l-4 ${statusColors[goal.status]}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            {statusIcons[goal.status]}
            <div className="flex-1">
              <CardTitle className="text-lg">{goal.title}</CardTitle>
              <CardDescription className="mt-1">{goal.description}</CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            {onEdit && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(goal)}
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            )}
            {onShare && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onShare(goal)}
              >
                <Share2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={categoryColors[goal.category]}>
            {categoryLabel}
          </Badge>
          <Badge variant="outline">
            {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
          </Badge>
          {isOverdue && (
            <Badge variant="destructive">Overdue</Badge>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-semibold">{goal.progress}%</span>
          </div>
          <Progress value={goal.progress} className="h-2" />
        </div>

        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="text-center">
            <div className="text-sm text-gray-600">Target</div>
            <div className="font-semibold text-sm mt-1">
              {new Date(goal.targetDate).toLocaleDateString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Days Left</div>
            <div className={`font-semibold text-sm mt-1 ${
              isOverdue ? 'text-red-600' : 'text-green-600'
            }`}>
              {isOverdue ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days`}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Created</div>
            <div className="font-semibold text-sm mt-1">
              {new Date(goal.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {goal.status === 'active' && onUpdateProgress && (
          <div className="flex gap-2 pt-3 border-t">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onUpdateProgress(goal.id, Math.min(goal.progress + 10, 100))}
              className="flex-1"
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              +10%
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onUpdateProgress(goal.id, 100)}
              className="flex-1"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Complete
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
