import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/* GET /api/goals - Fetch all goals for the current user */
export async function GET(request: NextRequest) {
  try {
    const session = await request.headers.get('Authorization');
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: goals, error } = await supabase
      .from('goals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ goals });
  } catch (error) {
    console.error('Error fetching goals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch goals' },
      { status: 500 }
    );
  }
}

/* POST /api/goals - Create a new goal */
export async function POST(request: NextRequest) {
  try {
    const session = await request.headers.get('Authorization');
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, category, targetDate, userId } = body;

    if (!title || !targetDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data: goal, error } = await supabase
      .from('goals')
      .insert([
        {
          user_id: userId,
          title,
          description,
          category,
          target_date: targetDate,
          progress: 0,
          status: 'active',
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json(
      { goal: goal?.[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating goal:', error);
    return NextResponse.json(
      { error: 'Failed to create goal' },
      { status: 500 }
    );
  }
}

/* PATCH /api/goals - Update goal (progress, status) */
export async function PATCH(request: NextRequest) {
  try {
    const session = await request.headers.get('Authorization');
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { goalId, progress, status, title, description } = body;

    if (!goalId) {
      return NextResponse.json(
        { error: 'Goal ID is required' },
        { status: 400 }
      );
    }

    const updateData: Record<string, any> = {};
    if (progress !== undefined) updateData.progress = progress;
    if (status) updateData.status = status;
    if (title) updateData.title = title;
    if (description) updateData.description = description;

    const { data: goal, error } = await supabase
      .from('goals')
      .update(updateData)
      .eq('id', goalId)
      .select();

    if (error) throw error;

    return NextResponse.json({ goal: goal?.[0] });
  } catch (error) {
    console.error('Error updating goal:', error);
    return NextResponse.json(
      { error: 'Failed to update goal' },
      { status: 500 }
    );
  }
}

/* DELETE /api/goals - Delete a goal */
export async function DELETE(request: NextRequest) {
  try {
    const session = await request.headers.get('Authorization');
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const goalId = searchParams.get('id');

    if (!goalId) {
      return NextResponse.json(
        { error: 'Goal ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', goalId);

    if (error) throw error;

    return NextResponse.json(
      { message: 'Goal deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting goal:', error);
    return NextResponse.json(
      { error: 'Failed to delete goal' },
      { status: 500 }
    );
  }
}
