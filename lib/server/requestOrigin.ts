const getExpectedOrigin = (request: Request) => {
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");

  if (!host) {
    return null;
  }

  const protocol = request.headers.get("x-forwarded-proto") ?? "https";
  return `${protocol}://${host}`;
};

export const hasTrustedOrigin = (request: Request) => {
  const origin = request.headers.get("origin");

  if (!origin) {
    return true;
  }

  const expectedOrigin = getExpectedOrigin(request);

  if (!expectedOrigin) {
    return false;
  }

  try {
    return new URL(origin).origin === new URL(expectedOrigin).origin;
  } catch {
    return false;
  }
};
