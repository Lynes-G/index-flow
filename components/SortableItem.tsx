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
import { Button } from "./ui/button";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Input } from "./ui/input";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

const SortableItem = ({
  id,
  link,
}: {
  id: Id<"links">;
  link: Doc<"links">;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const [editTitle, setEditTitle] = useState(link?.title);
  const [editUrl, setEditUrl] = useState(link?.url);
  const [isUpdating, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);

  const deleteLink = useMutation(api.lib.links.deleteLink);
  const updateLink = useMutation(api.lib.links.updateLink);

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
        let processedUrl = editUrl;
        if (
          !processedUrl.startsWith("https://") &&
          !processedUrl.startsWith("http://")
        ) {
          processedUrl = "https://" + processedUrl;
        }

        await updateLink({
          linkId: id,
          title: editTitle.trim(),
          url: processedUrl.trim(),
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
      className="rounded-lg border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      {isEditing ? (
        <div className="space-y-3">
          <div className="space-y-2">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Link title"
              className="font-semibold"
            />
            <Input
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              placeholder="https://example.com"
              className="text-sm"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              size="sm"
              disabled={isUpdating}
            >
              <X className="size-4" />
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isUpdating || !editTitle.trim() || !editUrl.trim()}
            >
              {isUpdating ? (
                <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Check className="size-4" />
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            aria-describedby={`link-${id}`}
            className="shrink-0 cursor-move rounded p-1 hover:bg-gray-100"
          >
            <GripVertical className="size-4 text-gray-400" />
          </div>

          {/* Link Content */}
          <div className="min-w-0 flex-1 pr-3">
            <h3 className="truncate text-lg font-semibold">{link.title}</h3>
            <p className="truncate text-sm text-gray-600">{link.url}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex shrink-0 items-center gap-1">
            {/* Analyitcs button */}
            <Button variant="outline" size="icon" className="size-8" asChild>
              <Link href={`/dashboard/link/${id}`}>
                <BarChart3 className="size-3.5 text-green-500" />
              </Link>
            </Button>
            {/* Edit button */}
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="size-3.5" />
            </Button>

            {/* Delete button */}
            <Button
              variant="destructive"
              size="icon"
              className="size-8"
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
