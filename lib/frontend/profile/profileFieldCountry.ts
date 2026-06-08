import type { ProfileFieldInput } from "./profileFields";

export const resolveLocalePhoneCountry = (
  languages: readonly string[] | undefined,
  supportedCountryCodes: readonly string[],
) => {
  const localeCountry = languages
    ?.map((language) => language.split("-")[1]?.toUpperCase())
    .find((countryCode) => !!countryCode);

  if (localeCountry && supportedCountryCodes.includes(localeCountry)) {
    return localeCountry;
  }

  return "US";
};

export const applyPreferredPhoneCountry = (
  fields: ProfileFieldInput[],
  preferredCountry: string,
) =>
  fields.map((field) => {
    if (field.type !== "phone" || field.country) {
      return field;
    }

    return {
      ...field,
      country: preferredCountry,
    };
  });
