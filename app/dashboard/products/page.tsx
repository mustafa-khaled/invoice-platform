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
import NoDataFound from "@/components/no-data-found";
import { formatDate } from "@/app/utils/format-date";
import ProductActions from "@/components/products/product-actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search } from "@/components/search";
import { Pagination } from "@/components/pagination";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string | null;
  createdAt: Date;
}

async function getData(userId: string, query?: string, page: number = 1) {
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  const where = {
    userId: userId,
    OR: query
      ? [
          { name: { contains: query, mode: "insensitive" as const } },
          { description: { contains: query, mode: "insensitive" as const } },
        ]
      : undefined,
  };

  const [data, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: pageSize,
      skip: skip,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    data,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}

export default async function ProductsRoute({
  searchParams,
}: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const query = params?.query || "";
  const page = params?.page || "1";

  const session = await requireUser();
  const { data, totalPages } = await getData(
    session.user?.id as string,
    query,
    Number(page) || 1
  );

  if (!data.length && !query) {
    return (
      <NoDataFound
        message="No products found!"
        title="Products"
        description="You haven't created any products yet."
        href="/dashboard/products/create"
        buttonText="Add Product"
      />
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold tracking-tight">Products</h2>
        <Button asChild>
          <Link href="/dashboard/products/create">
            <PlusCircle className="size-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>
            Manage your products and view their prices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Search placeholder="Search products..." />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((product: Product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.description || "N/A"}</TableCell>
                  <TableCell>{formatDate(product.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <ProductActions productId={product.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination totalPages={totalPages} />
        </CardContent>
      </Card>
    </>
  );
}
