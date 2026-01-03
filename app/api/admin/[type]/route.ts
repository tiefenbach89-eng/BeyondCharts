import { NextRequest, NextResponse } from "next/server";
import { listContent, upsertContent, deleteContent } from "@/lib/content.server";
import { getSettings } from "@/lib/settings.server";
import { processImageUrl } from "@/lib/imageStorage";

export const runtime = "nodejs";

type ContentType = "news" | "analyses";

/* ===================== REVALIDATION ===================== */

async function triggerRevalidation(
  type: ContentType,
  slug?: string,
  action?: string
) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

    await fetch(`${baseUrl}/api/revalidate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, slug, action }),
    });
  } catch (err) {
    console.error("⚠️ Revalidation failed (non-critical):", err);
  }
}

/* ===================== GET ===================== */

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ type: string }> }
) {
  const { type } = await context.params;
  const contentType = type as ContentType;

  const includeDrafts =
    request.nextUrl.searchParams.get("includeDrafts") === "1";

  const items = await listContent(contentType, { includeDrafts });

  return NextResponse.json(items);
}

/* ===================== POST ===================== */

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ type: string }> }
) {
  const { type } = await context.params;
  const contentType = type as ContentType;

  const body = await request.json();
  const settings = await getSettings();

  const error = validatePayload(contentType, body, settings);
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  if (body.imageUrl) {
    body.imageUrl = await processImageUrl(body.imageUrl);
  }

  if (contentType === "analyses" && body.snapshot) {
    body.analysis = {
      overview: body.snapshot.thesis || "",
      businessModel: body.snapshot.profitability || "",
      risks: body.snapshot.risk || "",
      scenarios: body.snapshot.substance || "",
    };
    delete body.snapshot;
  }

  const item = await upsertContent(contentType, body);

  if (item.status === "published") {
    await triggerRevalidation(contentType, item.slug, "create");
  }

  return NextResponse.json(item);
}

/* ===================== PUT ===================== */

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ type: string }> }
) {
  const { type } = await context.params;
  const contentType = type as ContentType;

  const body = await request.json();
  const settings = await getSettings();

  const error = validatePayload(contentType, body, settings);
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  if (body.imageUrl) {
    try {
      body.imageUrl = await processImageUrl(body.imageUrl);
    } catch (err) {
      console.error("❌ Image processing failed:", err);
    }
  }

  if (contentType === "analyses" && body.snapshot) {
    body.analysis = {
      overview: body.snapshot.thesis || "",
      businessModel: body.snapshot.profitability || "",
      risks: body.snapshot.risk || "",
      scenarios: body.snapshot.substance || "",
    };
    delete body.snapshot;
  }

  const item = await upsertContent(contentType, body);

  if (item.status === "published") {
    await triggerRevalidation(contentType, item.slug, "update");
  }

  return NextResponse.json(item);
}

/* ===================== DELETE ===================== */

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ type: string }> }
) {
  const { type } = await context.params;
  const contentType = type as ContentType;

  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  await deleteContent(contentType, id);
  await triggerRevalidation(contentType, undefined, "delete");

  return NextResponse.json({ ok: true });
}

/* ===================== VALIDATION ===================== */

function validatePayload(
  type: ContentType,
  payload: any,
  settings: any
): string | null {
  if (payload.status === "published") {
    if (payload.auditStatus !== "approved") {
      return "Beitrag muss vor Veröffentlichung freigegeben werden.";
    }
  }

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
