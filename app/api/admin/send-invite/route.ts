import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

import { isAdminUserId } from "@/lib/admin";
import { buildInviteLink } from "@/lib/inviteManagement";
import { getAppUrl } from "@/lib/server/appUrl";
import {
  buildRateLimitHeaders,
  createMemoryRateLimiter,
  getRateLimitKey,
} from "@/lib/server/rateLimit";
import { hasTrustedOrigin } from "@/lib/server/requestOrigin";
import { sendInviteEmail } from "@/lib/server/resend";

const requestSchema = z.object({
  email: z.string().email(),
  invitedPlan: z.union([z.literal("pro"), z.literal("ultra")]),
  token: z.string().min(1),
});

const adminInviteRateLimiter = createMemoryRateLimiter({
  maxRequests: Number(process.env.RATE_LIMIT_ADMIN_INVITE_MAX ?? 5),
  windowMs: Number(process.env.RATE_LIMIT_ADMIN_INVITE_WINDOW_MS ?? 60_000),
});

const buildInviteResponseHeaders = (
  rateLimitResult: ReturnType<typeof adminInviteRateLimiter.check>,
) => ({
  ...buildRateLimitHeaders(rateLimitResult),
  "Cache-Control": "no-store",
});

const inviteJson = (
  body: Record<string, unknown>,
  {
    rateLimitResult,
    status,
  }: {
    rateLimitResult: ReturnType<typeof adminInviteRateLimiter.check>;
    status?: number;
  },
) =>
  NextResponse.json(body, {
    status,
    headers: buildInviteResponseHeaders(rateLimitResult),
  });

export const POST = async (request: Request) => {
  const { userId } = await auth();

  if (!isAdminUserId(userId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const rateLimitResult = adminInviteRateLimiter.check(
    getRateLimitKey({
      request,
      prefix: "admin-send-invite",
      suffix: userId,
    }),
  );

  if (!rateLimitResult.allowed) {
    return inviteJson(
      { error: "Too many requests" },
      { status: 429, rateLimitResult },
    );
  }

  if (!hasTrustedOrigin(request)) {
    return inviteJson({ error: "Forbidden" }, { status: 403, rateLimitResult });
  }

  let json: unknown;

  try {
    json = await request.json();
  } catch {
    return inviteJson(
      { error: "Invalid request" },
      { status: 400, rateLimitResult },
    );
  }

  const parsed = requestSchema.safeParse(json);

  if (!parsed.success) {
    return inviteJson(
      { error: "Invalid request" },
      { status: 400, rateLimitResult },
    );
  }

  const inviteLink = buildInviteLink({
    appUrl: getAppUrl(),
    token: parsed.data.token,
  });

  try {
    await sendInviteEmail({
      email: parsed.data.email,
      invitedPlan: parsed.data.invitedPlan,
      inviteLink,
    });
  } catch (error) {
    console.error("Failed to send invite email:", error);
    return inviteJson(
      { error: "Failed to send invite email" },
      { status: 502, rateLimitResult },
    );
  }

  return inviteJson({ ok: true }, { rateLimitResult });
};
