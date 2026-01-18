// app/api/summarize-news/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { title, description, snippet } = await request.json();

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Combine available content
    const content = `
Titel: ${title}

${description ? `Beschreibung: ${description}` : ''}

${snippet ? `Auszug: ${snippet}` : ''}
    `.trim();

    const message = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: `Du bist ein Finanz-Experte. Fasse die folgende Nachricht kompakt in 3-5 Sätzen zusammen. Fokussiere dich auf die wichtigsten Fakten und Implikationen für Investoren. Antworte NUR auf Deutsch.

${content}

Schreibe eine kompakte Zusammenfassung:`,
        },
      ],
    });

    const summary = message.content[0].type === 'text'
      ? message.content[0].text
      : 'Zusammenfassung konnte nicht generiert werden.';

    return NextResponse.json({
      success: true,
      summary,
    });
  } catch (error: any) {
    console.error('Error generating summary:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate summary',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
