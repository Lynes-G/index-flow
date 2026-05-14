"use client";

import { ReactNode } from "react";

type PublicLinksSectionProps = {
  accentColor: string;
  children: ReactNode;
};

const PublicLinksSection = ({
  accentColor,
  children,
}: PublicLinksSectionProps) => {
  return (
    <div className="rounded-[1.75rem] border border-white/50 bg-white/82 p-3 shadow-2xl shadow-slate-900/8 backdrop-blur-xl sm:rounded-[2rem] sm:p-5 lg:p-6">
      <div className="mb-4 flex items-end justify-between gap-4 px-1 sm:mb-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
            Explore
          </p>
          <h2 className="mt-1 text-lg font-semibold tracking-[-0.02em] text-slate-900 sm:text-xl">
            Find me around the web
          </h2>
        </div>
        <div
          className="hidden rounded-full px-3 py-1 text-xs font-medium sm:block"
          style={{
            color: accentColor,
            backgroundColor: `${accentColor}14`,
          }}
        >
          Curated links
        </div>
      </div>

      {children}
    </div>
  );
};

export default PublicLinksSection;
