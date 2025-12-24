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
import { formatDate } from "@/app/utils/format-date";
import NoDataFound from "./no-data-found";
import { Pagination } from "./pagination";

// Define InvoiceStatus type locally since Prisma 7 doesn't export enum types directly
type InvoiceStatus = "PAID" | "PENDING" | "CANCELLED";

async function getData(userId: string, query?: string, page: number = 1) {
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  let where: any = {
    userId: userId,
  };

  if (query) {
    where.OR = [
      { invoiceName: { contains: query, mode: "insensitive" } },
      { clientName: { contains: query, mode: "insensitive" } },
    ];
    // Check if query is a number for invoiceNumber search
    const asNum = Number(query);
    if (!isNaN(asNum)) {
      where.OR.push({ invoiceNumber: { equals: asNum } });
    }
  }

  const [data, totalCount] = await Promise.all([
    prisma.invoice.findMany({
      where,
      select: {
        id: true,
        clientName: true,
        total: true,
        createdAt: true,
        status: true,
        invoiceName: true,
        currency: true,
        invoiceNumber: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: pageSize,
      skip: skip,
    }),
    prisma.invoice.count({ where }),
  ]);

  return {
    data,
    totalPages: Math.ceil(totalCount / pageSize),
  };
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

export default async function InvoiceList({
  query,
  page,
}: {
  query?: string;
  page?: string;
}) {
  const session = await requireUser();
  const currentPage = Number(page) || 1;
  const { data, totalPages } = await getData(
    session?.user?.id as string,
    query,
    currentPage
  );

  if (!data?.length) {
    return <NoDataFound message="No invoices found!" />;
  }

  return (
    <>
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
                <TableCell>#{invoice.invoiceNumber}</TableCell>
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
      <Pagination totalPages={totalPages} />
    </>
  );
}
