import Link from "next/link";
import { requireUser } from "../utils/hooks";

import logo from "@/public/logo.png";
import Image from "next/image";
import DashboardLinks from "@/components/dashboard-links";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import prisma from "@/lib/prisma";
import { Toaster } from "@/components/ui/sonner";
import UserMenu from "@/components/user-menu";

async function getUserSession(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      firstName: true,
      lastName: true,
      address: true,
    },
  });
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireUser();
  if (session?.user?.id) {
    await getUserSession(session.user.id);
  }

  return (
    <>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-sidebar md:block">
          <div className="flex flex-col max-h-screen h-full gap-2">
            <div className="h-14 flex items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Link href="/dashboard" className="flex items-center gap-2">
                <Image src={logo} alt="Logo" className="size-8 rounded-full" />
                <p className="text-xl font-bold text-primary">Novus</p>
              </Link>
            </div>
            <div className="flex-1">
              <nav className="grid items-star px-2 text-sm font-medium lg:px-4">
                <DashboardLinks />
              </nav>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-sidebar px-4 lg:h-[60px] lg:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <nav className="grid gap-2 mt-10">
                  <DashboardLinks />
                </nav>
              </SheetContent>
            </Sheet>

            <div className="flex items-center ml-auto">
              <UserMenu />
            </div>
          </header>

          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
          </main>
        </div>
      </div>
      <Toaster richColors closeButton theme="light" />
    </>
  );
}
