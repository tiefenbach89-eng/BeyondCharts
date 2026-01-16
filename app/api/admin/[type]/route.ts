import { NextRequest, NextResponse } from "next/server";
import { listContent, upsertContent, deleteContent } from "@/lib/content.server";
import { getSettings } from "@/lib/settings.server";
import { processImageUrl } from "@/lib/imageStorage";
import { requireAdmin } from "@/lib/auth.middleware";
import { sanitizeContent, checkRateLimit } from "@/lib/validation";

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
  // Check admin authentication
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) {
    return authResult; // Return error response
  }

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
  // Check admin authentication
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) {
    return authResult; // Return error response
  }

  // Rate limiting (10 requests per minute per user)
  const userId = authResult.user.id;
  const rateLimit = checkRateLimit(`admin:${userId}`, 20, 60000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please try again later." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": new Date(rateLimit.resetTime).toISOString(),
        }
      }
    );
  }

  const { type } = await context.params;
  const contentType = type as ContentType;

  const body = await request.json();

  // Sanitize input to prevent XSS
  const sanitizedBody = sanitizeContent(body);

  const settings = await getSettings();

  const error = validatePayload(contentType, sanitizedBody, settings);
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  if (sanitizedBody.imageUrl) {
    sanitizedBody.imageUrl = await processImageUrl(sanitizedBody.imageUrl);
  }

  if (contentType === "analyses" && sanitizedBody.snapshot) {
    sanitizedBody.analysis = {
      overview: sanitizedBody.snapshot.thesis || "",
      businessModel: sanitizedBody.snapshot.profitability || "",
      risks: sanitizedBody.snapshot.risk || "",
      scenarios: sanitizedBody.snapshot.substance || "",
    };
    delete sanitizedBody.snapshot;
  }

  const item = await upsertContent(contentType, sanitizedBody);

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
  // Check admin authentication
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) {
    return authResult; // Return error response
  }

  // Rate limiting (10 requests per minute per user)
  const userId = authResult.user.id;
  const rateLimit = checkRateLimit(`admin:${userId}`, 20, 60000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please try again later." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": new Date(rateLimit.resetTime).toISOString(),
        }
      }
    );
  }

  const { type } = await context.params;
  const contentType = type as ContentType;

  const body = await request.json();

  // Sanitize input to prevent XSS
  const sanitizedBody = sanitizeContent(body);

  const settings = await getSettings();

  const error = validatePayload(contentType, sanitizedBody, settings);
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  if (sanitizedBody.imageUrl) {
    try {
      sanitizedBody.imageUrl = await processImageUrl(sanitizedBody.imageUrl);
    } catch (err) {
      console.error("❌ Image processing failed:", err);
    }
  }

  if (contentType === "analyses" && sanitizedBody.snapshot) {
    sanitizedBody.analysis = {
      overview: sanitizedBody.snapshot.thesis || "",
      businessModel: sanitizedBody.snapshot.profitability || "",
      risks: sanitizedBody.snapshot.risk || "",
      scenarios: sanitizedBody.snapshot.substance || "",
    };
    delete sanitizedBody.snapshot;
  }

  const item = await upsertContent(contentType, sanitizedBody);

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
  // Check admin authentication
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) {
    return authResult; // Return error response
  }

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
