import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { requireUser } from "@/app/utils/hooks";
import { formatCurrency } from "@/app/utils/format-currency";
import { Badge } from "./ui/badge";

type InvoiceStatus = "PAID" | "PENDING" | "CANCELLED";

async function getData(userId: string) {
  const data = await prisma.invoice.findMany({
    where: { userId },
    select: {
      id: true,
      clientEmail: true,
      clientName: true,
      total: true,
      currency: true,
      status: true,
      invoiceNumber: true,
    },
    orderBy: { createdAt: "desc" },
    take: 7,
  });

  return data;
}

export default async function RecentInvoices() {
  const session = await requireUser();
  const data = await getData(session.user?.id as string);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Invoices</CardTitle>
          <Link
            href="/dashboard/invoices"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            View All
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {data.map((invoice) => (
          <div className="flex items-center gap-4" key={invoice.id}>
            <Avatar className="hidden sm:flex size-9">
              <AvatarFallback>{invoice.clientName.slice(0, 2)}</AvatarFallback>
            </Avatar>

            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none truncate">
                {invoice.clientName}
              </p>
              <p className="text-sm text-muted-foreground break-all">
                {invoice.clientEmail}
              </p>
            </div>

            <div className="ml-auto flex flex-col items-end gap-1">
              <p className="text-sm font-medium leading-none">
                +{formatCurrency(invoice.total, invoice.currency)}
              </p>
              <span className="text-xs text-muted-foreground">
                #{invoice.invoiceNumber}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
