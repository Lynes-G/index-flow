import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

import { isAdminUserId } from "@/lib/admin";
import { buildInviteLink } from "@/lib/inviteManagement";
import { sendInviteEmail } from "@/lib/server/resend";

const requestSchema = z.object({
  email: z.string().email(),
  invitedPlan: z.union([z.literal("pro"), z.literal("ultra")]),
  token: z.string().min(1),
});

export const POST = async (request: Request) => {
  const { userId } = await auth();

  if (!isAdminUserId(userId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const json = await request.json();
  const parsed = requestSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

  const inviteLink = buildInviteLink({
    appUrl,
    token: parsed.data.token,
  });

  await sendInviteEmail({
    email: parsed.data.email,
    invitedPlan: parsed.data.invitedPlan,
    inviteLink,
  });

  return NextResponse.json({ ok: true });
};
