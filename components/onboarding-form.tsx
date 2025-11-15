"use client";

import { parseWithZod } from "@conform-to/zod";
import { useForm } from "@conform-to/react";
import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import SubmitButton from "@/components/submit-button";
import { onboardUser } from "@/app/actions";
import { onboardingSchema } from "@/app/utils/zoe-schemas";

export default function OnboardingForm() {
  const [lastResult, action] = useActionState(onboardUser, undefined);

  const [form, fields] = useForm({
    lastResult,

    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: onboardingSchema,
      });
    },

    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <form
      className="space-y-4"
      action={action}
      onSubmit={form.onSubmit}
      id={form.id}
      noValidate
    >
      <div className="grid gap-4 grid-cols-2 [&>div]:flex [&>div]:flex-col [&>div]:gap-2">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            placeholder="John"
            name={fields.firstName.name}
            key={fields.firstName.key}
            defaultValue={fields.firstName.initialValue}
          />
          <p className="text-sm text-red-500">{fields.firstName.errors}</p>
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Doe"
            name={fields.lastName.name}
            key={fields.lastName.key}
            defaultValue={fields.lastName.initialValue}
          />
          <p className="text-sm text-red-500">{fields.lastName.errors}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          placeholder="123 Giza, Pyramids st."
          name={fields.address.name}
          key={fields.address.key}
          defaultValue={fields.address.initialValue}
        />
        <p className="text-sm text-red-500">{fields.address.errors}</p>
      </div>
      <SubmitButton>Finish Onboarding</SubmitButton>
    </form>
  );
}
