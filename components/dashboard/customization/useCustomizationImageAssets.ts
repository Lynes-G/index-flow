"use client";

import type { ChangeEvent, RefObject } from "react";
import { toast } from "sonner";

import type { Id } from "@/convex/_generated/dataModel";
import type {
  CustomizationFormData,
  ImageAssetType,
} from "@/components/dashboard/customization/shared";

type ImageInputRefs = Record<
  ImageAssetType,
  RefObject<HTMLInputElement | null>
>;

type UpdateCustomization = (
  payload:
    | { profilePictureStorageId: Id<"_storage"> }
    | { bannerImageStorageId: Id<"_storage"> }
    | {
        backgroundImageStorageId: Id<"_storage">;
        backgroundType: "image";
        backgroundValue: undefined;
      },
) => Promise<unknown>;

type UseCustomizationImageAssetsOptions = {
  inputRefs: ImageInputRefs;
  generateUploadUrl: () => Promise<string>;
  updateCustomization: UpdateCustomization;
  removeProfileImage: () => Promise<unknown>;
  removeBannerImage: () => Promise<unknown>;
  removeBackgroundImage: () => Promise<unknown>;
  updateFormData: (updates: Partial<CustomizationFormData>) => void;
  startUploading: (callback: () => void) => void;
  startRemoving: (callback: () => void) => void;
};

const reportImageAssetError = (message: string, error: unknown) => {
  console.error(message, error);
};

export const useCustomizationImageAssets = ({
  inputRefs,
  generateUploadUrl,
  updateCustomization,
  removeProfileImage,
  removeBannerImage,
  removeBackgroundImage,
  updateFormData,
  startUploading,
  startRemoving,
}: UseCustomizationImageAssetsOptions) => {
  const clearImageInput = (type: ImageAssetType) => {
    const input = inputRefs[type].current;

    if (input) {
      input.value = "";
    }
  };

  const saveUploadedImage = async (
    type: ImageAssetType,
    storageId: Id<"_storage">,
  ) => {
    if (type === "profile") {
      await updateCustomization({ profilePictureStorageId: storageId });
      return;
    }

    if (type === "banner") {
      await updateCustomization({ bannerImageStorageId: storageId });
      return;
    }

    await updateCustomization({
      backgroundImageStorageId: storageId,
      backgroundType: "image",
      backgroundValue: undefined,
    });
    updateFormData({ backgroundType: "image" });
  };

  const removeImageByType = async (type: ImageAssetType) => {
    if (type === "profile") {
      await removeProfileImage();
      return;
    }

    if (type === "banner") {
      await removeBannerImage();
      return;
    }

    await removeBackgroundImage();
  };

  const handleImageUpload = async (
    event: ChangeEvent<HTMLInputElement>,
    type: ImageAssetType,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit.");
      return;
    }

    startUploading(async () => {
      try {
        const uploadUrl = await generateUploadUrl();
        const uploadResult = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!uploadResult.ok) {
          throw new Error("Upload failed");
        }

        const { storageId } = (await uploadResult.json()) as {
          storageId: Id<"_storage">;
        };
        await saveUploadedImage(type, storageId);
        toast.success("Image uploaded successfully.");
      } catch (error) {
        reportImageAssetError("Upload failed", error);
        toast.error("Failed to upload image.");
      } finally {
        clearImageInput(type);
      }
    });
  };

  const handleRemoveImage = (type: ImageAssetType) => {
    startRemoving(async () => {
      try {
        await removeImageByType(type);
        toast.success("Image removed successfully.");
      } catch (error) {
        reportImageAssetError("Failed to remove image", error);
        toast.error("Failed to remove image.");
      }
    });
  };

  return {
    handleImageUpload,
    handleRemoveImage,
  };
};
