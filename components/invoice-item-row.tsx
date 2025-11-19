"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { X } from "lucide-react";

interface InvoiceItemRowProps {
  index: number;
  description: string;
  quantity: number;
  rate: number;
  errors?: {
    description?: string[];
    quantity?: string[];
    rate?: string[];
  };
  onChange: (
    field: "description" | "quantity" | "rate",
    value: string | number
  ) => void;
  onRemove: () => void;
  showRemove: boolean;
}

export default function InvoiceItemRow({
  index,
  description,
  quantity,
  rate,
  errors = {},
  onChange,
  onRemove,
  showRemove,
}: InvoiceItemRowProps) {
  const amount = quantity * rate;

  console.log(errors);

  return (
    <div className="space-y-2 pb-4 border-b">
      <div className="grid grid-cols-12 gap-4 [&>div]:col-span-2 [&>div]:self-start">
        <div className="col-span-6!">
          <Textarea
            className="h-10 resize-none"
            placeholder="Item description"
            name={`items[${index}].description`}
            value={description}
            onChange={(e) => onChange("description", e.target.value)}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description[0]}</p>
          )}
        </div>
        <div>
          <Input
            placeholder="0"
            type="number"
            inputMode="decimal"
            name={`items[${index}].quantity`}
            value={quantity || ""}
            onChange={(e) =>
              onChange("quantity", e.target.value ? Number(e.target.value) : "")
            }
          />
          {errors.quantity && (
            <p className="text-red-500 text-sm mt-1">{errors.quantity[0]}</p>
          )}
        </div>
        <div>
          <Input
            placeholder="0.00"
            type="number"
            inputMode="decimal"
            step="0.01"
            name={`items[${index}].rate`}
            value={rate || ""}
            onChange={(e) =>
              onChange("rate", e.target.value ? Number(e.target.value) : "")
            }
          />
          {errors.rate && (
            <p className="text-red-500 text-sm mt-1">{errors.rate[0]}</p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <Input
            placeholder="0.00"
            type="number"
            disabled
            value={amount.toFixed(2)}
            className="bg-muted"
          />
          {showRemove && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="ml-2"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
