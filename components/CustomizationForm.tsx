"use client";

import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { ImageIcon, Palette, Upload, X } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

const CustomizationForm = () => {
  const { user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateCustomization = useMutation(
    api.lib.userCustomization.updateCustomizations,
  );

  const generateUploadUrl = useMutation(
    api.lib.userCustomization.generateUploadUrl,
  );

  const removeProfileImage = useMutation(
    api.lib.userCustomization.removeProfilePicture,
  );

  const existingCustomization = useQuery(
    api.lib.userCustomization.getUserCustomizations,
    user ? { userId: user.id } : "skip",
  );

  const [formData, setFormData] = useState({
    description: "",
    accentColor: "#6366f1", // Default to indigo-500
  });

  const [isLoading, startTransition] = useTransition();
  const [isUploading, startUploading] = useTransition();

  useEffect(() => {
    if (existingCustomization) {
      setFormData({
        description: existingCustomization.description || "",
        accentColor: existingCustomization.accentColor || "#6366f1",
      });
    }
  }, [existingCustomization]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    startTransition(async () => {
      try {
        await updateCustomization({
          description: formData.description || undefined,
          accentColor: formData.accentColor || undefined,
        });
        toast.success("Customizations saved successfully.");
      } catch (err) {
        console.log("Failed to save customizations:", err);
        toast.error("Failed to save customizations.");
      }
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type (basic check)
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }

    // Validate file size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit.");
      return;
    }

    startUploading(async () => {
      try {
        // Get upload URL from the server
        const uploadUrl = await generateUploadUrl();

        // Upload the file to the generated URL
        const uploadResult = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!uploadResult.ok) throw new Error("Upload failed");

        const { storageId } = await uploadResult.json();

        // Update customzation with new storage ID
        await updateCustomization({
          profilePictureStorageId: storageId,
          description: formData.description || undefined,
          accentColor: formData.accentColor || undefined,
        });
        toast.success("Profile picture uploaded successfully.");
      } catch (err) {
        console.log("Upload failed", err);
        toast.error("Failed to upload profile picture.");
      } finally {
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    });
  };

  const handleRemoveImage = () => {
    startTransition(async () => {
      try {
        await removeProfileImage();
        toast.success("Profile picture removed successfully.");
      } catch (err) {
        console.log("Failed to remove image", err);
        toast.error("Failed to remove profile picture.");
      }
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ----------------------------------------------------------------------

  return (
    <div className="w-full rounded-2xl border border-white/20 bg-white/80 p-8 shadow-xl shadow-gray-200/50 backdrop-blur-sm">
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-3">
          <div className="rounded-lg bg-linear-to-br from-purple-500 to-pink-500 p-2">
            <Palette className="size-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Customize your page
            </h2>
            <p className="text-sm text-gray-600">
              Make your page stand out with a profile picture, description, and
              accent color.
            </p>
          </div>
        </div>
      </div>

      {/* Form elements will go here */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture Upload */}
        <div className="space-y-4">
          <Label className="flex items-center gap-2">
            <ImageIcon className="size-4" />
            Profile Picture
          </Label>

          {/* Current image display */}
          {existingCustomization?.profilePictureUrl && (
            <div className="flex items-center gap-4 rounded-lg bg-gray-50 p-4">
              <div className="size-16 overflow-hidden rounded-lg">
                <Image
                  src={existingCustomization.profilePictureUrl}
                  alt="Current Profile Picture"
                  width={64}
                  height={64}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">
                  Current Profile Picture
                </p>
                <p className="text-xs text-gray-500">
                  Click &ldquo; Remove&rdquo; to delete this image.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemoveImage}
                disabled={isUploading}
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <X className="mr-1 size-4" />
                Remove
              </Button>
            </div>
          )}

          {/* File Upload */}
          <div className="flex items-center gap-4">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-2"
            >
              <Upload className="size-4" />
              {isUploading ? "Uploading..." : "Upload New Image"}
            </Button>
            <p className="text-sm text-gray-500">
              Max 5MB. Supports JPG, PNG, WebP
            </p>
          </div>
        </div>

        {/* Description Input */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Tell visitors about yourself..."
            rows={3}
            maxLength={200}
            className="resize-vertical max-h-[200px] min-h-[100px] w-full rounded-md border border-gray-300 px-3 py-2 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none"
          />
          <p className="text-sm text-gray-500">
            {formData.description.length}/200 characters
          </p>
        </div>

        {/* Accent Color Picker */}
        <div className="space-y-3">
          <Label htmlFor="accentColor">Accent Color</Label>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formData.accentColor}
                onChange={(e) =>
                  handleInputChange("accentColor", e.target.value)
                }
                className="size-12 cursor-pointer rounded-lg border-2 border-gray-300"
              />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Choose your brand color
                </p>
                <p className="text-xs text-gray-500">{formData.accentColor}</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            This color will be used for buttons and links on your page.
          </p>
        </div>

        {/* Save button */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={isUploading || isLoading}
            className="w-full bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {isLoading ? "Saving..." : "Save Customizations"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CustomizationForm;
