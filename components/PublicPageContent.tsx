"use client";

import { PublicPageContentProps } from "@/constants/constants";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { usePreloadedQuery } from "convex/react";
import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Links from "./Links";

const PublicPageContent = ({
  username,
  preloadedLinks,
  preloadedCustomization,
}: PublicPageContentProps) => {
  const customizations = usePreloadedQuery(preloadedCustomization);
  const accentColor = customizations?.accentColor || "#6366f1";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Public Header Section */}
      <div
        className="relative h-48"
        style={{
          background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}ee 100%)`,
        }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Main content - Overlapping the header */}
      <div className="relative mx-auto -mt-24 max-w-4xl px-6 pb-16">
        <div className="xl:gap16 flex flex-col lg:flex-row lg:gap-12">
          {/* Left column - Profile */}
          <div className="mb-12 lg:mb-0 lg:w-80 lg:shrink-0">
            <div className="text-center lg:text-left">
              {/* Profile Picture */}
              <div className="mt-10 mb-6 flex justify-center lg:justify-start">
                <div className="relative">
                  {customizations?.profilePictureUrl ? (
                    <div className="size-24 overflow-hidden rounded-full bg-white p-1 shadow-lg">
                      <Image
                        src={customizations.profilePictureUrl}
                        alt={`${username}'s profile picture`}
                        width={88}
                        height={88}
                        className="h-full w-full rounded-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="flex size-24 items-center justify-center rounded-full bg-white shadow-lg">
                      <User className="size-12 text-gray-600" />
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="space-y-3">
                <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">
                  @{username}
                </h1>
                {customizations?.description && (
                  <p className="mx-auto max-w-md text-base leading-relaxed text-gray-700 lg:mx-0">
                    {customizations.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right column - Links */}
          <div className="min-w-0 flex-1">
            <div className="rounded-3xl border border-white/20 bg-white/90 p-8 shadow-xl backdrop-blur-xl lg:p-10">
              <Links preloadedLinks={preloadedLinks} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 border-t border-gray-200/50 pt-8 text-center">
          <p className="text-sm text-gray-600">
            Powered by{" "}
            <Link
              href={getBaseUrl() + "/"}
              className="hover:underline"
              style={{ color: accentColor }}
            >
              IndexFlow
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicPageContent;
