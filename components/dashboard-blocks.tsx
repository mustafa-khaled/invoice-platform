import { Activity, CreditCard, DollarSign, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import prisma from "@/lib/prisma";
import { requireUser } from "@/app/utils/hooks";
import { formatCurrency } from "@/app/utils/format-currency";

async function getData(userId: string) {
  const [totalRevenue, totalPending, totalInvoices, totalCustomers] =
    await Promise.all([
      prisma.invoice.aggregate({
        where: {
          userId: userId,
          status: "PAID",
        },
        _sum: {
          total: true,
        },
      }),

      prisma.invoice.aggregate({
        where: {
          userId: userId,
          status: "PENDING",
        },
        _sum: {
          total: true,
        },
      }),

      prisma.invoice.count({
        where: {
          userId: userId,
        },
      }),

      prisma.customer.count({
        where: {
          userId: userId,
        },
      }),
    ]);

  return {
    totalRevenue: totalRevenue._sum.total || 0,
    totalPending: totalPending._sum.total || 0,
    totalInvoices,
    totalCustomers,
  };
}

export default async function DashboardBlocks() {
  const session = await requireUser();
  const { totalRevenue, totalPending, totalInvoices, totalCustomers } =
    await getData(session?.user?.id as string);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <h2 className="text-2xl font-bold">
            {formatCurrency(totalRevenue, "USD")}
          </h2>
          <p className="text-xs text-muted-foreground">
            Based on paid invoices
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
          <Activity className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <h2 className="text-2xl font-bold">
            {formatCurrency(totalPending, "USD")}
          </h2>
          <p className="text-xs text-muted-foreground">
            Total pending from invoices
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
          <CreditCard className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <h2 className="text-2xl font-bold">+{totalInvoices}</h2>
          <p className="text-xs text-muted-foreground">Total invoices issued</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          <Users className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <h2 className="text-2xl font-bold">+{totalCustomers}</h2>
          <p className="text-xs text-muted-foreground">
            Total customers signed up
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
