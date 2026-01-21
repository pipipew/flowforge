import React from 'react';
import { Briefcase, BookOpen, Code, Palette, BookMarked } from 'lucide-react';

type SessionCategory = 'work' | 'study' | 'code' | 'creative' | 'reading';

interface CategoryOption {
  value: SessionCategory;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const CATEGORIES: CategoryOption[] = [
  { value: 'work', label: 'Work', icon: <Briefcase size={24} />, color: 'bg-blue-500' },
  { value: 'study', label: 'Study', icon: <BookOpen size={24} />, color: 'bg-purple-500' },
  { value: 'code', label: 'Code', icon: <Code size={24} />, color: 'bg-green-500' },
  { value: 'creative', label: 'Creative', icon: <Palette size={24} />, color: 'bg-pink-500' },
  { value: 'reading', label: 'Reading', icon: <BookMarked size={24} />, color: 'bg-amber-500' }
];

interface CategorySelectorProps {
  selected: SessionCategory;
  onSelect: (category: SessionCategory) => void;
  disabled?: boolean;
}

export function CategorySelector({ selected, onSelect, disabled = false }: CategorySelectorProps) {
  return (
    <div className="py-6">
      <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">Session Category</h3>
      <div className="flex gap-3 justify-center flex-wrap">
        {CATEGORIES.map((category) => (
          <button
            key={category.value}
            onClick={() => onSelect(category.value)}
            disabled={disabled}
            className={`flex flex-col items-center gap-2 px-4 py-3 rounded-lg transition-all ${
              selected === category.value
                ? `${category.color} text-white shadow-lg scale-105`
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            } ${
              disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            {category.icon}
            <span className="text-xs font-medium">{category.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
