import { NextRequest, NextResponse } from "next/server";
import { listContent, upsertContent, deleteContent } from "@/lib/content.server";
import { getSettings } from "@/lib/settings.server";
import { processImageUrl } from "@/lib/imageStorage";

type ContentType = "news" | "analyses";

export async function GET(
  req: NextRequest,
  { params }: { params: { type: ContentType } }
) {
  const url = new URL(req.url);
  const includeDrafts = url.searchParams.get("includeDrafts") === "1";

  const items = await listContent(params.type, {
    includeDrafts,
  });

  return NextResponse.json(items);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { type: ContentType } }
) {
  const body = await req.json();
  const settings = await getSettings();

  const error = validatePayload(params.type, body, settings);
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  // Process image URL (convert base64 to file if needed)
  if (body.imageUrl) {
    body.imageUrl = await processImageUrl(body.imageUrl);
  }

  // Convert snapshot to analysis for analyses type
  if (params.type === 'analyses' && body.snapshot) {
    body.analysis = {
      overview: body.snapshot.thesis || '',
      businessModel: body.snapshot.profitability || '',
      risks: body.snapshot.risk || '',
      scenarios: body.snapshot.substance || '',
    };
    delete body.snapshot;
  }

  const item = await upsertContent(params.type, body);
  return NextResponse.json(item);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { type: ContentType } }
) {
  const body = await req.json();
  
  // 🔍 DEBUG LOG - Was kommt rein?
  console.log('📦 PUT Request received:');
  console.log('   Title:', body.title);
  console.log('   Has imageUrl?', !!body.imageUrl);
  console.log('   ImageUrl type:', typeof body.imageUrl);
  console.log('   ImageUrl length:', body.imageUrl?.length || 0);
  console.log('   ImageUrl preview:', body.imageUrl?.substring(0, 80));
  
  const settings = await getSettings();

  const error = validatePayload(params.type, body, settings);
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  // Process image URL (convert base64 to file if needed)
  if (body.imageUrl) {
    try {
      console.log('🖼️ Starting image processing...');
      const originalUrl = body.imageUrl;
      body.imageUrl = await processImageUrl(body.imageUrl);
      console.log('✅ Image processed!');
      console.log('   Before:', originalUrl.substring(0, 50));
      console.log('   After:', body.imageUrl);
    } catch (err) {
      console.error('❌ Image processing ERROR:', err);
      console.error('   Error message:', err instanceof Error ? err.message : 'Unknown error');
      // Keep original URL if processing fails
    }
  } else {
    console.log('⚠️ No imageUrl in body');
  }

  // Convert snapshot to analysis for analyses type
  if (params.type === 'analyses' && body.snapshot) {
    body.analysis = {
      overview: body.snapshot.thesis || '',
      businessModel: body.snapshot.profitability || '',
      risks: body.snapshot.risk || '',
      scenarios: body.snapshot.substance || '',
    };
    delete body.snapshot;
  }

  console.log('💾 Saving to DB with imageUrl:', body.imageUrl);

  const item = await upsertContent(params.type, body);
  
  console.log('✅ Saved! Returned imageUrl:', item.imageUrl);
  
  return NextResponse.json(item);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { type: ContentType } }
) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  await deleteContent(params.type, id);
  return NextResponse.json({ ok: true });
}

/* ===================== VALIDATION ===================== */

function validatePayload(
  type: ContentType,
  payload: any,
  settings: any
): string | null {
  // 1. Publish nur mit Audit
  if (payload.status === "published") {
    if (payload.auditStatus !== "approved") {
      return "Beitrag muss vor Veröffentlichung freigegeben werden.";
    }
  }

  // 2. Externe News brauchen Quelle + Link
  if (type === "news") {
    const requireSource =
      settings?.legal?.requireSourceForExternalNews !== false;

    if (requireSource && payload.sourceType === "external") {
      if (!payload.source || !payload.source.trim()) {
        return "Quelle ist erforderlich (externe News).";
      }
      if (!payload.sourceUrl || !isValidHttpUrl(payload.sourceUrl)) {
        return "Gültiger Quellen-Link ist erforderlich (externe News).";
      }
    }
  }

  // 3. Premium darf gesetzt sein, aber Feature kann deaktiviert sein
  // (kein Block – nur Content-Flag)

  return null;
}

function isValidHttpUrl(maybeUrl: string) {
  try {
    const u = new URL(maybeUrl);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}