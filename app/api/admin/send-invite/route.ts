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
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: {
          ...buildRateLimitHeaders(rateLimitResult),
          "Cache-Control": "no-store",
        },
      },
    );
  }

  if (!hasTrustedOrigin(request)) {
    return NextResponse.json(
      { error: "Forbidden" },
      {
        status: 403,
        headers: {
          ...buildRateLimitHeaders(rateLimitResult),
          "Cache-Control": "no-store",
        },
      },
    );
  }

  let json: unknown;

  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      {
        status: 400,
        headers: {
          ...buildRateLimitHeaders(rateLimitResult),
          "Cache-Control": "no-store",
        },
      },
    );
  }

  const parsed = requestSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request" },
      {
        status: 400,
        headers: {
          ...buildRateLimitHeaders(rateLimitResult),
          "Cache-Control": "no-store",
        },
      },
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
    return NextResponse.json(
      { error: "Failed to send invite email" },
      {
        status: 502,
        headers: {
          ...buildRateLimitHeaders(rateLimitResult),
          "Cache-Control": "no-store",
        },
      },
    );
  }

  return NextResponse.json(
    { ok: true },
    {
      headers: {
        ...buildRateLimitHeaders(rateLimitResult),
        "Cache-Control": "no-store",
      },
    },
  );
};
