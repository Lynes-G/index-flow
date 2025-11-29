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
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const CreateLinkForm = () => {
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
    console.log(data);
    setError(null);
    startTransition(async () => {
      try {
        await createLink({
          title: data.title,
          url: data.url,
        });
        router.push("/dashboard");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create link");
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
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
                />
                <FieldDescription>
                  This is the destination URL for your link.
                </FieldDescription>
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />
        </FieldGroup>
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}
      </FieldSet>
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Creating..." : "Create Link"}
      </Button>
    </form>
  );
};

export default CreateLinkForm;
