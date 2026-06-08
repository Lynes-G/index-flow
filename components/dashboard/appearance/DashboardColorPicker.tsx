"use client";

import { useEffect, useRef, useState } from "react";
import { Palette } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Button as AriaButton,
  ColorArea,
  ColorField,
  ColorPicker as AriaColorPicker,
  ColorSlider,
  ColorThumb,
  Dialog,
  DialogTrigger,
  Input as AriaInput,
  Label as AriaLabel,
  Popover,
  SliderTrack,
  parseColor,
  type Color,
} from "react-aria-components";

type DashboardColorPickerProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
  dialogTitle?: string;
  dialogDescription?: string;
  triggerTitle?: string;
};

const colorPickerTriggerClassName =
  "group flex min-h-12 w-full items-start justify-between gap-3 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-left shadow-sm transition hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/15 sm:items-center";

const colorPickerPopoverClassName =
  "w-[min(92vw,360px)] rounded-[24px] border border-slate-200 bg-white p-3.5 shadow-[0_30px_90px_rgba(15,23,42,0.18)] sm:p-4";

const colorPickerThumbClassName =
  "block size-4 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(15,23,42,0.18),0_4px_14px_rgba(15,23,42,0.2)] focus:outline-none";

const colorPickerInputClassName =
  "h-11 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-900 transition outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10";

const hueSliderTrackStyle = {
  background:
    "linear-gradient(90deg, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",
};

const DashboardColorPicker = ({
  label,
  value,
  onChange,
  helperText,
  dialogTitle = "Choose color",
  dialogDescription = "Saturation means how vivid the color is. Brightness means how light or dark it feels.",
  triggerTitle = "Open color picker",
}: DashboardColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLElement>(null);
  const parsedColor = parseColor(value);

  const handleColorChange = (nextColor: Color) => {
    onChange(nextColor.toString("hex"));
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (
        rootRef.current?.contains(target) ||
        popoverRef.current?.contains(target)
      ) {
        return;
      }

      setIsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown, true);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
    };
  }, [isOpen]);

  return (
    <div ref={rootRef} className="space-y-3">
      <div className="space-y-2">
        <Label>{label}</Label>
        <AriaColorPicker value={parsedColor} onChange={handleColorChange}>
          <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
            <AriaButton className={colorPickerTriggerClassName}>
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className="size-6 rounded-lg border border-slate-200 shadow-inner"
                  style={{ backgroundColor: value }}
                />
                <div className="min-w-0">
                  <p className="text-sm leading-5 font-medium text-slate-900">
                    {triggerTitle}
                  </p>
                  <p className="text-xs break-all text-slate-500">{value}</p>
                </div>
              </div>
              <Palette className="mt-0.5 size-4 shrink-0 text-slate-400 transition group-hover:text-slate-600 sm:mt-0" />
            </AriaButton>
            <Popover
              ref={popoverRef}
              isNonModal
              shouldCloseOnInteractOutside={() => true}
              placement="bottom start"
              offset={10}
              className={colorPickerPopoverClassName}
            >
              <Dialog className="space-y-4 outline-none">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {dialogTitle}
                  </p>
                  <p className="text-xs text-slate-500">{dialogDescription}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-slate-600">
                    Saturation and brightness
                  </p>
                  <ColorArea
                    colorSpace="hsb"
                    xChannel="saturation"
                    yChannel="brightness"
                    className="relative block h-48 w-full overflow-hidden rounded-lg border border-slate-200 shadow-inner"
                  >
                    <ColorThumb className={colorPickerThumbClassName} />
                  </ColorArea>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-slate-600">Hue</p>
                    <span className="text-xs text-slate-500">{value}</span>
                  </div>
                  <ColorSlider
                    colorSpace="hsb"
                    channel="hue"
                    className="w-full"
                  >
                    <SliderTrack
                      className="relative block h-4 w-full rounded-full border border-slate-200"
                      style={hueSliderTrackStyle}
                    >
                      <ColorThumb
                        className={`${colorPickerThumbClassName} top-1/2 -translate-y-1/2 bg-white`}
                      />
                    </SliderTrack>
                  </ColorSlider>
                </div>

                <ColorField className="space-y-2">
                  <AriaLabel className="text-xs font-medium text-slate-600">
                    Hex
                  </AriaLabel>
                  <AriaInput className={colorPickerInputClassName} />
                </ColorField>
              </Dialog>
            </Popover>
          </DialogTrigger>
        </AriaColorPicker>
      </div>
      {helperText ? (
        <p className="text-xs leading-5 text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
};

export default DashboardColorPicker;
