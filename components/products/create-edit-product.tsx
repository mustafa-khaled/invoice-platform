"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from "@/components/submit-button";
import { createProduct, editProduct } from "@/app/actions/products.action";
import { useActionState } from "react";
import { parseWithZod } from "@conform-to/zod";
import { useForm } from "@conform-to/react";
import { productSchema } from "@/app/utils/zod-schemas";
import { Textarea } from "@/components/ui/textarea";

interface CreateEditProductProps {
  data?: {
    id: string;
    name: string;
    price: number;
    description: string | null;
  };
}

export default function CreateEditProduct({ data }: CreateEditProductProps) {
  const isEdit = !!data;
  const callAction = isEdit ? editProduct : createProduct;
  const [lastResult, action] = useActionState(callAction, undefined);

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: productSchema,
      });
    },
    defaultValue: {
      name: data?.name || "",
      price: data?.price || 0,
      description: data?.description || "",
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {isEdit ? "Edit Product" : "Create New Product"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form id={form.id} action={action} onSubmit={form.onSubmit} noValidate>
          {isEdit && <input type="hidden" name="productId" value={data?.id} />}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Product Name</Label>
              <Input
                name={fields.name.name}
                key={fields.name.key}
                defaultValue={fields.name.value}
                placeholder="Product Name"
              />
              <p className="text-red-500 text-sm">{fields.name.errors}</p>
            </div>

            <div className="space-y-2">
              <Label>Price</Label>
              <Input
                name={fields.price.name}
                key={fields.price.key}
                defaultValue={fields.price.value}
                placeholder="0.00"
                type="number"
                step="0.01"
              />
              <p className="text-red-500 text-sm">{fields.price.errors}</p>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                name={fields.description.name}
                key={fields.description.key}
                defaultValue={fields.description.value}
                placeholder="Product Description"
              />
              <p className="text-red-500 text-sm">
                {fields.description.errors}
              </p>
            </div>

            <SubmitButton className="w-full">
              {isEdit ? "Update Product" : "Create Product"}
            </SubmitButton>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
