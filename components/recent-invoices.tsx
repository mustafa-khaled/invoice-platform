import prisma from "@/lib/prisma";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { requireUser } from "@/app/utils/hooks";
import { formatCurrency } from "@/app/utils/format-currency";

async function getData(userId: string) {
  const data = await prisma.invoice.findMany({
    where: { userId },
    select: {
      id: true,
      clientEmail: true,
      clientName: true,
      total: true,
      currency: true,
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return data;
}

export default async function RecentInvoices() {
  const session = await requireUser();
  const data = await getData(session.user?.id as string);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Invoices</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {data.map((invoice) => (
          <div className="flex items-center gap-4" key={invoice.id}>
            <Avatar className="hidden sm:flex size-9">
              <AvatarFallback>{invoice.clientName.slice(0, 2)}</AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium leading-none">
                {invoice.clientName}
              </p>
              <p className="text-sm text-muted-foreground">
                {invoice.clientEmail}
              </p>
            </div>

            <div className="ml-auto font-medium">
              +{formatCurrency(invoice.total, invoice.currency)}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
