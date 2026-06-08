const clerkHeadingClassName =
  "!font-['Sora',sans-serif] !text-2xl !font-semibold !leading-tight !text-brand-eggplant";

const clerkSubtitleClassName =
  "!text-sm !leading-6 !text-[color:color-mix(in_srgb,var(--brand-eggplant)_64%,white)]";

const clerkButtonMotionClassName =
  "!transition-[background-color,border-color,box-shadow,color,opacity,transform] !duration-200 hover:!-translate-y-0.5";

const clerkSecondaryButtonClassName = `!h-10 !rounded-lg !border-2 !border-brand-eggplant !bg-button-secondary !text-sm !font-semibold !text-button-secondary-foreground !shadow-brand-purple-sm ${clerkButtonMotionClassName} hover:!bg-button-secondary-hover hover:!text-button-secondary-foreground focus:!ring-2 focus:!ring-[color:color-mix(in_srgb,var(--brand-accent)_55%,transparent)] focus:!ring-offset-2`;

const clerkPrimaryButtonClassName = `!h-10 !rounded-lg !border-2 !border-brand-eggplant !bg-brand-eggplant !text-sm !font-semibold !text-white !shadow-brand-neon-sm ${clerkButtonMotionClassName} hover:!bg-[color-mix(in_srgb,var(--brand-eggplant)_88%,black)] focus:!ring-2 focus:!ring-[color:color-mix(in_srgb,var(--brand-accent)_55%,transparent)] focus:!ring-offset-2`;

const clerkBaseInputClassName =
  "!h-11 !rounded-2xl !border-[color:color-mix(in_srgb,var(--brand-eggplant)_12%,white)] !bg-white !px-4 !text-brand-eggplant !shadow-sm !transition focus:!border-brand-accent focus:!ring-2 focus:!ring-[color:color-mix(in_srgb,var(--brand-accent)_42%,transparent)]";

const clerkPageInputClassName =
  "!h-11 !rounded-lg !border-0 !bg-transparent !border-brand-eggplant !border-2 !px-4 !text-brand-eggplant !shadow-brand-eggplant-sm !transition focus:!ring-4 focus:!ring-[color:color-mix(in_srgb,var(--brand-accent)_42%,transparent)] !max-h-12";

const clerkEggplantLinkClassName =
  "!font-semibold !text-brand-eggplant hover:!text-brand-purple";

const clerkPurpleLinkClassName =
  "!font-semibold !text-brand-purple hover:!text-brand-eggplant";

const clerkSoftDividerClassName =
  "!bg-[color:color-mix(in_srgb,var(--brand-eggplant)_10%,white)]";

const clerkSoftFooterClassName =
  "!bg-[color:color-mix(in_srgb,var(--brand-sand)_76%,white)]";

const clerkSoftBorderClassName =
  "!border-[color:color-mix(in_srgb,var(--brand-eggplant)_10%,white)]";

const authClerkBaseAppearance = {
  options: {
    unsafe_disableDevelopmentModeWarnings: true,
    elevation: "flush",
  },
  variables: {
    colorPrimary: "#3b152a",
    colorText: "#3b152a",
    colorTextSecondary: "#78596b",
    colorBackground: "transparent",
    colorInputBackground: "#ffffff",
    colorInputText: "#3b152a",
    borderRadius: "1rem",
    fontFamily: '"DM Sans", sans-serif',
    fontSize: "0.875rem",
  },
  elements: {
    rootBox: "w-full",
    header: "!items-start !text-left",
    logoBox: "!justify-start",
    logoImage: "!h-8 !w-auto",
    headerTitle: clerkHeadingClassName,
    headerSubtitle: `!mt-2 ${clerkSubtitleClassName}`,
    socialButtonsBlockButton: clerkSecondaryButtonClassName,
    socialButtonsBlockButtonText: "!text-sm !font-semibold",
    dividerLine: clerkSoftDividerClassName,
    dividerText:
      "!text-xs !font-medium !text-[color:color-mix(in_srgb,var(--brand-eggplant)_54%,white)]",
    formFieldLabel: "!text-sm !font-semibold !text-brand-eggplant",
    formFieldInput: clerkBaseInputClassName,
    formButtonPrimary: clerkPrimaryButtonClassName,
    footer: `!rounded-b-[1.55rem] ${clerkSoftFooterClassName}`,
    footerAction: "!bg-transparent",
    footerActionText:
      "!text-sm !text-[color:color-mix(in_srgb,var(--brand-eggplant)_62%,white)]",
    footerActionLink: clerkPurpleLinkClassName,
    footerPages: "!bg-transparent",
    footerPagesLink: clerkPurpleLinkClassName,
    identityPreviewText: "!text-sm !font-semibold !text-brand-eggplant",
    formFieldErrorText: "!text-sm !font-medium",
    alertText: "!text-sm",
    otpCodeFieldInput:
      "!rounded-2xl !border-[color:color-mix(in_srgb,var(--brand-eggplant)_12%,white)] !bg-white !text-brand-eggplant",
    formResendCodeLink: clerkEggplantLinkClassName,
  },
};

export const authPageClerkAppearance = {
  ...authClerkBaseAppearance,
  elements: {
    ...authClerkBaseAppearance.elements,
    cardBox:
      "w-full !rounded-[1.55rem] !border-0 !bg-transparent !shadow-none !ring-0",
    card: "!gap-5 !bg-transparent !p-0 !shadow-none",
    logoBox: "!hidden",
    header: "!items-center !text-center",
    headerTitle: clerkHeadingClassName,
    headerSubtitle: `!mt-3 ${clerkSubtitleClassName}`,
    formButtonPrimary: clerkPrimaryButtonClassName,
    formFieldInput: clerkPageInputClassName,
    socialButtonsBlockButton: clerkSecondaryButtonClassName,
    footer: "!bg-transparent",
    footerAction: "!bg-transparent",
  },
};

export const authModalClerkAppearance = {
  ...authClerkBaseAppearance,
  variables: {
    ...authClerkBaseAppearance.variables,
    colorBackground: "#ffffff",
  },
  elements: {
    ...authClerkBaseAppearance.elements,
    modalBackdrop: "!bg-[rgba(23,20,18,0.68)] !backdrop-blur-sm",
    modalContent:
      "!rounded-lg !bg-white !shadow-[0_30px_90px_rgba(15,10,12,0.28)]",
    cardBox: `w-full !overflow-hidden !rounded-lg !border ${clerkSoftBorderClassName} !bg-white !shadow-[0_30px_90px_rgba(59,21,42,0.2)] !ring-0`,
    card: "!gap-5 !bg-white !p-6 !shadow-none sm:!p-7",
    footer: `!rounded-b-[1.9rem] !border-t ${clerkSoftBorderClassName} ${clerkSoftFooterClassName}`,
  },
};
