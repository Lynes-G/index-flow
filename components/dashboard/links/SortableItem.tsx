"use client";

import { Doc, Id } from "@/convex/_generated/dataModel";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  BarChart3,
  Check,
  GripVertical,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { dashboardSurfaceClasses } from "@/components/dashboard/styles";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { normalizeExternalUrl } from "@/lib/frontend/shared/externalLinks";
import { toast } from "sonner";

const sortableEditTitleInputClassName =
  "h-11 border-slate-200 bg-white font-semibold text-slate-900 placeholder:text-slate-400";

const sortableEditUrlInputClassName =
  "h-11 border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400";

const sortableActionButtonClassName =
  "size-9 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50";

const SortableItem = ({
  id,
  link,
  isReadOnly = false,
}: {
  id: Id<"links">;
  link: Doc<"links">;
  isReadOnly?: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const [editTitle, setEditTitle] = useState(link?.title);
  const [editUrl, setEditUrl] = useState(link?.url);
  const [isUpdating, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);

  const deleteLink = useMutation(api.lib.links.deleteLink);
  const updateLink = useMutation(api.lib.links.updateLink);

  const dragHandleProps = isReadOnly
    ? {}
    : {
        ...attributes,
        ...listeners,
      };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleCancel = () => {
    setEditTitle(link?.title);
    setEditUrl(link?.url);
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!editTitle.trim() || !editUrl.trim()) return;

    startTransition(async () => {
      try {
        const processedUrl = normalizeExternalUrl(editUrl);
        if (!processedUrl) {
          toast.error("Please enter a valid http or https URL.");
          return;
        }

        await updateLink({
          linkId: id,
          title: editTitle.trim(),
          url: processedUrl,
        });
        setIsEditing(false);
        toast.success("Link updated successfully!");
      } catch (err) {
        console.error("Failed to update link:", err);
        toast.error("Failed to update link. Please try again.");
      }
    });
  };

  if (!link) return null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${dashboardSurfaceClasses.card} ${dashboardSurfaceClasses.cardPadding} transition-all hover:border-slate-300 hover:shadow-md`}
    >
      {isEditing ? (
        <div className="space-y-3.5 sm:space-y-4">
          <div
            className={`${dashboardSurfaceClasses.inset} ${dashboardSurfaceClasses.cardPaddingCompact}`}
          >
            <p className="text-sm font-semibold text-slate-900">Edit link</p>
            <p className="mt-1 text-sm text-slate-600">
              Update the title and destination, then save to refresh this link
              on your page.
            </p>
          </div>
          <div className="space-y-3">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Link title"
              className={sortableEditTitleInputClassName}
            />
            <Input
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              placeholder="https://example.com"
              className={sortableEditUrlInputClassName}
            />
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              size="sm"
              disabled={isUpdating}
              className="rounded-lg border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            >
              <X className="size-4" />
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isUpdating || !editTitle.trim() || !editUrl.trim()}
              className="rounded-lg"
            >
              {isUpdating ? (
                <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Check className="size-4" />
              )}
              Save changes
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-2.5 sm:items-center sm:gap-3">
          <div
            {...dragHandleProps}
            aria-describedby={`link-${id}`}
            className="shrink-0 rounded-lg border border-transparent bg-slate-50 p-2 transition-colors hover:border-slate-200 hover:bg-slate-100"
          >
            <GripVertical
              className={`size-4 text-slate-400 ${isReadOnly ? "opacity-45" : ""}`}
            />
          </div>

          <div className="min-w-0 flex-1 pr-1 sm:pr-3">
            <h3 className="truncate text-base font-semibold text-slate-900">
              {link.title}
            </h3>
            <p className="truncate text-sm text-slate-600">{link.url}</p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5 sm:gap-2">
            <Button
              variant="outline"
              size="icon"
              className={sortableActionButtonClassName}
              aria-label={`View analytics for ${link.title}`}
              asChild
            >
              <Link href={`/dashboard/link/${id}`}>
                <BarChart3 className="size-3.5 text-green-500" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={sortableActionButtonClassName}
              aria-label={`Edit ${link.title}`}
              disabled={isReadOnly}
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="size-3.5" />
            </Button>

            <Button
              variant="destructive"
              size="icon"
              className="size-9 rounded-lg"
              aria-label={`Delete ${link.title}`}
              disabled={isReadOnly}
              onClick={(e) => {
                e.stopPropagation();
                const isConfirmed = confirm(
                  `Are you sure you want to delete the link "${link.title}"? This action cannot be undone.`,
                );
                if (isConfirmed) {
                  deleteLink({ linkId: id });
                }
              }}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SortableItem;
