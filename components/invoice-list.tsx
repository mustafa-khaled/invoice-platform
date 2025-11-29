import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import InvoiceActions from "./invoice-actions";
import prisma from "@/lib/prisma";
import { requireUser } from "@/app/utils/hooks";
import { formatCurrency } from "@/app/utils/format-currency";
import { Badge } from "./ui/badge";
import { InvoiceStatus } from "@prisma/client";
import { formatDate } from "@/app/utils/format-date";

async function getData(userId: string) {
  const data = await prisma.invoice.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      clientName: true,
      total: true,
      createdAt: true,
      status: true,
      invoiceName: true,
      currency: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return data;
}

function getStatusVariant(status: InvoiceStatus) {
  switch (status) {
    case "PAID":
      return "paid";
    case "PENDING":
      return "pending";
    case "CANCELLED":
      return "cancelled";
    default:
      return "default";
  }
}

export default async function InvoiceList() {
  const session = await requireUser();
  const data = await getData(session?.user?.id as string);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data?.map((invoice) => {
          return (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.invoiceName}</TableCell>
              <TableCell>{invoice.clientName}</TableCell>
              <TableCell>
                {formatCurrency(invoice.total, invoice.currency)}
              </TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(invoice.status)}>
                  {invoice.status}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(invoice.createdAt)}</TableCell>
              <TableCell className="text-right">
                <InvoiceActions
                  invoiceId={invoice.id}
                  status={invoice.status}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
