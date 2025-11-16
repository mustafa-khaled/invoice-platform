"use client";

import { Calendar1Icon } from "lucide-react";
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

export default function CreateInvoice() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6 space-y-6">
        <div className="flex flex-col gap-1 w-fit">
          <div className="flex items-center gap-4">
            <Badge variant="secondary">Draft</Badge>
            <Input placeholder="Test 123" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <Label htmlFor="invoiceNum">Invoice No.</Label>
            <div className="flex">
              <span className="px-3 border border-r-0 rounded-md rounded-r-none bg-muted flex items-center">
                #
              </span>
              <Input
                id="invoiceNum"
                placeholder="5"
                className="rounded-l-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label>Currency</Label>
            <Select defaultValue="USD">
              <SelectTrigger>
                <SelectValue placeholder="Select a currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">United States Dollar (USD)</SelectItem>
                <SelectItem value="EUR">Euro -- (EUR)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <Label>From</Label>
            <div className="space-y-2">
              <Input placeholder="Your Name" />
              <Input placeholder="Your Email" />
              <Input placeholder="Your Address" />
            </div>
          </div>

          <div className="space-y-1">
            <Label>To</Label>
            <div className="space-y-2">
              <Input placeholder="Client Name" />
              <Input placeholder="Client Email" />
              <Input placeholder="Client Address" />
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
          </div>

          <div className="space-y-1">
            <Label>Invoice Due</Label>

            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select due date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Due on Reciept</SelectItem>
                <SelectItem value="15">Net 15</SelectItem>
                <SelectItem value="30">Net 30</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-12 gap-4 mb-2 font-medium [&>p]:col-span-2">
            <p className="col-span-6!">Description</p>
            <p>Quantity</p>
            <p>Rate</p>
            <p>Amount</p>
          </div>
          <div className="grid grid-cols-12 gap-4 mb-4 [&>div]:col-span-2">
            <div className="col-span-6!">
              <Textarea className="h-10" placeholder="Item description" />
            </div>
            <div>
              <Input placeholder="0" type="number" />
            </div>
            <div>
              <Input placeholder="0" type="number" />
            </div>
            <div>
              <Input placeholder="0" type="number" disabled />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="w-1/3">
            <div className="flex items-center justify-between py-2">
              <span>Subtotal</span>
              <span>0.00</span>
            </div>
            <div className="flex items-center justify-between py-2 border-t">
              <span>Total (USA)</span>
              <span className="font-medium underline underline-offset-2">
                $5.00
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <Label>Note</Label>
          <Textarea placeholder="Add your note/s right here..." />
        </div>

        <div className="flex items-center justify-end">
          <SubmitButton className="w-fit">Send invoice to client</SubmitButton>
        </div>
      </CardContent>
    </Card>
  );
}
