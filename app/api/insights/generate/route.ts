import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@/lib/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const openaiApiKey = process.env.OPENAI_API_KEY!;

export async function POST(req: NextRequest) {
  try {
    const session = await auth.getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Call OpenAI API to generate insight
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
      }),
    });

    if (!response.ok) throw new Error('OpenAI API error');
    const data = await response.json();
    const content = data.choices[0].message.content;

    // Save to database
    const { data: insight, error: insertError } = await supabase
      .from('ai_insights')
      .insert({
        user_id: session.user.id,
        title: prompt.substring(0, 100),
        description: content,
        category: 'ai_generated',
        generated_at: new Date(),
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return NextResponse.json(insight);
  } catch (error) {
    console.error('Error generating insight:', error);
    return NextResponse.json(
      { error: 'Failed to generate insight' },
      { status: 500 }
    );
  }
}
