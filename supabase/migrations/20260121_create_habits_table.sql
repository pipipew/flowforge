-- Week 3: Habit Tracking System Database Schema

-- Create habits table
CREATE TABLE public.habits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL DEFAULT 'health', -- health, work, learning, wellness, fitness, etc.
    color VARCHAR(7) DEFAULT '#3b82f6', -- TailwindCSS color hex
    icon VARCHAR(50) DEFAULT 'target', -- icon name
    frequency VARCHAR(50) NOT NULL DEFAULT 'daily', -- daily, weekly, etc.
    target_days INTEGER DEFAULT 7, -- days per week
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN DEFAULT TRUE,
    archived_at TIMESTAMP WITH TIME ZONE
);

-- Create habit check-ins table (daily completion records)
CREATE TABLE public.habit_checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    notes VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(habit_id, date) -- One check-in per habit per day
);

-- Create habit streaks table (track consecutive completions)
CREATE TABLE public.habit_streaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE,
    count INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(habit_id, start_date)
);

-- Create habit history table (for analytics)
CREATE TABLE public.habit_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    month DATE NOT NULL, -- First day of month
    completed_days INTEGER DEFAULT 0,
    total_days INTEGER DEFAULT 0,
    completion_rate FLOAT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(habit_id, month)
);

-- Create indexes for better query performance
CREATE INDEX idx_habits_user_id ON public.habits(user_id);
CREATE INDEX idx_habits_user_active ON public.habits(user_id, active);
CREATE INDEX idx_checkins_habit_id ON public.habit_checkins(habit_id);
CREATE INDEX idx_checkins_user_date ON public.habit_checkins(user_id, date);
CREATE INDEX idx_streaks_habit_id ON public.habit_streaks(habit_id);
CREATE INDEX idx_history_habit_id ON public.habit_history(habit_id);

-- Enable RLS (Row Level Security)
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for habits
CREATE POLICY "Users can create habits" ON public.habits
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their habits" ON public.habits
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their habits" ON public.habits
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their habits" ON public.habits
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for habit_checkins
CREATE POLICY "Users can create checkins" ON public.habit_checkins
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their checkins" ON public.habit_checkins
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their checkins" ON public.habit_checkins
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for habit_streaks
CREATE POLICY "Users can view their streaks" ON public.habit_streaks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their streaks" ON public.habit_streaks
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for habit_history
CREATE POLICY "Users can view their history" ON public.habit_history
    FOR SELECT USING (auth.uid() = user_id);

