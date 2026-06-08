"use client";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { CreateLinkFormData, createLinkFormSchema } from "@/schemas/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { normalizeExternalUrl } from "@/lib/frontend/shared/externalLinks";

type CreateLinkFormProps = {
  submitLabel?: string;
  onSuccess?: () => void | Promise<void>;
};

const createLinkInputClassName =
  "dashboard-brutalist-input focus:ring-brand-accent focus:ring-2";

const createLinkErrorClassName =
  "rounded-none border-2 border-red-200 bg-red-50 p-3 text-sm text-red-600 shadow-[2px_2px_0_rgba(239,68,68,0.2)]";

const CreateLinkForm = ({
  submitLabel = "Create Link",
  onSuccess,
}: CreateLinkFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, startTransition] = useTransition();
  const router = useRouter();
  const createLink = useMutation(api.lib.links.createLink);

  const form = useForm<CreateLinkFormData>({
    resolver: zodResolver(createLinkFormSchema),
    defaultValues: {
      title: "",
      url: "",
    },
  });

  const onSubmit = async (data: CreateLinkFormData) => {
    setError(null);

    // We normalize before saving so the rest of the app can assume
    // every stored URL is safe to render as an external destination.
    startTransition(async () => {
      try {
        const normalizedUrl = normalizeExternalUrl(data.url);
        if (!normalizedUrl) {
          setError("Enter a full URL or a domain like example.com");
          return;
        }

        await createLink({
          title: data.title,
          url: normalizedUrl,
        });

        if (onSuccess) {
          await onSuccess();
          return;
        }

        router.push("/dashboard");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to create the link right now. Please try again.",
        );
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
      {/* Keep the fieldset structure explicit so future fields can be added
          without re-learning how validation and descriptions are wired. */}
      <FieldSet className="space-y-2">
        <FieldGroup>
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="title">Link Name</FieldLabel>
                <Input
                  {...field}
                  id="title"
                  aria-invalid={fieldState.invalid}
                  placeholder="My awesome link..."
                  autoComplete="off"
                  className={createLinkInputClassName}
                />
                <FieldDescription>
                  This will be displayed as the button text for your link.
                </FieldDescription>
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />
        </FieldGroup>

        <FieldGroup>
          <Controller
            name="url"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="url">URL</FieldLabel>
                <Input
                  {...field}
                  id="url"
                  aria-invalid={fieldState.invalid}
                  placeholder="https://example.com"
                  autoComplete="off"
                  className={createLinkInputClassName}
                />
                <FieldDescription>
                  Paste a full URL or a domain like example.com. We&apos;ll
                  handle the rest.
                </FieldDescription>
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />
        </FieldGroup>
        {error && <div className={createLinkErrorClassName}>{error}</div>}
      </FieldSet>
      <Button
        type="submit"
        disabled={isSubmitting}
        size="lg"
        className="w-full font-black uppercase"
      >
        {isSubmitting ? "Creating..." : submitLabel}
      </Button>
    </form>
  );
};

export default CreateLinkForm;
