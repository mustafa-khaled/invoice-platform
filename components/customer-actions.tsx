"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { Eye, MoreHorizontal, Pencil, Trash } from "lucide-react";
import Link from "next/link";

export default function CustomerActions({
  customerId,
}: {
  customerId: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <span >
            <Eye className="size-4 mr-2" />
            View Customer
          </span>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={`/dashboard/customers/${customerId}`}>
            <Pencil className="size-4 mr-2" />
            Edit Customer
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/customers/${customerId}/delete`}>
            <Trash className="size-4 mr-2" />
            Delete Customer
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
