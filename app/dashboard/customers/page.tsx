import CustomersList from "@/components/customers-list";
import { Search } from "@/components/search";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Customer list",
  description: "Manage and view your customers right here.",
};

export default async function CustomerRoute({
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Customers</CardTitle>
            <CardDescription>
              Manage and view your customers right here.
            </CardDescription>
          </div>
          <Link href="/dashboard/customers/create" className={buttonVariants()}>
            <PlusIcon /> Create Customer
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Search placeholder="Search customers..." />
        </div>
        <CustomersList query={query} page={page} />
      </CardContent>
    </Card>
  );
}
