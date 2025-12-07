import CustomersList from "@/components/customers-list";
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

export default function CustomerRoute() {
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
        <CustomersList />
      </CardContent>
    </Card>
  );
}
