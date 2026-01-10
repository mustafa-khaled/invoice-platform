"use client";

import { useFormState } from "react-dom";
import { upsertSettings } from "@/app/actions/settings";
import { startTransition, useActionState, useEffect } from "react";
import { parseWithZod } from "@conform-to/zod";
import { settingsSchema } from "@/app/utils/zod-schemas";
import { useForm } from "@conform-to/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SubmitButton from "@/components/submit-button";
import { toast } from "sonner";
import { Settings } from "@prisma/client";

interface SettingsFormProps {
  initialData?: Settings | null;
}

export function SettingsForm({ initialData }: SettingsFormProps) {
  const [lastResult, action] = useActionState(upsertSettings, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: settingsSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    defaultValue: {
      currency: initialData?.currency || "USD",
      taxName: initialData?.taxName || "",
      taxRate: initialData?.taxRate || 0,
      brandColor: initialData?.brandColor || "#2563EB",
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Global Settings</CardTitle>
        <CardDescription>
          Configure your invoice defaults and brand identity.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="currency">Currency</Label>
              <Select
                name={fields.currency.name}
                key={fields.currency.key}
                defaultValue={fields.currency.initialValue}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">
                    United States Dollar (USD)
                  </SelectItem>
                  <SelectItem value="EUR">Euro (EUR)</SelectItem>
                  <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-red-500 text-sm">{fields.currency.errors}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="taxName">Tax Name</Label>
                <Input
                  id="taxName"
                  placeholder="e.g. VAT, GST"
                  key={fields.taxName.key}
                  name={fields.taxName.name}
                  defaultValue={fields.taxName.initialValue}
                />
                <p className="text-red-500 text-sm">{fields.taxName.errors}</p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  step="0.01"
                  placeholder="0"
                  key={fields.taxRate.key}
                  name={fields.taxRate.name}
                  defaultValue={fields.taxRate.initialValue}
                />
                <p className="text-red-500 text-sm">{fields.taxRate.errors}</p>
              </div>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="brandColor">Brand Color</Label>
              <div className="flex gap-4 items-center">
                <Input
                  id="brandColor"
                  type="color"
                  className="h-10 w-20 p-1 cursor-pointer"
                  key={fields.brandColor.key}
                  name={fields.brandColor.name}
                  defaultValue={fields.brandColor.initialValue}
                />
                <div className="text-sm text-muted-foreground">
                  Pick a color to match your brand identity.
                </div>
              </div>

              <p className="text-red-500 text-sm">{fields.brandColor.errors}</p>
            </div>

            <SubmitButton>Save Settings</SubmitButton>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
