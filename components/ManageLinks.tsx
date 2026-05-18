"use client";

import { api } from "@/convex/_generated/api";
import { Preloaded, useMutation, usePreloadedQuery, useQuery } from "convex/react";
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
import Link from "next/link";
import { Plus } from "lucide-react";
import SortableItem from "./SortableItem";
import { Id } from "@/convex/_generated/dataModel";
import { getAccentForeground } from "@/lib/accentColor";
import { defaultThemePresetKey, resolveThemePreset } from "@/lib/themePresets";

const ManageLinks = ({
  preloadedLinks,
}: {
  preloadedLinks: Preloaded<typeof api.lib.links.getLinksByUserId>;
}) => {
  const { user } = useUser();
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

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;

    if (!over) return;
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id as Id<"links">);
        const newIndex = items.indexOf(over.id as Id<"links">);
        const newItems = arrayMove(items, oldIndex, newIndex);

        // Update the order in the DB
        updateLinkOrder({ linkIds: newItems });
        return newItems;
      });
    }
  };

  // ---------------------------------------------------------------
  const hasLinks = items.length > 0;
  const defaultAccentColor =
    resolveThemePreset(defaultThemePresetKey).accentColor;
  const accentColor = existingCustomization?.accentColor || defaultAccentColor;
  const accentForeground = getAccentForeground(accentColor);

  return (
    <>
      {hasLinks ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {items.map((id) => {
                const link = linkMap[id];
                return <SortableItem key={id} id={id} link={link} />;
              })}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
          <p className="text-sm font-semibold text-slate-900">No links yet</p>
          <p className="mt-1 text-sm text-slate-600">
            Add your first link to start building your page.
          </p>
        </div>
      )}
      {hasLinks && (
        <p className="mt-3 text-xs text-slate-500">
          Tip: Press space to lift a link, use arrow keys to move, then press
          space to drop.
        </p>
      )}
      <Button
        variant="outline"
        className="mt-4 w-full border-[var(--accent-color)] bg-[var(--accent-soft)] text-[var(--accent-color)] transition-all duration-200 hover:border-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:text-[var(--accent-foreground)] focus-visible:ring-[var(--accent-ring)] focus-visible:ring-offset-2 focus-visible:outline-none"
        style={
          {
            "--accent-color": accentColor,
            "--accent-foreground": accentForeground,
            "--accent-soft": `${accentColor}12`,
            "--accent-ring": `${accentColor}55`,
          } as CSSProperties
        }
        asChild
      >
        <Link
          href="/dashboard/new-link"
          className="flex items-center justify-center gap-2"
        >
          <Plus className="mr-2 size-4" />
          Add New Link
        </Link>
      </Button>
    </>
  );
};

export default ManageLinks;
