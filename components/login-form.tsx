"use client";

import { useActionState } from "react";
import { loginUser } from "@/app/actions/auth.actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from "@/components/submit-button";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { loginSchema } from "@/app/utils/zod-schemas";

export function LoginForm() {
  const [lastResult, action] = useActionState(loginUser, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: loginSchema });
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

      {typeof lastResult?.error === "string" && (
        // Although conform handles field errors, generic form errors might come through lastResult depending on setup.
        // But with submission.reply({ formErrors }), they should be in form.errors
        <p className="text-sm text-red-500">{lastResult.error}</p>
      )}
      {form.errors && (
        <div className="text-sm text-red-500">
          {form.errors.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </div>
      )}

      <SubmitButton>Login</SubmitButton>
    </form>
  );
}
