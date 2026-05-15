import {
  AsYouType,
  getCountries,
  getCountryCallingCode,
  isSupportedCountry,
  parsePhoneNumberFromString,
} from "libphonenumber-js";

export type ProfileFieldType = "phone" | "email" | "freeText";

export type ProfileFieldInput = {
  id: string;
  type: ProfileFieldType;
  title?: string;
  value?: string;
  country?: string;
};

export type NormalizedProfileField = {
  id: string;
  type: ProfileFieldType;
  title: string;
  value: string;
  country?: string;
};

export type RenderableProfileField = NormalizedProfileField & {
  href?: string;
};

export type PhoneFormatResult = {
  isValid: boolean;
  normalizedValue: string;
  href: string | null;
};

const fallbackTitles: Record<ProfileFieldType, string> = {
  phone: "Phone",
  email: "Email",
  freeText: "Info",
};

const cleanText = (value?: string) => value?.trim() || "";

export const getDefaultFieldTitle = (type: ProfileFieldType) =>
  fallbackTitles[type];

export const formatPhoneValue = (
  value: string,
  country?: string,
): PhoneFormatResult => {
  const trimmedValue = cleanText(value);
  if (!trimmedValue) {
    return { isValid: false, normalizedValue: "", href: null };
  }

  const supportedCountry =
    country && isSupportedCountry(country) ? country : undefined;
  const phoneNumber = parsePhoneNumberFromString(trimmedValue, supportedCountry);

  if (!phoneNumber || !phoneNumber.isValid()) {
    return {
      isValid: false,
      normalizedValue: trimmedValue,
      href: null,
    };
  }

  return {
    isValid: true,
    normalizedValue: phoneNumber.formatInternational(),
    href: phoneNumber.getURI(),
  };
};

export const formatPhoneDraft = (value: string, country?: string) => {
  const trimmedValue = cleanText(value);
  if (!trimmedValue) {
    return "";
  }

  const supportedCountry =
    country && isSupportedCountry(country) ? country : undefined;

  return new AsYouType(supportedCountry).input(trimmedValue);
};

export const normalizeProfileFields = (
  fields: ProfileFieldInput[],
): NormalizedProfileField[] => {
  return fields.reduce<NormalizedProfileField[]>((items, field) => {
    const title = cleanText(field.title) || getDefaultFieldTitle(field.type);
    const value = cleanText(field.value);

    if (!value) {
      return items;
    }

    if (field.type === "phone") {
      const formattedPhone = formatPhoneValue(value, field.country);
      if (!formattedPhone.isValid) {
        return items;
      }

      items.push({
        id: field.id,
        type: field.type,
        title,
        value: formattedPhone.normalizedValue,
        ...(field.country ? { country: field.country } : {}),
      });
      return items;
    }

    items.push({
      id: field.id,
      type: field.type,
      title,
      value,
    });
    return items;
  }, []);
};

export const buildRenderableProfileFields = (
  fields: ProfileFieldInput[],
): RenderableProfileField[] => {
  return normalizeProfileFields(fields).map((field) => {
    if (field.type === "phone") {
      const formattedPhone = formatPhoneValue(field.value, field.country);
      return {
        ...field,
        ...(formattedPhone.href ? { href: formattedPhone.href } : {}),
      };
    }

    if (field.type === "email") {
      return {
        ...field,
        href: `mailto:${field.value}`,
      };
    }

    return field;
  });
};

export const getCountryOptions = () => {
  const displayNames =
    typeof Intl !== "undefined" && typeof Intl.DisplayNames === "function"
      ? new Intl.DisplayNames(["en"], { type: "region" })
      : null;

  return getCountries().map((countryCode) => ({
    code: countryCode,
    name: displayNames?.of(countryCode) || countryCode,
    callingCode: `+${getCountryCallingCode(countryCode)}`,
  }));
};
