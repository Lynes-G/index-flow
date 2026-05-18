"use client";

import type { ProfileFieldInput } from "@/lib/profileFields";
import { AvatarShape } from "@/lib/themePresets";
import { User } from "lucide-react";
import Image from "next/image";
import ProfileDetails from "./ProfileDetails";
import SocialLinks from "./SocialLinks";

const avatarShapeMap: Record<AvatarShape, string> = {
  circle: "rounded-full",
  rounded: "rounded-2xl",
  square: "rounded-none",
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
}: PublicProfileHeroProps) => {
  return (
    <>
      <div
        className="relative h-52 overflow-hidden rounded-[1.75rem] border border-white/25 shadow-2xl shadow-slate-900/10 sm:h-60 sm:rounded-[2rem] lg:h-64"
        style={
          bannerImageUrl
            ? {
                backgroundImage: `url(${bannerImageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: `${bannerImagePositionX ?? 50}% ${bannerImagePositionY ?? 50}%`,
              }
            : {
                background: `linear-gradient(145deg, #111827 0%, ${accentColor}55 100%)`,
              }
        }
      >
        <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/20 to-black/35" />
      </div>

      <div className="relative z-10 mx-auto -mt-12 max-w-2xl sm:-mt-16 lg:-mt-18">
        <div className="rounded-[1.75rem] border border-white/60 bg-white/86 px-5 pt-0 pb-5 text-center shadow-2xl shadow-slate-900/10 backdrop-blur-xl sm:rounded-[2rem] sm:px-8 sm:pb-8">
          <div className="-mt-12 flex justify-center sm:-mt-14">
            <div className="relative">
              {profilePictureUrl ? (
                <div
                  className={`size-24 bg-white p-1.5 shadow-xl sm:size-28 ${avatarShapeMap[avatarShape]}`}
                >
                  <div
                    className={`h-full w-full overflow-hidden ${avatarShapeMap[avatarShape]}`}
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
                  className={`flex size-24 items-center justify-center bg-white shadow-xl sm:size-28 ${avatarShapeMap[avatarShape]}`}
                >
                  <User className="size-10 text-gray-600 sm:size-12" />
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 space-y-4 sm:mt-5 sm:space-y-5">
            <div className="space-y-2">
              <h1 className="text-[2rem] font-semibold tracking-[-0.03em] wrap-break-word text-slate-900 sm:text-4xl">
                @{username}
              </h1>
              {description && (
                <p className="mx-auto max-w-xl text-sm leading-6 text-slate-600 sm:text-[15px] sm:leading-7">
                  {description}
                </p>
              )}
            </div>

            <ProfileDetails
              profileFields={profileFields}
              accentColor={accentColor}
              compact
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
