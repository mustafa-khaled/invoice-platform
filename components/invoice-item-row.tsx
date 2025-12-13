import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { FieldMetadata } from "@conform-to/react";
import { Textarea } from "./ui/textarea";
import { formatCurrency } from "@/app/utils/format-currency";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface InvoiceItemRowProps {
  itemField: FieldMetadata<{
    description: string;
    quantity: number;
    rate: number;
  }>;
  itemFields: {
    description: FieldMetadata<string>;
    quantity: FieldMetadata<number>;
    rate: FieldMetadata<number>;
  };
  amount: number;
  onRemove: () => void;
  showRemove: boolean;
  currency: string;
}

export default function InvoiceItemRow({
  itemField,
  itemFields,
  amount,
  onRemove,
  showRemove,
  currency,
}: InvoiceItemRowProps) {
  return (
    <div className="grid grid-cols-12 gap-4 items-start">
      {/* Description - 6 columns */}
      <div className="col-span-6 space-y-1">
        <Textarea
          key={itemFields.description.key}
          name={itemFields.description.name}
          defaultValue={itemFields.description.initialValue}
          placeholder="Item description"
          className="resize-none h-12" // h-10 to match input height if single line, but textarea usually higher. h-10 is standard shadcn input height. Let's keep h-12 or make it auto.
        />
        {itemFields.description.errors && (
          <p className="text-red-400 text-xs">
            {itemFields.description.errors}
          </p>
        )}
      </div>

      {/* Quantity - 2 columns */}
      <div className="col-span-2 space-y-1">
        <Input
          type="number"
          key={itemFields.quantity.key}
          name={itemFields.quantity.name}
          defaultValue={itemFields.quantity.initialValue}
          min="1"
          placeholder="1"
        />
        {itemFields.quantity.errors && (
          <p className="text-red-400 text-xs">{itemFields.quantity.errors}</p>
        )}
      </div>

      {/* Rate - 2 columns */}
      <div className="col-span-2 space-y-1">
        <Input
          type="number"
          key={itemFields.rate.key}
          name={itemFields.rate.name}
          defaultValue={itemFields.rate.initialValue}
          min="0"
          step="0.01"
          placeholder="0.00"
        />
        {itemFields.rate.errors && (
          <p className="text-red-400 text-xs">{itemFields.rate.errors}</p>
        )}
      </div>

      {/* Amount + Remove Button - 2 columns */}
      <div className="col-span-2 flex items-center gap-2">
        <Input value={formatCurrency(amount, currency)} disabled />

        {showRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Show field-level error for the entire item if exists */}
      {itemField.errors && (
        <p className="col-span-12 text-red-400 text-xs">{itemField.errors}</p>
      )}
    </div>
  );
}
