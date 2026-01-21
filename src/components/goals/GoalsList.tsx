'use client';

import React, { useState, useMemo } from 'react';
import { GoalProgressCard } from './GoalProgressCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Loader } from 'lucide-react';

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

interface GoalsListProps {
  goals: Goal[];
  isLoading?: boolean;
  onAddGoal?: () => void;
  onEditGoal?: (goal: Goal) => void;
  onShareGoal?: (goal: Goal) => void;
  onUpdateProgress?: (goalId: string, progress: number) => void;
}

export const GoalsList: React.FC<GoalsListProps> = ({
  goals,
  isLoading = false,
  onAddGoal,
  onEditGoal,
  onShareGoal,
  onUpdateProgress,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'paused'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'progress' | 'deadline'>('date');

  const filteredAndSortedGoals = useMemo(() => {
    let filtered = goals.filter(goal => {
      const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           goal.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || goal.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || goal.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });

    // Sort
    if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'progress') {
      filtered.sort((a, b) => b.progress - a.progress);
    } else if (sortBy === 'deadline') {
      filtered.sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime());
    }

    return filtered;
  }, [goals, searchTerm, statusFilter, categoryFilter, sortBy]);

  const categories = Array.from(new Set(goals.map(g => g.category)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Goals</h2>
          <p className="text-gray-600 mt-1">Track and manage your personal and professional goals</p>
        </div>
        {onAddGoal && (
          <Button onClick={onAddGoal}>
            <Plus className="w-4 h-4 mr-2" />
            New Goal
          </Button>
        )}
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Search Goals</label>
          <Input
            type="text"
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Sort By</label>
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Recent First</SelectItem>
                <SelectItem value="progress">Progress (High to Low)</SelectItem>
                <SelectItem value="deadline">Deadline (Soonest)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      ) : filteredAndSortedGoals.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-lg">
            {goals.length === 0 ? 'No goals yet. Create your first goal!' : 'No goals match your filters.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredAndSortedGoals.map(goal => (
            <GoalProgressCard
              key={goal.id}
              goal={goal}
              onEdit={onEditGoal}
              onShare={onShareGoal}
              onUpdateProgress={onUpdateProgress}
            />
          ))}
        </div>
      )}

      {/* Stats Footer */}
      {filteredAndSortedGoals.length > 0 && (
        <div className="grid grid-cols-4 gap-4 pt-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
            <div className="text-sm text-green-600">Active</div>
            <div className="text-2xl font-bold text-green-700">
              {filteredAndSortedGoals.filter(g => g.status === 'active').length}
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
            <div className="text-sm text-blue-600">Completed</div>
            <div className="text-2xl font-bold text-blue-700">
              {filteredAndSortedGoals.filter(g => g.status === 'completed').length}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-sm text-gray-600">Paused</div>
            <div className="text-2xl font-bold text-gray-700">
              {filteredAndSortedGoals.filter(g => g.status === 'paused').length}
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 text-center">
            <div className="text-sm text-purple-600">Avg Progress</div>
            <div className="text-2xl font-bold text-purple-700">
              {Math.round(
                filteredAndSortedGoals.reduce((sum, g) => sum + g.progress, 0) /
                filteredAndSortedGoals.length
              )}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
