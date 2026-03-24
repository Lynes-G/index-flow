"use client";

import { usernameFormSchema, UsernameFormData } from "@/schemas/formSchema";
import { useUser } from "@clerk/clerk-react";
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

  const form = useForm<UsernameFormData>({
    resolver: zodResolver(usernameFormSchema),
    defaultValues: {
      username: "",
    },
  });

  const watchedUsername = form.watch("username");
  // Debounce the username input to avoid excessive queries
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedUsername(watchedUsername);
    }, 500); // 500ms delay;

    return () => clearTimeout(handler); // Cleanup on unmount or when watchedUsername changes
  }, [watchedUsername]);

  const currentSlug = useQuery(
    api.lib.usernames.getUserSlug,
    user?.id ? { userId: user.id } : "skip",
  );

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
    if (!debouncedUsername || debouncedUsername.length < 3) return null;
    if (debouncedUsername !== watchedUsername) return "checking";
    if (!availabilityCheck) return "checking";
    if (debouncedUsername === currentSlug) return "current";
    return availabilityCheck.available ? "available" : "unavailable";
  };

  const status = getStatus();

  const hasCustomUsername = currentSlug && currentSlug !== user?.id;
  const isSubmitDisabled =
    status !== "available" || form.formState.isSubmitting;

  const onSubmit = async (data: UsernameFormData) => {
    console.log("Form submitted with data:", data);
    if (!user?.id) return;

    try {
      const response = await setUsername({ username: data.username });
      if (response.success) {
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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900">
          Customize your link
        </h3>
        <p className="text-sm text-gray-600">
          Choose a custom username for you link-in-bio page. This will be your
          public URL.
        </p>
      </div>

      {/* Current username status */}
      {hasCustomUsername && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="size-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">
                Current username
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-white/70 px-2 py-1 font-mono text-sm text-green-800">
                {currentSlug}
              </span>
              <Link
                className="text-green-600 transition-colors hover:text-green-700"
                href={`/u/${currentSlug}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="size-5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* URL Preview */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="size-2 rounded-full bg-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            Your Link Preview
          </span>
        </div>
        <div className="flex items-center">
          <Link
            href={`/u/${currentSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 truncate rounded-l border-y border-l bg-white px-3 py-2 font-mono text-gray-800 transition-colors hover:bg-gray-50"
          >
            {getBaseUrl()}/u/{currentSlug}
          </Link>
          <button
            onClick={() => {
              navigator.clipboard.writeText(`${getBaseUrl()}/u/${currentSlug}`);
              toast.success("Copied to clipboard!");
            }}
            className="flex h-10 w-10 items-center justify-center border border-r bg-white transition-colors hover:bg-gray-50"
            title="Copy to clipboard"
          >
            <Copy className="size-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FieldSet>
          <FieldGroup className="p-2">
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      id="username"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your username"
                      autoComplete="off"
                      className="pr-8"
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
                </Field>
              )}
            />
            <FieldGroup className="gap-0">
              <FieldDescription>
                Your username can contain letters, numbers, and underscores.
              </FieldDescription>
              {status === "available" && (
                <p className="text-sm text-green-600">Username is available!</p>
              )}
              {status === "current" && (
                <p className="text-sm text-blue-600">This is your username.</p>
              )}
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
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
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
