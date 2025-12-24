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
  // 1. Fetch data from DB
  const rawData = await prisma.invoice.findMany({
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

  // 2. Group by date
  const aggregatedData = rawData.reduce<Record<string, number>>((acc, curr) => {
    const date = new Date(curr.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    acc[date] = (acc[date] || 0) + curr.total;
    return acc;
  }, {});

  // 3. Fill in missing days for the last 30 days
  const result = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    const dateStr = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    result.push({
      date: dateStr,
      amount: aggregatedData[dateStr] || 0,
    });
  }

  return result;
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
