import { requireUser } from "@/app/utils/hooks";
import Graph from "./graph";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import prisma from "@/lib/prisma";

async function getInvoices(userId: string) {
  // Fetch last 30 days of paid invoices
  const invoices = await prisma.invoice.findMany({
    where: {
      userId,
      status: "PAID",
      createdAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        lte: new Date(),
      },
    },
    select: {
      createdAt: true,
      total: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const dailyTotals = invoices.reduce<Record<string, number>>(
    (acc, invoice) => {
      // ISO day key: 2025-01-30
      const dayKey = invoice.createdAt.toISOString().split("T")[0];

      acc[dayKey] = (acc[dayKey] ?? 0) + invoice.total;
      return acc;
    },
    {}
  );

  return Object.entries(dailyTotals)
    .map(([dayKey, amount]) => ({
      date: new Date(dayKey).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      amount,
      sortKey: dayKey, // YYYY-MM-DD
    }))
    .sort((a, b) => (a.sortKey > b.sortKey ? 1 : -1))
    .map(({ sortKey, ...rest }) => rest);
}

export default async function InvoiceChart() {
  const session = await requireUser();
  const data = await getInvoices(session.user?.id as string);

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Paid Invoices</CardTitle>
        <CardDescription>
          A list of all the paid invoices in the last month.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Graph data={data} />
      </CardContent>
    </Card>
  );
}
