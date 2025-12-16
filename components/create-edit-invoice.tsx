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
import { useState, useActionState } from "react";
import { Textarea } from "./ui/textarea";
import SubmitButton from "./submit-button";
import { invoiceSchema } from "@/app/utils/zod-schemas";
import { parseWithZod } from "@conform-to/zod";
import { useForm } from "@conform-to/react";
import InvoiceItemRow from "./invoice-item-row";
import { formatCurrency } from "@/app/utils/format-currency";
import { formatDate } from "@/app/utils/format-date";
import { Prisma } from "@prisma/client";
import { createInvoice, editInvoice } from "@/app/actions/invoice.action";

interface CreateEditInvoiceProps {
  data?: Prisma.InvoiceGetPayload<{
    include: {
      items: true;
    };
  }>;
  firstName?: string;
  lastName?: string;
  address?: string;
  email?: string;
  customers?: Array<{
    id: string;
    name: string;
    email: string;
    address: string | null;
  }>;
  products?: Array<{
    id: string;
    name: string;
    price: number;
    description: string | null;
  }>;
}

export default function CreateEditInvoice({
  data,
  firstName,
  lastName,
  address,
  email,
  customers,
  products,
}: CreateEditInvoiceProps) {
  const isEdit = !!data;
  const [lastResult, action] = useActionState(
    isEdit ? editInvoice : createInvoice,
    undefined
  );
  const [selectedDate, setSelectedDate] = useState(
    data?.date ? new Date(data.date) : new Date()
  );
  const [currency, setCurrency] = useState(data?.currency || "USD");

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
      invoiceName: data?.invoiceName || "",
      invoiceNumber: data?.invoiceNumber || undefined,
      currency: data?.currency || "USD",
      fromName:
        data?.fromName ||
        (firstName && lastName ? `${firstName} ${lastName}` : ""),
      fromEmail: data?.fromEmail || email || "",
      fromAddress: data?.fromAddress || address || "",
      clientName: data?.clientName || "",
      clientEmail: data?.clientEmail || "",
      clientAddress: data?.clientAddress || "",
      dueDate: data?.dueDate ? String(data.dueDate) : undefined,
      note: data?.note || "",
      date: data?.date
        ? new Date(data.date).toISOString()
        : new Date().toISOString(),
      items: data?.items
        ? data.items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
          }))
        : [{ description: "", quantity: 1, rate: 0 }],
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
          {/* Hidden invoice ID for edit mode */}
          {isEdit && data && (
            <input type="hidden" name="invoiceId" value={data.id} />
          )}

          {/* Hidden date input */}
          <input
            name={fields.date.name}
            value={selectedDate.toISOString()}
            readOnly
            hidden
          />

          {/* Hidden total input */}
          <input type="hidden" name="total" value={total} />

          {/* Hidden status input - keep existing status if edit, default is Draft (handled by schema/backend usually, but passing Draft if new) */}
          <input
            type="hidden"
            name={fields.status.name}
            key={fields.status.key}
            value={data?.status || "PENDING"}
          />

          <div className="flex flex-col gap-1 w-fit">
            <div className="flex items-center gap-4">
              <Badge variant="secondary">{data?.status || "PENDING"}</Badge>
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
                defaultValue={fields.currency.initialValue}
                name={fields.currency.name}
                key={fields.currency.key}
                onValueChange={(value) => setCurrency(value)}
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
                <Select
                  onValueChange={(value) => {
                    const customer = customers?.find((c) => c.id === value);
                    if (customer) {
                      const nameInput = document.querySelector(
                        `[name="${fields.clientName.name}"]`
                      ) as HTMLInputElement;
                      const emailInput = document.querySelector(
                        `[name="${fields.clientEmail.name}"]`
                      ) as HTMLInputElement;
                      const addressInput = document.querySelector(
                        `[name="${fields.clientAddress.name}"]`
                      ) as HTMLInputElement;

                      if (nameInput) nameInput.value = customer.name;
                      if (emailInput) emailInput.value = customer.email;
                      if (addressInput)
                        addressInput.value = customer.address || "";
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Client" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers?.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                      <p>{formatDate(selectedDate)}</p>
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
              <div className="flex items-center gap-2">
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
                {products && products.length > 0 && (
                  <Select
                    onValueChange={(value) => {
                      const product = products.find((p) => p.id === value);
                      if (product) {
                        form.insert({
                          name: fields.items.name,
                          defaultValue: {
                            description: product.name,
                            quantity: 1,
                            rate: product.price,
                          },
                        });
                      }
                    }}
                  >
                    <SelectTrigger className="w-[180px] h-9">
                      <SelectValue placeholder="Add from Products" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="placeholder-reset" className="hidden">
                        Select Product
                      </SelectItem>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
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
                    currency={currency}
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
                <span>{formatCurrency(subtotal, currency)}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-t">
                <span>Total ({currency})</span>
                <span className="font-medium underline underline-offset-2">
                  {formatCurrency(total, currency)}
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
              {isEdit ? "Update Invoice" : "Send invoice to client"}
            </SubmitButton>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
