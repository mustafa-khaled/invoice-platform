import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/app/utils/format-currency";
import { formatDate } from "@/app/utils/format-date";
import { Badge } from "@/components/ui/badge";
import SubmitButton from "@/components/submit-button";
import { createPayment } from "@/app/actions/payment";

async function getData(invoiceId: string) {
  const data = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      items: true,
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) {
  const { invoiceId } = await params;
  const data = await getData(invoiceId);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 md:px-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">
              Invoice #{data.invoiceNumber}
            </CardTitle>
            <CardDescription>From: {data.fromName}</CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={data.status === "PAID" ? "default" : "outline"}>
              {data.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-muted-foreground">
                Billed To:
              </h3>
              <p className="font-medium">{data.clientName}</p>
              <p className="text-sm text-muted-foreground">
                {data.clientAddress}
              </p>
              <p className="text-sm text-muted-foreground">
                {data.clientEmail}
              </p>
            </div>
            <div className="text-right">
              <h3 className="font-semibold text-muted-foreground">Details:</h3>
              <p>Date: {formatDate(data.date)}</p>
              <p>Due Date: Next {data.dueDate} Days</p>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-4 py-2 font-medium">Item</th>
                  <th className="px-4 py-2 font-medium text-center">Qty</th>
                  <th className="px-4 py-2 font-medium text-center">Rate</th>
                  <th className="px-4 py-2 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-2">{item.description}</td>
                    <td className="px-4 py-2 text-center">{item.quantity}</td>
                    <td className="px-4 py-2 text-center">
                      {formatCurrency(item.rate, data.currency)}
                    </td>
                    <td className="px-4 py-2 text-right font-medium">
                      {formatCurrency(item.amount, data.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center bg-muted/50 p-4 rounded-lg">
            <span className="font-semibold">Total Amount</span>
            <span className="text-xl font-bold">
              {formatCurrency(data.total, data.currency)}
            </span>
          </div>

          {data.status !== "PAID" && (
            <div className="flex justify-end">
              <form action={createPayment}>
                <input type="hidden" name="invoiceId" value={data.id} />
                <SubmitButton>Pay Invoice</SubmitButton>
              </form>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
