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
  ExternalLink,
  Loader2,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { getBaseUrl } from "@/lib/getBaseUrl";
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
  const publicProfileUrl = `${getBaseUrl()}/u/${currentSlug}`;

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
    console.log("Form submitted with data:", data);
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
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-[11px] font-semibold tracking-[0.22em] text-[color:var(--brand-purple)] uppercase">
          Username
        </p>
        <h3 className="font-['Sora',sans-serif] text-2xl font-semibold tracking-[-0.04em] text-slate-900 sm:text-[1.75rem]">
          Customize your public link
        </h3>
        <p className="text-sm leading-6 text-slate-600 sm:text-base">
          Choose a custom username for you link-in-bio page. This will be your
          public URL.
        </p>
      </div>

      {hasCustomUsername && (
        <div className="rounded-[1.25rem] border border-emerald-200/80 bg-emerald-50/85 px-4 py-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-800">
                <User className="size-4" />
                <p className="text-xs font-semibold tracking-[0.18em] uppercase">
                  Current username
                </p>
              </div>
              <p className="font-mono text-sm text-emerald-950">{currentSlug}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                className="inline-flex h-11 items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 text-sm font-medium text-emerald-900 transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:outline-none"
                href={`/u/${currentSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open public profile"
              >
                <ExternalLink className="size-4" />
                Open profile
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-[1.25rem] border border-slate-200/80 bg-white/78 p-3 sm:p-4">
        <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
          Public URL
        </p>
        <div className="mt-2 flex items-center gap-2">
          <Link
            href={`/u/${currentSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-0 flex-1 truncate rounded-xl bg-slate-50 px-3 py-2 font-mono text-sm text-slate-800 transition-colors hover:bg-slate-100"
          >
            {publicProfileUrl}
          </Link>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(publicProfileUrl);
              toast.success("Copied to clipboard!");
            }}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 focus-visible:outline-none"
            title="Copy to clipboard"
            aria-label="Copy public URL"
          >
            <Copy className="size-5 text-slate-500" />
          </button>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FieldSet>
          <FieldGroup className="rounded-[1.35rem] border border-slate-200/80 bg-white/72 p-4 shadow-sm shadow-slate-900/5 sm:p-5">
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                    <div className="relative min-w-0 flex-1">
                      <Input
                        {...field}
                        id="username"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter your username"
                        autoComplete="off"
                        className="pr-8"
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
                    <div className="flex items-center gap-2 sm:pt-0.5">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-11 rounded-full px-5"
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
              <FieldDescription>
                Your username can contain letters, numbers, and underscores.
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

        <Button
          type="submit"
          className="h-12 w-full rounded-2xl disabled:opacity-50"
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
      </form>
    </div>
  );
};

export default UsernameForm;
