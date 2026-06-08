"use client";

import type { CSSProperties } from "react";
import {
  ArrowDown,
  ArrowUp,
  Link as LinkIcon,
  MapPin,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  formatPhoneValue,
  type ProfileFieldInput,
  type ProfileFieldType,
} from "@/lib/frontend/profile/profileFields";
import {
  getSocialPlatformIcon,
  socialPlatforms,
  type SocialPlatform,
} from "@/lib/frontend/profile/socialPlatforms";
import { cn } from "@/lib/frontend/shared/utils";

type CountryOption = {
  code: string;
  name: string;
  callingCode: string;
};

type SocialDraft = {
  platform: SocialPlatform;
  url: string;
};

type CustomizationBioSocialPanelProps = {
  description: string;
  profileFields: ProfileFieldInput[];
  socialLinks: Array<{ platform: string; url: string }>;
  socialDraft: SocialDraft;
  countryOptions: CountryOption[];
  preferredPhoneCountry: string;
  isLocatingCountry: boolean;
  sectionCardClass: string;
  sectionHeaderClass: string;
  sectionTitleClass: string;
  sectionHelpClass: string;
  accentBadgeStyle: CSSProperties;
  accentButtonStyle: CSSProperties;
  onDescriptionChange: (value: string) => void;
  onAddProfileField: (type: ProfileFieldType) => void;
  onProfileFieldChange: (
    id: string,
    updates: Partial<ProfileFieldInput>,
  ) => void;
  onMoveProfileField: (id: string, direction: "up" | "down") => void;
  onRemoveProfileField: (id: string) => void;
  onUseLocationForPhone: (id: string) => void;
  onSocialDraftPlatformChange: (platform: SocialPlatform) => void;
  onSocialDraftUrlChange: (url: string) => void;
  onAddSocialLink: () => void;
  onRemoveSocialLink: (index: number) => void;
};

const profileFieldTypeOptions: Array<{
  value: ProfileFieldType;
  label: string;
}> = [
  { value: "phone", label: "Phone" },
  { value: "email", label: "Email" },
  { value: "freeText", label: "Free text" },
];

const nativeSelectClassName =
  "h-10 w-full min-w-0 rounded-md border border-slate-300 px-3 text-sm";

const profileTextareaClassName =
  "resize-vertical max-h-[200px] min-h-[100px] w-full rounded-md border border-slate-300 px-3 py-2 focus-visible:border-transparent focus-visible:ring-2 focus-visible:outline-none";

const addProfileFieldButtonClassName =
  "h-auto rounded-full border-slate-300 bg-white/80 px-3 py-2 text-left leading-5 whitespace-normal";

const socialLinkCardClassName =
  "flex flex-col items-start justify-between gap-3 rounded-lg border border-slate-200/85 bg-white/92 px-4 py-3 shadow-[0_14px_32px_-30px_rgba(15,23,42,0.5)] sm:flex-row sm:items-center";

type ProfileFieldCardProps = {
  field: ProfileFieldInput;
  index: number;
  totalFields: number;
  countryOptions: CountryOption[];
  preferredPhoneCountry: string;
  isLocatingCountry: boolean;
  onProfileFieldChange: (
    id: string,
    updates: Partial<ProfileFieldInput>,
  ) => void;
  onMoveProfileField: (id: string, direction: "up" | "down") => void;
  onRemoveProfileField: (id: string) => void;
  onUseLocationForPhone: (id: string) => void;
};

const ProfileFieldCard = ({
  field,
  index,
  totalFields,
  countryOptions,
  preferredPhoneCountry,
  isLocatingCountry,
  onProfileFieldChange,
  onMoveProfileField,
  onRemoveProfileField,
  onUseLocationForPhone,
}: ProfileFieldCardProps) => {
  const phoneValidation =
    field.type === "phone" && field.value
      ? formatPhoneValue(field.value, field.country)
      : null;

  return (
    <div className="dashboard-settings-panel-raised p-3.5 sm:p-5">
      <div className="mb-3.5 flex flex-col gap-3 lg:mb-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Field Type</Label>
            <select
              value={field.type}
              onChange={(event) =>
                onProfileFieldChange(field.id, {
                  type: event.target.value as ProfileFieldType,
                  value: "",
                })
              }
              className={nativeSelectClassName}
            >
              {profileFieldTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-0 space-y-2">
            <Label>Title</Label>
            <Input
              value={field.title || ""}
              onChange={(event) =>
                onProfileFieldChange(field.id, {
                  title: event.target.value,
                })
              }
              placeholder="Optional label"
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 self-start sm:self-end lg:self-start">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => onMoveProfileField(field.id, "up")}
            disabled={index === 0}
          >
            <ArrowUp className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => onMoveProfileField(field.id, "down")}
            disabled={index === totalFields - 1}
          >
            <ArrowDown className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => onRemoveProfileField(field.id)}
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>

      {field.type === "phone" ? (
        <div className="space-y-3">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)]">
            <div className="min-w-0 space-y-2">
              <Label>Country</Label>
              <select
                value={field.country || preferredPhoneCountry}
                onChange={(event) =>
                  onProfileFieldChange(field.id, {
                    country: event.target.value,
                  })
                }
                className={nativeSelectClassName}
              >
                {countryOptions.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name} ({country.callingCode})
                  </option>
                ))}
              </select>
            </div>
            <div className="min-w-0 space-y-2">
              <Label>Phone Number</Label>
              <Input
                type="tel"
                value={field.value || ""}
                onChange={(event) =>
                  onProfileFieldChange(field.id, {
                    value: event.target.value,
                  })
                }
                placeholder="+1 555 123 4567"
                className="w-full min-w-0"
              />
            </div>
          </div>
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onUseLocationForPhone(field.id)}
              disabled={isLocatingCountry}
              className="flex items-center gap-2"
            >
              <MapPin className="size-4" />
              {isLocatingCountry ? "Detecting..." : "Use My Location"}
            </Button>
            {field.value && phoneValidation ? (
              <p
                className={cn(
                  "text-xs",
                  phoneValidation.isValid
                    ? "text-emerald-600"
                    : "text-amber-700",
                )}
              >
                {phoneValidation.isValid
                  ? `Valid number. Public display: ${phoneValidation.normalizedValue}`
                  : "Enter a valid phone number for the selected country."}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {field.type === "email" ? (
        <div className="space-y-2">
          <Label>Email Address</Label>
          <Input
            type="email"
            value={field.value || ""}
            onChange={(event) =>
              onProfileFieldChange(field.id, {
                value: event.target.value,
              })
            }
            placeholder="hello@example.com"
          />
        </div>
      ) : null}

      {field.type === "freeText" ? (
        <div className="space-y-2">
          <Label>Text Value</Label>
          <Textarea
            value={field.value || ""}
            onChange={(event) =>
              onProfileFieldChange(field.id, {
                value: event.target.value,
              })
            }
            placeholder="Add a short note, role, or extra detail."
            rows={3}
            className={profileTextareaClassName}
          />
        </div>
      ) : null}
    </div>
  );
};

const CustomizationBioSocialPanel = ({
  description,
  profileFields,
  socialLinks,
  socialDraft,
  countryOptions,
  preferredPhoneCountry,
  isLocatingCountry,
  sectionCardClass,
  sectionHeaderClass,
  sectionTitleClass,
  sectionHelpClass,
  accentBadgeStyle,
  accentButtonStyle,
  onDescriptionChange,
  onAddProfileField,
  onProfileFieldChange,
  onMoveProfileField,
  onRemoveProfileField,
  onUseLocationForPhone,
  onSocialDraftPlatformChange,
  onSocialDraftUrlChange,
  onAddSocialLink,
  onRemoveSocialLink,
}: CustomizationBioSocialPanelProps) => {
  return (
    <section
      id="panel-bio"
      role="tabpanel"
      aria-labelledby="tab-bio"
      className={sectionCardClass}
    >
      <div className={sectionHeaderClass}>
        <div className="rounded-lg p-2" style={accentBadgeStyle}>
          <LinkIcon className="size-4" />
        </div>
        <div>
          <p className="text-brand-purple text-[11px] font-semibold tracking-[0.24em] uppercase">
            Bio
          </p>
          <p className={sectionTitleClass}>Bio & Social</p>
          <p className={sectionHelpClass}>
            Tell visitors who you are and where to find you.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="dashboard-section-divider pt-4 sm:pt-5">
          <div className="space-y-1">
            <p className="text-brand-purple text-[11px] font-semibold tracking-[0.24em] uppercase">
              Intro
            </p>
            <p className={sectionTitleClass}>Description</p>
            <p className={sectionHelpClass}>
              A short summary that helps visitors understand who you are at a
              glance.
            </p>
          </div>
          <div className="dashboard-settings-panel-soft mt-4 p-3.5 sm:p-5">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={description}
                onChange={(event) => onDescriptionChange(event.target.value)}
                placeholder="Tell visitors about yourself..."
                rows={3}
                maxLength={200}
                className={profileTextareaClassName}
              />
              <p className="text-sm text-slate-500">
                {description.length}/200 characters
              </p>
            </div>
          </div>
        </div>

        <div className="dashboard-section-divider pt-4 sm:pt-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-1">
              <p className="text-brand-purple text-[11px] font-semibold tracking-[0.24em] uppercase">
                Contact
              </p>
              <p className={sectionTitleClass}>Profile Fields</p>
              <p className={sectionHelpClass}>
                Add repeatable phone, email, or free-text items above your
                social links.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {profileFieldTypeOptions.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onAddProfileField(option.value)}
                  className={addProfileFieldButtonClassName}
                >
                  <Plus className="size-4" />
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {profileFields.length === 0 ? (
            <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-white/76 px-3.5 py-5 text-sm text-slate-500 sm:px-4 sm:py-6">
              No profile fields yet. Add one to show contact details or extra
              info on the public page.
            </div>
          ) : (
            <div className="mt-4 space-y-3.5 sm:space-y-4">
              {profileFields.map((field, index) => (
                <ProfileFieldCard
                  key={field.id}
                  field={field}
                  index={index}
                  totalFields={profileFields.length}
                  countryOptions={countryOptions}
                  preferredPhoneCountry={preferredPhoneCountry}
                  isLocatingCountry={isLocatingCountry}
                  onProfileFieldChange={onProfileFieldChange}
                  onMoveProfileField={onMoveProfileField}
                  onRemoveProfileField={onRemoveProfileField}
                  onUseLocationForPhone={onUseLocationForPhone}
                />
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-section-divider pt-4 sm:pt-5">
          <div className="space-y-1">
            <p className="text-brand-purple text-[11px] font-semibold tracking-[0.24em] uppercase">
              Network
            </p>
            <p className={sectionTitleClass}>Social Links</p>
            <p className={sectionHelpClass}>
              Add the platforms people already know you on.
            </p>
          </div>
          <div className="dashboard-settings-panel-soft mt-4 p-3.5 sm:p-5">
            <div className="space-y-4">
              <div className="grid gap-3">
                <select
                  value={socialDraft.platform}
                  onChange={(event) =>
                    onSocialDraftPlatformChange(
                      event.target.value as SocialPlatform,
                    )
                  }
                  className={nativeSelectClassName}
                >
                  {socialPlatforms.map((platform) => (
                    <option key={platform} value={platform}>
                      {platform}
                    </option>
                  ))}
                </select>
                <Input
                  type="text"
                  value={socialDraft.url}
                  onChange={(event) =>
                    onSocialDraftUrlChange(event.target.value)
                  }
                  placeholder="https://..."
                />
                <Button
                  type="button"
                  onClick={onAddSocialLink}
                  className="w-full"
                  style={accentButtonStyle}
                >
                  Add Link
                </Button>
              </div>

              {socialLinks.length > 0 ? (
                <div className="space-y-3">
                  {socialLinks.map((link, index) => {
                    const Icon = getSocialPlatformIcon(link.platform);

                    return (
                      <div
                        key={`${link.platform}-${index}`}
                        className={socialLinkCardClassName}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <Icon
                            className="size-4 shrink-0 text-slate-700"
                            aria-hidden="true"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-800">
                              {link.platform}
                            </p>
                            <p className="truncate text-xs text-slate-500">
                              {link.url}
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => onRemoveSocialLink(index)}
                          className="w-full sm:w-auto"
                        >
                          Remove
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomizationBioSocialPanel;
