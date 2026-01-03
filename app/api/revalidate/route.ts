import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, action } = body;
    
    // Validate type
    if (!type || !['news', 'analyses'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be "news" or "analyses"' },
        { status: 400 }
      );
    }

    // Revalidate relevant paths
    revalidatePath('/'); // Homepage
    revalidatePath(`/${type}`); // List page (e.g., /news or /analysen)
    
    // If a specific slug is provided, revalidate that too
    if (body.slug) {
      revalidatePath(`/${type}/${body.slug}`);
    }

    console.log(`✅ Revalidated paths for ${type}${body.slug ? ` (${body.slug})` : ''}`);

    return NextResponse.json({ 
      revalidated: true,
      paths: ['/', `/${type}`, body.slug ? `/${type}/${body.slug}` : null].filter(Boolean),
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { error: 'Failed to revalidate', details: error.message },
      { status: 500 }
    );
  }
}