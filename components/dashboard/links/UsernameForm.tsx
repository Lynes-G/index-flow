"use client";

import { usernameFormSchema, UsernameFormData } from "@/schemas/formSchema";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  CheckCircle,
  Copy,
  Loader2,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getBaseUrl } from "@/lib/frontend/shared/getBaseUrl";
import { toast } from "sonner";

const UsernameForm = () => {
  const { user } = useUser();
  const [debouncedUsername, setDebouncedUsername] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<UsernameFormData>({
    resolver: zodResolver(usernameFormSchema),
    defaultValues: {
      username: "",
    },
  });

  const watchedUsername = form.watch("username");
  // Debounce the username input to avoid excessive queries
  useEffect(() => {
    if (!isEditing) {
      setDebouncedUsername("");
      return;
    }
    const handler = setTimeout(() => {
      setDebouncedUsername(watchedUsername);
    }, 500); // 500ms delay;

    return () => clearTimeout(handler); // Cleanup on unmount or when watchedUsername changes
  }, [watchedUsername, isEditing]);

  const currentSlug = useQuery(
    api.lib.usernames.getUserSlug,
    user?.id ? { userId: user.id } : "skip",
  );
  const resolvedSlug = currentSlug ?? user?.id ?? "";
  const publicProfileUrl = resolvedSlug
    ? `${getBaseUrl()}/u/${resolvedSlug}`
    : "";

  const availabilityCheck = useQuery(
    api.lib.usernames.checkUsernameAvailability,
    debouncedUsername.length >= 3 ? { username: debouncedUsername } : "skip",
  );

  const setUsername = useMutation(api.lib.usernames.setUsername);

  // Determine the status of the username input:
  // - Returns null if username is empty or less than 3 characters
  // - Returns "checking" if username is being debounced or availability check is in progress
  // - Returns "current" if username matches current user's slug
  // - Returns "available" if username is available
  // - Returns "unavailable" if username is taken

  const getStatus = () => {
    if (!isEditing) return currentSlug ? "current" : null;
    if (!debouncedUsername || debouncedUsername.length < 3) return null;
    if (debouncedUsername !== watchedUsername) return "checking";
    if (!availabilityCheck) return "checking";
    if (debouncedUsername === currentSlug) return "current";
    return availabilityCheck.available ? "available" : "unavailable";
  };

  const status = getStatus();

  const hasCustomUsername = currentSlug && currentSlug !== user?.id;
  const isSubmitDisabled =
    !isEditing || status !== "available" || form.formState.isSubmitting;

  const onSubmit = async (data: UsernameFormData) => {
    if (!user?.id) return;

    try {
      const response = await setUsername({ username: data.username });
      if (response.success) {
        setIsEditing(false);
        form.reset();
      } else {
        form.setError("username", {
          type: "server",
          message: response.error || "Failed to update username.",
        });
      }
    } catch {
      form.setError("username", {
        type: "server",
        message:
          "An error occurred while updating the username, please try again.",
      });
    }
  };

  useEffect(() => {
    if (!currentSlug || isEditing) return;
    form.setValue("username", currentSlug, { shouldDirty: false });
  }, [currentSlug, form, isEditing]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="shadow-brand-purple-sm border-brand-eggplant bg-riso-paper hidden rounded-none border-2 p-4 sm:block sm:p-5">
        <p className="text-sm leading-6 font-semibold tracking-[0.06em] text-slate-600 uppercase">
          This becomes your public `/u/...` link.
        </p>
      </div>

      {hasCustomUsername && (
        <div className="shadow-brand-purple-sm rounded-none border-2 border-emerald-800 bg-emerald-50/90 px-3.5 py-3 sm:px-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-800">
              <User className="size-4" />
              <p className="text-xs font-semibold tracking-[0.18em] uppercase">
                Current username
              </p>
            </div>
            <p className="font-mono text-sm text-emerald-950">
              {resolvedSlug}
            </p>
          </div>
        </div>
      )}

      <div className="shadow-brand-purple-md border-brand-eggplant rounded-none border-2 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,251,239,0.94))] p-3 sm:p-4">
        <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
          Public URL
        </p>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
          <div
            className="min-w-0 flex-1 rounded-none border-2 border-slate-300 bg-slate-50 px-3 py-2 font-mono text-sm break-all text-slate-800"
          >
            {publicProfileUrl || "Loading your public URL..."}
          </div>
          <Button
            type="button"
            onClick={() => {
              if (!publicProfileUrl) return;
              navigator.clipboard.writeText(publicProfileUrl);
              toast.success("Copied to clipboard!");
            }}
            variant="outline"
            size="icon-lg"
            className="w-full sm:w-11"
            title="Copy to clipboard"
            aria-label="Copy public URL"
          >
            <Copy className="size-5 text-slate-500" />
          </Button>
        </div>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-3.5 sm:space-y-4"
      >
        <FieldSet>
          <FieldGroup className="shadow-brand-purple-md border-brand-eggplant rounded-none border-2 bg-white/92 p-3.5 sm:p-5">
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <div className="flex flex-col gap-2.5">
                    <div className="relative min-w-0 flex-1">
                      <Input
                        {...field}
                        id="username"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter your username"
                        autoComplete="off"
                        className="dashboard-brutalist-input focus:ring-brand-accent pr-8 focus:ring-2"
                        disabled={!isEditing}
                      />

                      <div className="absolute top-1/2 right-3 -translate-y-1/2 transform">
                        {status === "checking" && (
                          <Loader2 className="size-4 animate-spin text-gray-400" />
                        )}
                        {status === "available" && (
                          <CheckCircle className="size-4 text-green-500" />
                        )}
                        {status === "current" && (
                          <User className="size-4 text-blue-500" />
                        )}
                        {status === "unavailable" && (
                          <AlertCircle className="size-4 text-red-500" />
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 min-[420px]:flex-row">
                      <Button
                        type="button"
                        variant={isEditing ? "outline" : "default"}
                        size="action"
                        className="w-full font-black uppercase min-[420px]:w-auto"
                        onClick={() => {
                          if (isEditing) {
                            setIsEditing(false);
                            if (currentSlug) {
                              form.setValue("username", currentSlug, {
                                shouldDirty: false,
                              });
                            }
                          } else {
                            setIsEditing(true);
                          }
                        }}
                      >
                        {isEditing ? "Cancel" : "Edit"}
                      </Button>
                    </div>
                  </div>
                </Field>
              )}
            />
            <FieldGroup className="gap-1">
              <FieldDescription className="text-[13px] leading-5 sm:text-sm sm:leading-normal">
                Use letters, numbers, and underscores.
              </FieldDescription>
              {status === "available" && (
                <p className="text-sm text-green-600">Username is available!</p>
              )}
              {status === "current" && null}
              {status === "unavailable" && (
                <p className="text-sm text-red-600">
                  {availabilityCheck?.error || "This username is unavailable."}
                </p>
              )}
              <FieldError
                errors={
                  form.formState.errors.username
                    ? [form.formState.errors.username]
                    : []
                }
              />
            </FieldGroup>
          </FieldGroup>
        </FieldSet>

        <div className="flex justify-end pt-1">
          <Button
            type="submit"
            size="lg"
            className="w-full text-sm font-black uppercase sm:w-auto sm:min-w-44"
            disabled={isSubmitDisabled}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Username"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UsernameForm;
