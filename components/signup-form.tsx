"use client";

import { useActionState } from "react";
import { registerUser } from "@/app/actions/auth.actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from "@/components/submit-button";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { registerSchema } from "@/app/utils/zod-schemas";

export function SignupForm() {
  const [lastResult, action] = useActionState(registerUser, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: registerSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <form
      id={form.id}
      onSubmit={form.onSubmit}
      action={action}
      noValidate
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First name</Label>
          <Input
            id="firstName"
            key={fields.firstName.key}
            name={fields.firstName.name}
            defaultValue={fields.firstName.initialValue}
            placeholder="Max"
          />
          <p className="text-sm text-red-500">{fields.firstName.errors}</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last name</Label>
          <Input
            id="lastName"
            key={fields.lastName.key}
            name={fields.lastName.name}
            defaultValue={fields.lastName.initialValue}
            placeholder="Robinson"
          />
          <p className="text-sm text-red-500">{fields.lastName.errors}</p>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          key={fields.address.key}
          name={fields.address.name}
          defaultValue={fields.address.initialValue}
          placeholder="123 Main St"
        />
        <p className="text-sm text-red-500">{fields.address.errors}</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          key={fields.email.key}
          name={fields.email.name}
          defaultValue={fields.email.initialValue}
          placeholder="m@example.com"
          type="email"
        />
        <p className="text-sm text-red-500">{fields.email.errors}</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          key={fields.password.key}
          name={fields.password.name}
          defaultValue={fields.password.initialValue}
          type="password"
        />
        <p className="text-sm text-red-500">{fields.password.errors}</p>
      </div>

      <SubmitButton>Create an account</SubmitButton>
    </form>
  );
}
