import { fetchWithTimeout, readResponseText } from "./http";

export const buildInviteEmailPayload = ({
  email,
  invitedPlan,
  inviteLink,
  fromEmail,
}: {
  email: string;
  invitedPlan: "pro" | "ultra";
  inviteLink: string;
  fromEmail: string;
}) => ({
  from: fromEmail,
  to: email,
  subject: `You've been invited to IndexFlow ${invitedPlan.toUpperCase()}`,
  html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
      <h1 style="font-size: 24px;">You're invited to IndexFlow ${invitedPlan.toUpperCase()}</h1>
      <p>You have been invited to unlock the ${invitedPlan.toUpperCase()} plan for free.</p>
      <p>Please sign up or sign in with this exact email address: <strong>${email}</strong>.</p>
      <p>
        <a href="${inviteLink}" style="display: inline-block; padding: 12px 20px; background: #111827; color: #ffffff; text-decoration: none; border-radius: 8px;">
          Claim your invite
        </a>
      </p>
      <p>If the button does not work, use this link:</p>
      <p><a href="${inviteLink}">${inviteLink}</a></p>
    </div>
  `,
});

export const getResendErrorMessage = ({
  status,
  bodyText,
}: {
  status: number;
  bodyText: string;
}) => {
  try {
    const parsed = JSON.parse(bodyText) as {
      message?: string;
      error?: string;
      name?: string;
    };

    const providerMessage = parsed.message || parsed.error || parsed.name;

    if (providerMessage) {
      return `Failed to send invite email: ${providerMessage}`;
    }
  } catch {
    // Fall through to generic handling.
  }

  if (bodyText.trim()) {
    return `Failed to send invite email: ${bodyText.trim()}`;
  }

  return `Failed to send invite email (HTTP ${status})`;
};

export const sendInviteEmail = async ({
  email,
  invitedPlan,
  inviteLink,
}: {
  email: string;
  invitedPlan: "pro" | "ultra";
  inviteLink: string;
}) => {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.INVITE_FROM_EMAIL;

  if (!resendApiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  if (!fromEmail) {
    throw new Error("INVITE_FROM_EMAIL is not configured");
  }

  const payload = buildInviteEmailPayload({
    email,
    invitedPlan,
    inviteLink,
    fromEmail,
  });

  const response = await fetchWithTimeout(
    "https://api.resend.com/emails",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
    7000,
  );

  if (!response.ok) {
    const bodyText = await readResponseText(response);
    throw new Error(
      getResendErrorMessage({
        status: response.status,
        bodyText,
      }),
    );
  }
};
