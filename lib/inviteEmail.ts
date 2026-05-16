export const normalizeInviteEmail = (email: string) => email.trim().toLowerCase();

export const maskInviteEmail = (email: string) => {
  const normalizedEmail = normalizeInviteEmail(email);
  const [localPart, domain] = normalizedEmail.split("@");

  if (!localPart || !domain) {
    return normalizedEmail;
  }

  const visibleLocalPart =
    localPart.length <= 2
      ? `${localPart[0] ?? ""}*`
      : `${localPart.slice(0, 2)}${"*".repeat(localPart.length - 2)}`;

  return `${visibleLocalPart}@${domain}`;
};
