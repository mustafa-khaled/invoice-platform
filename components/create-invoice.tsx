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

export default function CreateInvoice() {
  const [lastResult, action] = useActionState(createInvoice, undefined);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: invoiceSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    defaultValue: {
      items: [{ description: "", quantity: 1, rate: 0 }],
    },
  });

  // Get items list from Conform
  const items = fields.items.getFieldList();

  const addItem = () => {
    form.insert({
      name: fields.items.name,
      defaultValue: { description: "", quantity: 1, rate: 0 },
    });
  };

  const removeItem = (index: number) => {
    form.remove({
      name: fields.items.name,
      index,
    });
  };

  // Calculate totals from form data
  const calculateTotals = () => {
    let subtotal = 0;
    items.forEach((item) => {
      const itemFields = item.getFieldset();
      const quantity = Number(itemFields.quantity.value) || 0;
      const rate = Number(itemFields.rate.value) || 0;
      subtotal += quantity * rate;
    });
    return { subtotal, total: subtotal };
  };

  const { subtotal, total } = calculateTotals();

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

          {/* Hidden total input - calculated on server but needed for validation */}
          <input type="hidden" name={fields.total.name} value={total} />

          <div className="flex flex-col gap-1 w-fit">
            <div className="flex items-center gap-4">
              <Badge variant="secondary">Draft</Badge>
              <Input
                name={fields.invoiceName.name}
                key={fields.invoiceName.key}
                defaultValue={fields.invoiceName.initialValue}
                placeholder="INV 123"
              />
            </div>
            <p className="text-red-400 text-sm">{fields.invoiceName.errors}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <Label htmlFor="invoiceNumber">Invoice No.</Label>
              <div className="flex">
                <span className="px-3 border border-r-0 rounded-md rounded-r-none bg-muted flex items-center">
                  #
                </span>
                <Input
                  type="number"
                  name={fields.invoiceNumber.name}
                  key={fields.invoiceNumber.key}
                  defaultValue={fields.invoiceNumber.initialValue}
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
                defaultValue={fields.currency.initialValue || "USD"}
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
                  defaultValue={fields.fromName.initialValue}
                />
                <p className="text-sm text-red-400">{fields.fromName.errors}</p>
                <Input
                  placeholder="Your Email"
                  type="email"
                  name={fields.fromEmail.name}
                  key={fields.fromEmail.key}
                  defaultValue={fields.fromEmail.initialValue}
                />
                <p className="text-sm text-red-400">
                  {fields.fromEmail.errors}
                </p>
                <Input
                  placeholder="Your Address"
                  name={fields.fromAddress.name}
                  key={fields.fromAddress.key}
                  defaultValue={fields.fromAddress.initialValue}
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
                  defaultValue={fields.clientName.initialValue}
                />
                <p className="text-sm text-red-400">
                  {fields.clientName.errors}
                </p>
                <Input
                  placeholder="Client Email"
                  type="email"
                  name={fields.clientEmail.name}
                  key={fields.clientEmail.key}
                  defaultValue={fields.clientEmail.initialValue}
                />
                <p className="text-sm text-red-400">
                  {fields.clientEmail.errors}
                </p>
                <Input
                  placeholder="Client Address"
                  name={fields.clientAddress.name}
                  key={fields.clientAddress.key}
                  defaultValue={fields.clientAddress.initialValue}
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
                    type="button"
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
                    disabled={{ before: new Date() }}
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
                defaultValue={fields.dueDate.initialValue}
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
              {items.map((item, index) => {
                const itemFields = item.getFieldset();
                const quantity = Number(itemFields.quantity.value) || 0;
                const rate = Number(itemFields.rate.value) || 0;
                const amount = quantity * rate;

                return (
                  <InvoiceItemRow
                    key={item.key}
                    itemField={item}
                    itemFields={itemFields}
                    amount={amount}
                    onRemove={() => removeItem(index)}
                    showRemove={items.length > 1}
                  />
                );
              })}
            </div>

            {fields.items.errors && (
              <p className="text-red-500 text-sm mt-2">{fields.items.errors}</p>
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
              defaultValue={fields.note.initialValue}
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
