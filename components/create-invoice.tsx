"use client";

import { CalendarXIcon as Calendar1Icon, Plus } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Calendar } from "./ui/calendar";
import { useState } from "react";
import { Textarea } from "./ui/textarea";
import SubmitButton from "./submit-button";
import { createInvoice } from "@/app/actions";
import { invoiceSchema } from "@/app/utils/zod-schemas";
import { useActionState } from "react";
import { parseWithZod } from "@conform-to/zod";
import { useForm } from "@conform-to/react";
import InvoiceItemRow from "./invoice-item-row";

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
}

export default function CreateInvoice() {
  const [lastResult, action] = useActionState(createInvoice, undefined);

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: invoiceSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [items, setItems] = useState<InvoiceItem[]>([
    { description: "", quantity: 1, rate: 0 },
  ]);

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, rate: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    const newItems = [...items];
    if (field === "description") {
      newItems[index].description = String(value);
    } else {
      newItems[index][field] = Number(value) || 0;
    }
    setItems(newItems);
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0
  );
  const total = subtotal;

  const itemsFieldList = fields.items as any;
  const itemsErrors = itemsFieldList?.errors || [];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6 [&>form]:space-y-6">
        <form id={form.id} action={action} onSubmit={form.onSubmit} noValidate>
          {/* Hidden date input */}
          <input
            type="hidden"
            name={fields.date.name}
            value={selectedDate.toISOString()}
          />

          {/* Hidden item inputs for form submission */}
          {items.map((item, index) => (
            <div key={index} className="hidden">
              <input
                name={`items[${index}].description`}
                value={item.description}
                readOnly
              />
              <input
                name={`items[${index}].quantity`}
                value={item.quantity}
                readOnly
              />
              <input name={`items[${index}].rate`} value={item.rate} readOnly />
            </div>
          ))}

          <div className="flex flex-col gap-1 w-fit">
            <div className="flex items-center gap-4">
              <Badge variant="secondary">Draft</Badge>
              <Input
                name={fields.invoiceName.name}
                key={fields.invoiceName.key}
                defaultValue={String(fields.invoiceName.initialValue || "")}
                placeholder="INV 123"
              />
            </div>
            <p className="text-red-400 text-sm">{fields.invoiceName.errors}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <Label htmlFor="invoiceNum">Invoice No.</Label>
              <div className="flex">
                <span className="px-3 border border-r-0 rounded-md rounded-r-none bg-muted flex items-center">
                  #
                </span>
                <Input
                  name={fields.invoiceNumber.name}
                  key={fields.invoiceNumber.key}
                  defaultValue={String(fields.invoiceNumber.initialValue || "")}
                  id="invoiceNumber"
                  placeholder="5"
                  className="rounded-l-none"
                />
              </div>
              <p className="text-red-400 text-sm">
                {fields.invoiceNumber.errors}
              </p>
            </div>

            <div className="space-y-1">
              <Label>Currency</Label>
              <Select
                defaultValue="USD"
                name={fields.currency.name}
                key={fields.currency.key}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">
                    United States Dollar (USD)
                  </SelectItem>
                  <SelectItem value="EUR">Euro -- (EUR)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-red-400 text-sm">{fields.currency.errors}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <Label>From</Label>
              <div className="space-y-2">
                <Input
                  placeholder="Your Name"
                  name={fields.fromName.name}
                  key={fields.fromName.key}
                />
                <p className="text-sm text-red-400">{fields.fromName.errors}</p>
                <Input
                  placeholder="Your Email"
                  name={fields.fromEmail.name}
                  key={fields.fromEmail.key}
                />
                <p className="text-sm text-red-400">
                  {fields.fromEmail.errors}
                </p>
                <Input
                  placeholder="Your Address"
                  name={fields.fromAddress.name}
                  key={fields.fromAddress.key}
                />
                <p className="text-sm text-red-400">
                  {fields.fromAddress.errors}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <Label>To</Label>
              <div className="space-y-2">
                <Input
                  placeholder="Client Name"
                  name={fields.clientName.name}
                  key={fields.clientName.key}
                  defaultValue={String(fields.clientName.initialValue || "")}
                />
                <p className="text-sm text-red-400">
                  {fields.clientName.errors}
                </p>
                <Input
                  placeholder="Client Email"
                  name={fields.clientEmail.name}
                  key={fields.clientEmail.key}
                  defaultValue={String(fields.clientEmail.initialValue || "")}
                />
                <p className="text-sm text-red-400">
                  {fields.clientEmail.errors}
                </p>
                <Input
                  placeholder="Client Address"
                  name={fields.clientAddress.name}
                  key={fields.clientAddress.key}
                  defaultValue={String(fields.clientAddress.initialValue || "")}
                />
                <p className="text-sm text-red-400">
                  {fields.clientAddress.errors}
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[280px] text-left justify-start"
                  >
                    <Calendar1Icon />
                    {selectedDate ? (
                      <p>
                        {new Intl.DateTimeFormat("en-US", {
                          dateStyle: "long",
                        }).format(selectedDate)}
                      </p>
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => setSelectedDate(date || new Date())}
                    hidden={{ before: new Date() }}
                  />
                </PopoverContent>
              </Popover>
              <p className="text-sm text-red-400">{fields.date.errors}</p>
            </div>

            <div className="space-y-1">
              <Label>Invoice Due</Label>
              <Select
                name={fields.dueDate.name}
                key={fields.dueDate.key}
                defaultValue={String(fields.dueDate.initialValue || "")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select due date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Due on Receipt</SelectItem>
                  <SelectItem value="15">Net 15</SelectItem>
                  <SelectItem value="30">Net 30</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-red-400">{fields.dueDate.errors}</p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Line Items</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItem}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </Button>
            </div>

            <div className="grid grid-cols-12 gap-4 mb-4 font-medium [&>p]:col-span-2">
              <p className="col-span-6!">Description</p>
              <p>Quantity</p>
              <p>Rate</p>
              <p>Amount</p>
            </div>

            <div className="space-y-2">
              {items.map((item, index) => (
                <InvoiceItemRow
                  key={index}
                  index={index}
                  description={item.description}
                  quantity={item.quantity}
                  rate={item.rate}
                  errors={itemsErrors[index]}
                  onChange={(field, value) => updateItem(index, field, value)}
                  onRemove={() => removeItem(index)}
                  showRemove={items.length > 1}
                />
              ))}
            </div>

            {itemsErrors && (
              <p className="text-red-500 text-sm mt-2">{itemsErrors}</p>
            )}
          </div>

          <div className="flex justify-end">
            <div className="w-1/3">
              <div className="flex items-center justify-between py-2">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-t">
                <span>Total (USD)</span>
                <span className="font-medium underline underline-offset-2">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <Label>Note</Label>
            <Textarea
              className="h-20 resize-none"
              placeholder="Add your note/s right here..."
              name={fields.note.name}
              key={fields.note.key}
              defaultValue={String(fields.note.initialValue || "")}
            />
            <p className="text-sm text-red-400">{fields.note.errors}</p>
          </div>

          <div className="flex items-center justify-end">
            <SubmitButton className="w-fit">
              Send invoice to client
            </SubmitButton>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
