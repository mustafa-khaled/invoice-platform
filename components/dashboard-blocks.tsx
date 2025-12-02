import { Activity, CreditCard, DollarSign, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import prisma from "@/lib/prisma";
import { requireUser } from "@/app/utils/hooks";

async function getData(userId: string) {
  const [data, openInvoices, paidInvoices] = await Promise.all([
    prisma.invoice.findMany({
      where: {
        userId: userId,
      },
      select: {
        total: true,
      },
    }),

    prisma.invoice.findMany({
      where: {
        userId: userId,
        status: "PENDING",
      },
      select: {
        id: true,
      },
    }),

    prisma.invoice.findMany({
      where: {
        userId: userId,
        status: "PAID",
      },
      select: {
        id: true,
      },
    }),
  ]);
  return { data, openInvoices, paidInvoices };
}

export default async function DashboardBlocks() {
  const session = await requireUser();
  const { data, openInvoices, paidInvoices } = await getData(
    session?.user?.id as string
  );

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total revenue</CardTitle>
          <DollarSign className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <h2 className="text-2xl font-bold">
            ${data?.reduce((acc, curr) => acc + curr?.total, 0)}
          </h2>
          <p className="text-xs text-muted-foreground">
            +20.1% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total invoices issued
          </CardTitle>
          <Users className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <h2 className="text-2xl font-bold">+{data?.length}</h2>
          <p className="text-xs text-muted-foreground">
            Total invoices issued!
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
          <CreditCard className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <h2 className="text-2xl font-bold">{paidInvoices?.length}</h2>
          <p className="text-xs text-muted-foreground">
            Total invoices which have been paid
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Open invoices</CardTitle>
          <Activity className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <h2 className="text-2xl font-bold">{openInvoices?.length}</h2>
          <p className="text-xs text-muted-foreground">
            Invoices which haven&apos;t been paid yet
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
