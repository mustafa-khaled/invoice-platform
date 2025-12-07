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

async function getData(userId: string) {
  const data = await prisma.customer.findMany({
    where: {
      userId: userId,
    },
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
  });

  return data;
}

export default async function CustomersList() {
  const session = await requireUser();
  const data = await getData(session?.user?.id as string);

  if (!data?.length) {
    return <NoDataFound message="No customers found!" />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Created At</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data?.map((customer) => {
          return (
            <TableRow key={customer.id}>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.address}</TableCell>
              <TableCell>{customer.createdAt.toDateString()}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
