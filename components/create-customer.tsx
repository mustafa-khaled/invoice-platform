"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import SubmitButton from "./submit-button";
import { createCustomer } from "@/app/actions/customer.actions";
import { useActionState } from "react";
import { parseWithZod } from "@conform-to/zod";
import { useForm } from "@conform-to/react";
import { customerSchema } from "@/app/utils/customer.schema";

export default function CreateCustomer() {
  const [lastResult, action] = useActionState(createCustomer, undefined);

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: customerSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Create new customer
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form id={form.id} action={action} onSubmit={form.onSubmit} noValidate>
          <div className="grid md:grid-cols-2 gap-6 [&>div]:space-y-2">
            <div>
              <Label>Customer Name</Label>
              <Input
                placeholder="Name"
                name={fields.name.name}
                key={fields.name.key}
              />
              <p className="text-sm text-red-400">{fields.name.errors}</p>
            </div>

            <div>
              <Label>Customer Email</Label>
              <Input
                placeholder="Email"
                type="email"
                name={fields.email.name}
                key={fields.email.key}
              />
              <p className="text-sm text-red-400">{fields.email.errors}</p>
            </div>

            <div>
              <Label>Customer Address</Label>
              <Input
                placeholder="Address"
                name={fields.address.name}
                key={fields.address.key}
              />
              <p className="text-sm text-red-400">{fields.address.errors}</p>
            </div>

            <div className="space-y-2">
              <Label>Customer Phone</Label>
              <Input
                placeholder="Phone"
                name={fields.phone.name}
                key={fields.phone.key}
              />
              <p className="text-sm text-red-400">{fields.phone.errors}</p>
            </div>
          </div>

          <div className="flex items-center justify-end mt-2">
            <SubmitButton className="w-fit">Create customer</SubmitButton>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
