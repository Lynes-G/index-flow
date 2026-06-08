"use client";

import {
  BarChart3,
  CalendarDays,
  Camera,
  MessageCircle,
  MousePointerClick,
  Music2,
  Play,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

const chaosCards = [
  {
    Icon: Camera,
    className: "left-[5%] top-[10%] h-24 w-28 bg-[#fffdf6]",
    accentClassName: "bg-brand-purple",
    rotate: -10,
    flyX: 640,
    flyY: 172,
    flyRotate: 14,
  },
  {
    Icon: ShoppingBag,
    className: "left-[25%] top-[7%] h-24 w-24 bg-[#fff6cf]",
    accentClassName: "bg-brand-lime",
    rotate: 8,
    flyX: 500,
    flyY: 205,
    flyRotate: -10,
  },
  {
    Icon: Play,
    className: "left-[9%] top-[38%] h-26 w-32 bg-brand-eggplant text-white",
    accentClassName: "bg-brand-neon",
    rotate: 6,
    flyX: 610,
    flyY: 24,
    flyRotate: -5,
  },
  {
    Icon: MessageCircle,
    className: "left-[32%] top-[42%] h-24 w-26 bg-white",
    accentClassName: "bg-brand-purple",
    rotate: -8,
    flyX: 430,
    flyY: 20,
    flyRotate: 12,
  },
  {
    Icon: Music2,
    className: "left-[13%] bottom-[8%] h-24 w-28 bg-[#fff1dc]",
    accentClassName: "bg-brand-lime",
    rotate: 11,
    flyX: 590,
    flyY: -205,
    flyRotate: -16,
  },
  {
    Icon: CalendarDays,
    className: "left-[35%] bottom-[13%] h-24 w-22 bg-[#fffdf6]",
    accentClassName: "bg-brand-purple",
    rotate: -4,
    flyX: 400,
    flyY: -170,
    flyRotate: 8,
  },
];

const streamCards = [
  "left-[44%] top-[16%] h-8 w-14 rotate-[18deg] bg-brand-purple/90",
  "left-[48%] top-[34%] h-10 w-16 rotate-[-10deg] bg-brand-lime/90",
  "left-[45%] top-[58%] h-7 w-13 rotate-[12deg] bg-brand-neon/90",
  "left-[52%] top-[72%] h-8 w-15 rotate-[-18deg] bg-brand-purple/90",
];

const phoneLinks = [
  "bg-[linear-gradient(135deg,var(--brand-lime),var(--brand-neon))]",
  "bg-white/92",
  "bg-white/78",
  "bg-white/70",
];

const addedLinks = [
  "bg-[linear-gradient(135deg,var(--brand-purple),#fff6cf)]",
  "bg-white/86",
  "bg-[linear-gradient(135deg,var(--brand-lime),#ffffff)]",
];

const miniMetrics = [42, 66, 52, 82, 58];
const windowDotClassNames = [
  "bg-brand-purple",
  "bg-brand-neon",
  "bg-brand-lime",
];
const windowGhostDotClassNames = [
  "bg-brand-eggplant/14",
  "bg-brand-eggplant/10",
  "bg-brand-eggplant/14",
];
const profileDotRows = [
  [
    "bg-brand-eggplant/18 size-2",
    "bg-brand-eggplant/14 size-2",
    "bg-brand-eggplant/18 size-2",
  ],
  ["bg-brand-eggplant/10 size-1.5", "bg-brand-eggplant/12 size-1.5"],
];
const mobileFooterDotRows = [
  ["bg-brand-eggplant/12", "bg-brand-eggplant/10", "bg-brand-eggplant/12"],
  ["bg-brand-eggplant/10", "bg-brand-eggplant/12"],
];

const phoneBackdropClassName =
  "border-brand-eggplant bg-brand-purple/35 absolute -inset-4 -z-10 translate-x-2 translate-y-2 border-2";

const phoneScreenClassName =
  "h-full overflow-hidden rounded-[0.95rem] bg-[linear-gradient(180deg,#fff8df_0%,#ffe8bd_100%)]";

const phoneAvatarPreviewClassName =
  "border-brand-eggplant mx-auto size-16 rounded-lg border-2 bg-[linear-gradient(135deg,var(--brand-eggplant),var(--brand-purple)_52%,var(--brand-neon))] shadow-[5px_5px_0_var(--brand-lime)]";

const metricBarClassName =
  "flex-1 rounded-t-full bg-[linear-gradient(180deg,var(--brand-lime),var(--brand-purple))]";

const flyTransition = {
  type: "spring" as const,
  stiffness: 120,
  damping: 18,
  mass: 0.72,
};

const settleTransition = {
  type: "spring" as const,
  stiffness: 180,
  damping: 22,
  mass: 0.8,
};

export const AppDashboardPreview = () => {
  const [isActive, setIsActive] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const startFlow = () => setIsActive(true);
  const reverseFlow = () => setIsActive(false);

  return (
    <>
      <div
        className="creator-flow-scene riso-motion-plate editorial-surface relative mt-8 overflow-hidden rounded-lg p-3 motion-reduce:animate-none sm:p-5 lg:mt-10 lg:p-6"
        aria-label="Animated concept showing scattered creator links flowing into one polished mobile profile."
        tabIndex={0}
        onMouseEnter={startFlow}
        onMouseLeave={reverseFlow}
        onFocus={startFlow}
        onBlur={reverseFlow}
      >
        <div className="editorial-grid absolute inset-0 opacity-[0.32]" />

        <div className="marketing-preview-stage relative min-h-[560px] overflow-hidden rounded-lg sm:min-h-[600px] lg:min-h-[540px]">
          <div className="absolute inset-x-5 top-5 z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {windowDotClassNames.map((className) => (
                <span
                  key={className}
                  className={`${className} size-2.5 rounded-full`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              {windowGhostDotClassNames.map((className, index) => (
                <span
                  key={`${className}-${index}`}
                  className={`${className} size-2 rounded-full`}
                />
              ))}
            </div>
          </div>

          <div className="absolute inset-0 z-10">
            {chaosCards.map(
              (
                {
                  Icon,
                  className,
                  accentClassName,
                  flyX,
                  flyY,
                  flyRotate,
                  rotate,
                },
                index,
              ) => (
                <motion.div
                  key={index}
                  className={`marketing-preview-card absolute p-3.5 ${className}`}
                  animate={
                    shouldReduceMotion
                      ? { opacity: 1, x: 0, y: 0, rotate, scale: 1 }
                      : isActive
                        ? {
                            opacity: 0,
                            x: flyX,
                            y: flyY,
                            rotate: flyRotate,
                            scale: 0.18,
                          }
                        : {
                            opacity: 1,
                            x: 0,
                            y: [0, -10, 0],
                            rotate,
                            scale: 1,
                          }
                  }
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : isActive
                        ? { ...flyTransition, delay: index * 0.065 }
                        : {
                            y: {
                              duration: 8,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: index * 0.18,
                            },
                            opacity: { duration: 0.42, delay: index * 0.035 },
                            x: { ...flyTransition, delay: index * 0.035 },
                            rotate: { ...flyTransition, delay: index * 0.035 },
                            scale: { ...flyTransition, delay: index * 0.035 },
                          }
                  }
                  aria-hidden="true"
                >
                  <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between">
                      <span
                        className={`border-brand-eggplant flex size-8 items-center justify-center rounded-md border-2 ${accentClassName}`}
                      >
                        <Icon className="size-4" />
                      </span>
                      <span className="size-2 rounded-full bg-current opacity-30" />
                    </div>
                    <div className="mt-3 flex gap-1.5">
                      <span className="size-2 rounded-full bg-current opacity-15" />
                      <span className="size-2 rounded-full bg-current opacity-10" />
                      <span className="size-2 rounded-full bg-current opacity-15" />
                    </div>
                  </div>
                </motion.div>
              ),
            )}

            {streamCards.map((className, index) => (
              <motion.span
                key={index}
                className={`marketing-preview-stream-card absolute ${className}`}
                animate={
                  shouldReduceMotion
                    ? { opacity: 0.72, x: 0, y: 0, scale: 1 }
                    : isActive
                      ? { opacity: 0, x: 160, y: -18, scale: 0.4 }
                      : {
                          opacity: [0.52, 1, 0.52],
                          x: [-10, 18, -10],
                          y: [5, -9, 5],
                          scale: [0.94, 1.04, 0.94],
                        }
                }
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : isActive
                      ? {
                          duration: 0.72,
                          ease: [0.2, 0.92, 0.22, 1],
                          delay: index * 0.07,
                        }
                      : {
                          duration: 5.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.22,
                        }
                }
                aria-hidden="true"
              />
            ))}
          </div>

          <div className="absolute right-[4%] bottom-7 z-20 w-[min(45%,19rem)] min-w-[16rem] sm:right-[7%] sm:bottom-10 lg:right-[9%]">
            <motion.div
              className="marketing-preview-phone relative mx-auto aspect-[0.56] max-h-[450px] min-h-[390px] rounded-[1.35rem] p-3"
              animate={
                shouldReduceMotion
                  ? { y: 0, rotate: 0 }
                  : isActive
                    ? { y: -8, rotate: 1.4 }
                    : { y: 0, rotate: 0 }
              }
              transition={
                shouldReduceMotion ? { duration: 0 } : settleTransition
              }
            >
              <div className={phoneBackdropClassName} />
              <div className={phoneScreenClassName}>
                <div className="relative h-full p-5">
                  <motion.div
                    className="relative"
                    animate={
                      shouldReduceMotion
                        ? { y: 0 }
                        : isActive
                          ? { y: -92 }
                          : { y: 0 }
                    }
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { ...settleTransition, delay: isActive ? 0.42 : 0 }
                    }
                  >
                    <div className={phoneAvatarPreviewClassName} />
                    {profileDotRows.map((row, rowIndex) => (
                      <div
                        key={rowIndex}
                        className={`mx-auto flex justify-center gap-1.5 ${rowIndex === 0 ? "mt-4" : "mt-2"}`}
                      >
                        {row.map((className, dotIndex) => (
                          <span
                            key={`${className}-${dotIndex}`}
                            className={`${className} rounded-full`}
                          />
                        ))}
                      </div>
                    ))}

                    <div className="mt-7 space-y-3">
                      {phoneLinks.map((className, index) => (
                        <div
                          key={index}
                          className={`marketing-phone-link flex h-13 items-center justify-between px-4 ${className}`}
                        >
                          <span className="bg-brand-eggplant/28 size-3 rounded-full" />
                          <span className="flex gap-1.5">
                            <span className="bg-brand-eggplant/18 size-2 rounded-full" />
                            <span className="bg-brand-eggplant/14 size-2 rounded-full" />
                            <span className="bg-brand-eggplant/18 size-2 rounded-full" />
                          </span>
                          <span className="bg-brand-eggplant/18 size-2 rounded-full" />
                        </div>
                      ))}
                      {addedLinks.map((className, index) => (
                        <motion.div
                          key={index}
                          className={`marketing-phone-link flex h-13 items-center justify-between px-4 ${className}`}
                          animate={
                            shouldReduceMotion
                              ? { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }
                              : isActive
                                ? {
                                    opacity: 1,
                                    x: 0,
                                    y: 0,
                                    rotate: 0,
                                    scale: 1,
                                  }
                                : {
                                    opacity: 0,
                                    x: -150,
                                    y: 42,
                                    rotate: -8,
                                    scale: 0.94,
                                  }
                          }
                          transition={
                            shouldReduceMotion
                              ? { duration: 0 }
                              : {
                                  ...settleTransition,
                                  delay: isActive
                                    ? 0.7 + index * 0.12
                                    : index * 0.04,
                                }
                          }
                        >
                          <span className="bg-brand-eggplant/26 size-3 rounded-full" />
                          <span className="flex gap-1.5">
                            <span className="bg-brand-eggplant/16 size-2 rounded-full" />
                            <span className="bg-brand-eggplant/12 size-2 rounded-full" />
                            <span className="bg-brand-eggplant/16 size-2 rounded-full" />
                          </span>
                          <span className="bg-brand-eggplant/16 size-2 rounded-full" />
                        </motion.div>
                      ))}
                    </div>

                    <div className="marketing-preview-metric-card mt-6 p-4">
                      <div className="flex items-end gap-2">
                        {miniMetrics.map((height, index) => (
                          <span
                            key={index}
                            className={metricBarClassName}
                            style={{ height }}
                          />
                        ))}
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <MousePointerClick className="text-brand-purple size-4" />
                        <BarChart3 className="text-brand-eggplant/55 size-4" />
                        <Sparkles className="text-brand-lime size-4" />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="absolute right-[5%] bottom-5 left-[5%] z-20 flex justify-between sm:hidden">
            {mobileFooterDotRows.map((row, rowIndex) => (
              <span key={rowIndex} className="flex gap-1.5">
                {row.map((className, dotIndex) => (
                  <span
                    key={`${className}-${dotIndex}`}
                    className={`${className} size-2 rounded-full`}
                  />
                ))}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
