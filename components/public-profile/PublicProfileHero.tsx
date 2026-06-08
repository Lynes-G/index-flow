"use client";

import type { ProfileFieldInput } from "@/lib/frontend/profile/profileFields";
import { AvatarShape } from "@/lib/frontend/appearance/themePresets";
import { cn } from "@/lib/frontend/shared/utils";
import { User } from "lucide-react";
import Image from "next/image";
import ProfileDetails from "./ProfileDetails";
import SocialLinks from "./SocialLinks";

const avatarShapeMap: Record<AvatarShape, string> = {
  circle: "rounded-full",
  rounded: "rounded-2xl",
  square: "rounded-none",
};

const getBannerStyle = ({
  accentColor,
  bannerImagePositionX,
  bannerImagePositionY,
  bannerImageUrl,
}: {
  accentColor: string;
  bannerImagePositionX?: number;
  bannerImagePositionY?: number;
  bannerImageUrl?: string;
}) =>
  bannerImageUrl
    ? {
        backgroundImage: `url(${bannerImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: `${bannerImagePositionX ?? 50}% ${bannerImagePositionY ?? 50}%`,
      }
    : {
        background: `linear-gradient(145deg, #111827 0%, ${accentColor}55 100%)`,
      };

type PublicProfileHeroProps = {
  username: string;
  accentColor: string;
  avatarShape: AvatarShape;
  profilePictureUrl?: string;
  description?: string;
  profileFields?: ProfileFieldInput[];
  socialLinks?: Array<{ platform: string; url: string }>;
  bannerImageUrl?: string;
  bannerImagePositionX?: number;
  bannerImagePositionY?: number;
  forceMobileLayout?: boolean;
};

const PublicProfileHero = ({
  username,
  accentColor,
  avatarShape,
  profilePictureUrl,
  description,
  profileFields = [],
  socialLinks = [],
  bannerImageUrl,
  bannerImagePositionX,
  bannerImagePositionY,
  forceMobileLayout = false,
}: PublicProfileHeroProps) => {
  const avatarShapeClass = avatarShapeMap[avatarShape];
  const bannerStyle = getBannerStyle({
    accentColor,
    bannerImagePositionX,
    bannerImagePositionY,
    bannerImageUrl,
  });

  return (
    <>
      <div
        className={cn(
          "public-hero-banner relative h-44 overflow-hidden",
          !forceMobileLayout && "sm:h-60 lg:h-64",
        )}
        style={bannerStyle}
      >
        <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/20 to-black/35" />
      </div>

      <div
        className={cn(
          "relative z-10 mx-auto -mt-10 max-w-2xl",
          !forceMobileLayout && "sm:-mt-16 lg:-mt-[4.5rem]",
        )}
      >
        <div
          className={cn(
            "public-hero-card px-4 pt-0 pb-5 text-center",
            !forceMobileLayout && "sm:px-8 sm:pb-8",
          )}
        >
          <div
            className={cn(
              "-mt-10 flex justify-center",
              !forceMobileLayout && "sm:-mt-14",
            )}
          >
            <div className="relative">
              {profilePictureUrl ? (
                <div
                  className={cn(
                    "public-avatar-frame size-20 p-1.5",
                    !forceMobileLayout && "sm:size-28",
                    avatarShapeClass,
                  )}
                >
                  <div
                    className={`relative h-full w-full overflow-hidden ${avatarShapeClass}`}
                  >
                    <Image
                      src={profilePictureUrl}
                      alt={`${username}'s profile picture`}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              ) : (
                <div
                  className={cn(
                    "public-avatar-frame flex size-20 items-center justify-center",
                    !forceMobileLayout && "sm:size-28",
                    avatarShapeClass,
                  )}
                >
                  <User
                    className={cn(
                      "size-9 text-gray-600",
                      !forceMobileLayout && "sm:size-12",
                    )}
                  />
                </div>
              )}
            </div>
          </div>

          <div
            className={cn(
              "mt-3.5 space-y-4",
              !forceMobileLayout && "sm:mt-5 sm:space-y-5",
            )}
          >
            <div
              className={cn(
                "space-y-2",
                !forceMobileLayout && "sm:space-y-2.5",
              )}
            >
              <p className="text-[11px] font-semibold tracking-[0.24em] text-slate-400 uppercase">
                Follow along
              </p>
              <h1
                className={cn(
                  "text-[1.35rem] leading-[1.02] font-semibold tracking-[-0.05em] [overflow-wrap:anywhere] text-slate-900",
                  !forceMobileLayout && "sm:text-4xl",
                )}
              >
                @{username}
              </h1>
              {description && (
                <p
                  className={cn(
                    "mx-auto max-w-xl text-[13px] leading-5 text-slate-600",
                    !forceMobileLayout && "sm:text-[15px] sm:leading-7",
                  )}
                >
                  {description}
                </p>
              )}
            </div>

            <ProfileDetails
              profileFields={profileFields}
              accentColor={accentColor}
              compact
              forceMobileLayout={forceMobileLayout}
            />

            <SocialLinks
              socialLinks={socialLinks}
              accentColor={accentColor}
              compact
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicProfileHero;
