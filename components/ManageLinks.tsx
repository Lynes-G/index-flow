"use client";

import { api } from "@/convex/_generated/api";
import { useLinkCreationSheet } from "@/components/LinkCreationSheetProvider";
import {
  Preloaded,
  useMutation,
  usePreloadedQuery,
  useQuery,
} from "convex/react";
import { useUser } from "@clerk/nextjs";
import { CSSProperties, useEffect, useMemo, useState } from "react";
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
import { Button } from "./ui/button";
import { Link2, Plus } from "lucide-react";
import SortableItem from "./SortableItem";
import { Id } from "@/convex/_generated/dataModel";
import { getAccentForeground } from "@/lib/accentColor";
import { defaultThemePresetKey, resolveThemePreset } from "@/lib/themePresets";
import { toast } from "sonner";

const ManageLinks = ({
  preloadedLinks,
}: {
  preloadedLinks: Preloaded<typeof api.lib.links.getLinksByUserId>;
}) => {
  const { user } = useUser();
  const { openCreateLinkSheet } = useLinkCreationSheet();
  const links = usePreloadedQuery(preloadedLinks);
  const updateLinkOrder = useMutation(api.lib.links.updateLinkOrder);
  const existingCustomization = useQuery(
    api.lib.userCustomization.getUserCustomizations,
    user ? { userId: user.id } : "skip",
  );

  const [items, setItems] = useState(links.map((link) => link._id));

  useEffect(() => {
    setItems(links.map((link) => link._id));
  }, [links]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Create a map for quick link lookup
  const linkMap = useMemo(() => {
    return Object.fromEntries(links.map((link) => [link._id, link]));
  }, [links]);

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = items.indexOf(active.id as Id<"links">);
    const newIndex = items.indexOf(over.id as Id<"links">);

    if (oldIndex < 0 || newIndex < 0) {
      return;
    }

    const reorderedItems = arrayMove(items, oldIndex, newIndex);
    setItems(reorderedItems);

    try {
      await updateLinkOrder({ linkIds: reorderedItems });
    } catch {
      setItems(items);
      toast.error("Could not save the new link order. Please try again.");
    }
  };

  // ---------------------------------------------------------------
  const hasLinks = items.length > 0;
  const defaultAccentColor = resolveThemePreset(
    defaultThemePresetKey,
  ).accentColor;
  const accentColor = existingCustomization?.accentColor || defaultAccentColor;
  const accentForeground = getAccentForeground(accentColor);
  const addLinkButtonStyle = {
    "--accent-color": accentColor,
    "--accent-foreground": accentForeground,
    "--accent-soft": `${accentColor}12`,
    "--accent-ring": `${accentColor}55`,
  } as CSSProperties;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 border-b border-slate-200/80 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-slate-500 uppercase">
            Links workspace
          </p>
          <p className="text-sm leading-6 text-slate-600">
            Reorder, edit, and prune the destinations visitors see on your
            public page.
          </p>
        </div>
        <p className="text-sm text-slate-500">
          {hasLinks ? `${items.length} links ready` : "Ready for your first link"}
        </p>
      </div>
      {hasLinks ? (
        <div className="space-y-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {items.map((id) => {
                  const link = linkMap[id];
                  return <SortableItem key={id} id={id} link={link} />;
                })}
              </div>
            </SortableContext>
          </DndContext>
          <div className="rounded-[1.25rem] border border-slate-200/80 bg-white/70 px-4 py-3 text-xs leading-5 text-slate-500">
            <p className="font-semibold tracking-[0.18em] text-slate-700 uppercase">
              Keyboard tip
            </p>
            <p className="mt-1">
              Press space to lift a link, use arrow keys to move it, then press
              space again to drop it.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-[1.6rem] border border-slate-200/80 bg-white/72 p-6 text-center sm:p-8">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm">
            <Link2 className="size-6" />
          </div>
          <p className="mt-4 text-base font-semibold text-slate-900">
            No links yet
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Add your first link to start building your page.
          </p>
        </div>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          {hasLinks
            ? "Keep your strongest call to action near the top so visitors know where to go first."
            : "Start with one destination, then add the next most useful step for your visitors."}
        </p>
        <Button
          variant="outline"
          type="button"
          onClick={openCreateLinkSheet}
          className="hover:text-accent-foreground h-12 w-full rounded-2xl border-(--accent-color) bg-(--accent-soft) text-(--accent-color) transition-all duration-200 hover:border-(--accent-color) hover:bg-(--accent-color) focus-visible:ring-(--accent-ring) focus-visible:ring-offset-2 focus-visible:outline-none sm:w-auto sm:min-w-[180px]"
          style={addLinkButtonStyle}
        >
          <span className="flex items-center justify-center gap-2">
            <Plus className="size-4" />
            Add New Link
          </span>
        </Button>
      </div>
    </div>
  );
};

export default ManageLinks;
