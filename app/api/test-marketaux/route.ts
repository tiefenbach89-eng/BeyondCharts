// app/api/test-marketaux/route.ts
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const apiToken = process.env.MARKETAUX_API_TOKEN;

  // Check if token exists
  if (!apiToken) {
    return NextResponse.json({
      success: false,
      error: 'MARKETAUX_API_TOKEN not configured',
      hasToken: false,
      tokenLength: 0
    });
  }

  // Test API call
  try {
    const url = `https://api.marketaux.com/v1/news/all?api_token=${apiToken}&limit=3&language=de&filter_entities=true`;

    const response = await fetch(url, {
      cache: 'no-store'
    });

    const data = await response.json();

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      hasToken: true,
      tokenLength: apiToken.length,
      tokenPreview: `${apiToken.substring(0, 8)}...${apiToken.substring(apiToken.length - 4)}`,
      response: data,
      url: url.replace(apiToken, 'HIDDEN')
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      hasToken: true,
      tokenLength: apiToken.length
    }, { status: 500 });
  }
}
