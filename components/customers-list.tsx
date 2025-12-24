import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prisma from "@/lib/prisma";
import { requireUser } from "@/app/utils/hooks";
import NoDataFound from "./no-data-found";
import { formatDate } from "@/app/utils/format-date";
import CustomerActions from "./customer-actions";
import { Pagination } from "./pagination";

async function getData(userId: string, query?: string, page: number = 1) {
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  const where = {
    userId: userId,
    OR: query
      ? [
          { name: { contains: query, mode: "insensitive" as const } },
          { email: { contains: query, mode: "insensitive" as const } },
        ]
      : undefined,
  };

  const [data, totalCount] = await Promise.all([
    prisma.customer.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: pageSize,
      skip: skip,
    }),
    prisma.customer.count({ where }),
  ]);

  return {
    data,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}

export default async function CustomersList({
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
    return <NoDataFound message="No customers found!" />;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.map((customer) => {
            return (
              <TableRow key={customer.id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.address}</TableCell>
                <TableCell>{formatDate(customer.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <CustomerActions customerId={customer.id} />
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
