"use client";

import { cn } from "@/lib/utils";
import { FileSearchCorner, HomeIcon, Users2, Box } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const dashboardLinks = [
  {
    id: 1,
    name: "Dashboard",
    href: "/dashboard",
    icon: HomeIcon,
  },
  {
    id: 2,
    name: "Invoices",
    href: "/dashboard/invoices",
    icon: FileSearchCorner,
  },
  {
    id: 3,
    name: "Customer List",
    href: "/dashboard/customers",
    icon: Users2,
  },
  {
    id: 4,
    name: "Products",
    href: "/dashboard/products",
    icon: Box,
  },
];

export default function DashboardLinks() {
  const pathname = usePathname();

  return (
    <>
      {dashboardLinks.map((link) => {
        return (
          <Link
            href={link.href}
            key={link.id}
            className={cn(
              pathname === link.href
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground",
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary duration-200"
            )}
          >
            <link.icon className="size-4" />
            {link.name}
          </Link>
        );
      })}
    </>
  );
}
