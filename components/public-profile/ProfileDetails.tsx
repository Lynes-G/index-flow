"use client";

import { getAccentInkOnLight } from "@/lib/frontend/shared/accentColor";
import {
  buildRenderableProfileFields,
  type ProfileFieldInput,
} from "@/lib/frontend/profile/profileFields";
import { BriefcaseBusiness, Mail, Phone } from "lucide-react";
import Link from "next/link";

const iconMap = {
  phone: Phone,
  email: Mail,
  freeText: BriefcaseBusiness,
} as const;

type ProfileDetailsProps = {
  profileFields: ProfileFieldInput[];
  accentColor: string;
  compact?: boolean;
  forceMobileLayout?: boolean;
};

const ProfileDetails = ({
  profileFields,
  accentColor,
  compact = false,
  forceMobileLayout = false,
}: ProfileDetailsProps) => {
  const fields = buildRenderableProfileFields(profileFields);
  const accentInk = getAccentInkOnLight(accentColor);

  if (fields.length === 0) {
    return null;
  }

  return (
    <div
      className={
        compact
          ? forceMobileLayout
            ? "grid gap-3"
            : "grid gap-3 sm:grid-cols-2"
          : "space-y-4"
      }
    >
      {fields.map((field) => {
        const Icon = iconMap[field.type];
        const wrapperClassName = compact
          ? "public-profile-detail-card public-profile-detail-card-compact px-4 py-3"
          : "public-profile-detail-card px-4 py-4";
        const content = (
          <div className="flex items-start gap-3">
            <span
              className={`inline-flex shrink-0 items-center justify-center rounded-full ${
                compact ? "size-8" : "size-9"
              }`}
              style={{
                color: accentInk,
                backgroundColor: `${accentColor}18`,
              }}
            >
              <Icon className={compact ? "size-3.5" : "size-4"} />
            </span>
            <div
              className={`min-w-0 text-left ${compact ? "space-y-0.5" : "space-y-1"}`}
            >
              <p
                className={`text-slate-900 ${compact ? "text-xs font-semibold" : "text-sm font-semibold"}`}
              >
                {field.title}
              </p>
              <p
                className={`break-words text-slate-600 ${
                  compact ? "text-xs leading-5" : "text-sm leading-6"
                }`}
              >
                {field.value}
              </p>
            </div>
          </div>
        );

        if (field.href) {
          return (
            <Link
              key={field.id}
              href={field.href}
              className={`${wrapperClassName} block hover:-translate-y-0.5 hover:bg-white`}
              style={{ borderColor: `${accentColor}30` }}
            >
              {content}
            </Link>
          );
        }

        return (
          <div
            key={field.id}
            className={wrapperClassName}
            style={{ borderColor: `${accentColor}30` }}
          >
            {content}
          </div>
        );
      })}
    </div>
  );
};

export default ProfileDetails;
