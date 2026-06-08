"use client";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useLinkCreationSheet } from "@/components/dashboard/links/LinkCreationSheetProvider";
import { useMutation } from "convex/react";
import {
  CSSProperties,
  Dispatch,
  SetStateAction,
  useMemo,
  useRef,
} from "react";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import DashboardGuidedEmptyState from "@/components/dashboard/setup/DashboardGuidedEmptyState";
import { dashboardSurfaceClasses } from "@/components/dashboard/styles";
import { Button } from "@/components/ui/button";
import { Link2, Plus, Sparkles } from "lucide-react";
import SortableItem from "./SortableItem";
import { getAccentForeground } from "@/lib/frontend/shared/accentColor";
import {
  defaultThemePresetKey,
  resolveThemePreset,
} from "@/lib/frontend/appearance/themePresets";
import { toast } from "sonner";

const getEmptyStateCopy = (hasLinks: boolean, linkCount: number) => ({
  helperText: hasLinks
    ? `${linkCount} links ready`
    : "Ready for your first link",
  statusText: hasLinks ? "Drag to reorder" : "Start by adding one link",
  footerText: hasLinks
    ? "Keep the strongest link near the top."
    : "Start with one clear destination.",
});

const createAddLinkButtonStyle = (accentColor: string) => ({
  "--accent-color": accentColor,
  "--accent-foreground": getAccentForeground(accentColor),
  "--accent-soft": `${accentColor}12`,
  "--accent-ring": `${accentColor}55`,
  "--accent-shadow": `${accentColor}40`,
});

const reorderLinkIds = (
  linkIds: Id<"links">[],
  activeId: Id<"links">,
  overId: Id<"links">,
) => {
  const oldIndex = linkIds.indexOf(activeId);
  const newIndex = linkIds.indexOf(overId);

  if (oldIndex < 0 || newIndex < 0) {
    return null;
  }

  return arrayMove(linkIds, oldIndex, newIndex);
};

const ManageLinks = ({
  links,
  items,
  setItems,
  accentColor,
  isReadOnly = false,
}: {
  links: Doc<"links">[];
  items: Id<"links">[];
  setItems: Dispatch<SetStateAction<Id<"links">[]>>;
  accentColor?: string | null;
  isReadOnly?: boolean;
}) => {
  const { openCreateLinkSheet } = useLinkCreationSheet();
  const updateLinkOrder = useMutation(api.lib.links.updateLinkOrder);
  const latestReorderOperationRef = useRef(0);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // The drag list stores ids, so we keep a fast lookup map for rendering rows.
  const linkMap = useMemo(() => {
    return new Map(links.map((link) => [link._id, link]));
  }, [links]);

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (isReadOnly) {
      return;
    }

    if (!over || active.id === over.id) {
      return;
    }

    const reorderedItems = reorderLinkIds(
      items,
      active.id as Id<"links">,
      over.id as Id<"links">,
    );

    if (!reorderedItems) {
      return;
    }

    const previousItems = items;
    const reorderOperationId = latestReorderOperationRef.current + 1;
    latestReorderOperationRef.current = reorderOperationId;
    setItems(reorderedItems);

    try {
      await updateLinkOrder({ linkIds: reorderedItems });
    } catch {
      // Only roll back the request that actually failed.
      // This avoids a stale failure undoing a newer successful reorder.
      setItems((currentItems) =>
        latestReorderOperationRef.current === reorderOperationId
          ? previousItems
          : currentItems,
      );
      toast.error("Could not save the new link order. Please try again.");
    }
  };

  // ---------------------------------------------------------------
  const hasLinks = items.length > 0;
  const defaultAccentColor = resolveThemePreset(
    defaultThemePresetKey,
  ).accentColor;
  const resolvedAccentColor = accentColor || defaultAccentColor;
  const copy = isReadOnly
    ? {
        helperText: hasLinks
          ? `${items.length} links in read-only preview`
          : "Read-only preview mode",
        statusText: "Preview only",
        footerText: "Sign in without preview mode to add and reorder links.",
      }
    : getEmptyStateCopy(hasLinks, items.length);
  const addLinkButtonStyle = createAddLinkButtonStyle(
    resolvedAccentColor,
  ) as CSSProperties;

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex flex-col gap-2.5 border-b border-slate-200/80 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-slate-500 uppercase">
            Links workspace
          </p>
          <div className="inline-flex w-fit items-center rounded-full border border-slate-200/80 bg-white px-3 py-1 text-[11px] font-medium text-slate-600 sm:text-xs">
            {copy.statusText}
          </div>
        </div>
        <p className="text-[13px] text-slate-500 sm:text-sm">
          {copy.helperText}
        </p>
      </div>
      {hasLinks ? (
        <div className="space-y-3.5 sm:space-y-4">
          {/* DnD is kept close to the rendered list so the reorder flow is easy to follow:
              read ids -> render rows -> save the new order on drop. */}
          <>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={items}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2.5 sm:space-y-3">
                  {items.map((id) => {
                    const link = linkMap.get(id);

                    if (!link) {
                      return null;
                    }

                    return (
                      <SortableItem
                        key={id}
                        id={id}
                        link={link}
                        isReadOnly={isReadOnly}
                      />
                    );
                  })}
                </div>
              </SortableContext>
            </DndContext>
            {!isReadOnly ? (
              <div
                className={`${dashboardSurfaceClasses.inset} hidden px-3.5 py-3 text-xs leading-5 text-slate-500 sm:block sm:px-4`}
              >
                <p className="font-semibold tracking-[0.18em] text-slate-700 uppercase">
                  Keyboard tip
                </p>
                <p className="mt-1">
                  Press space to lift, arrows to move, then space to drop.
                </p>
              </div>
            ) : null}
          </>
        </div>
      ) : (
        <DashboardGuidedEmptyState
          eyebrow={isReadOnly ? "Preview mode" : "Links empty state"}
          title={
            isReadOnly
              ? "Link editing is paused in preview"
              : "Start with one strong first link"
          }
          description={
            isReadOnly
              ? "This preview shows how the workspace behaves before a user signs in. Switch out of preview mode to add, edit, and reorder real links."
              : "Think of this like the front door of your page. Add the one destination you most want visitors to open first, then stack supporting links underneath it."
          }
          icon={Link2}
          steps={
            isReadOnly
              ? [
                  {
                    title: "Review the workspace",
                    description:
                      "Use this mode to inspect the dashboard layout without changing real account data.",
                  },
                  {
                    title: "Sign in normally",
                    description:
                      "Open the dashboard without preview mode when you are ready to add real profile links.",
                  },
                  {
                    title: "Create the first destination",
                    description:
                      "Start with one clear URL such as a portfolio, store, booking page, or latest post.",
                  },
                ]
              : [
                  {
                    title: "Add the main destination",
                    description:
                      "Start with the page that matters most, like your portfolio, store, newsletter, or current campaign.",
                  },
                  {
                    title: "Keep the label obvious",
                    description:
                      "Use simple titles visitors can understand in one glance, such as View portfolio or Book a call.",
                  },
                  {
                    title: "Style the page after the order feels right",
                    description:
                      "Once the important links are in place, head to Appearance to shape the page around them.",
                  },
                ]
          }
          actions={
            isReadOnly
              ? []
              : [
                  {
                    label: "Add your first link",
                    onClick: openCreateLinkSheet,
                    variant: "primary",
                    icon: Plus,
                  },
                  {
                    label: "Plan the page style next",
                    href: "/dashboard/appearance",
                    icon: Sparkles,
                  },
                ]
          }
          note={
            <p>
              Pages usually convert better when the first link matches the
              visitor&apos;s main reason for opening your profile.
            </p>
          }
        />
      )}
      <div
        className={`${dashboardSurfaceClasses.card} p-3 sm:flex sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:p-3.5`}
      >
        <p className="hidden text-sm text-slate-600 sm:block">
          {copy.footerText}
        </p>
        <Button
          variant="accent"
          type="button"
          onClick={openCreateLinkSheet}
          disabled={isReadOnly}
          size="lg"
          className="w-full sm:w-auto sm:min-w-[180px]"
          style={addLinkButtonStyle}
        >
          <span className="flex items-center justify-center gap-2">
            <Plus className="size-4" />
            {isReadOnly ? "Read-only preview" : "Add Link"}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default ManageLinks;
