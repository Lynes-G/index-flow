const emptyStringValues = new Set([
  "",
  "0",
  "0000-00-00",
  "1970-01-01",
  "1970-01-01 00:00:00",
  "1970-01-01T00:00:00.000Z",
]);

const coerceDate = (value: string | null | undefined) => {
  if (!value) {
    return null;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue || emptyStringValues.has(trimmedValue)) {
    return null;
  }

  const parsedDate = new Date(trimmedValue);

  if (Number.isNaN(parsedDate.getTime()) || parsedDate.getTime() <= 0) {
    return null;
  }

  return parsedDate;
};

export const normalizeAnalyticsDateString = (
  value: string | null | undefined,
) => {
  const parsedDate = coerceDate(value);

  return parsedDate ? parsedDate.toISOString() : null;
};

export const formatAnalyticsDate = ({
  dateString,
  fallback = "No activity yet",
  options,
}: {
  dateString: string | null | undefined;
  fallback?: string;
  options?: Intl.DateTimeFormatOptions;
}) => {
  const parsedDate = coerceDate(dateString);

  if (!parsedDate) {
    return fallback;
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options,
  });
};

export const normalizeAnalyticsText = (value: string | null | undefined) => {
  const trimmedValue = value?.trim();

  return trimmedValue ? trimmedValue : null;
};
