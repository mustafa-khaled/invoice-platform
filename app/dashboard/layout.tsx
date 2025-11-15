import Link from "next/link";
import { requireUser } from "../utils/hooks";

import logo from "@/public/next.svg";
import Image from "next/image";
import DashboardLinks from "@/components/dashboard-links";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireUser();

  return (
    <>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hodden border-r bg-muted/40 md:block">
          <div className="flex flex-col max-h-screen h-full gap-2">
            <div className="h-14 flex items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Link href="/" className="flex items-center gap-2">
                <Image src={logo} alt="Logo" className="size-20" />
                <p className=" font-bold">
                  Invoice <span className="text-blue-600">Marshal</span>
                </p>
              </Link>
            </div>
            <div className="flex-1">
              <nav className="grid items-star px-2 text-sm font-medium lg:px-4">
                <DashboardLinks />
              </nav>
            </div>
          </div>
        </div>

        <div>{children}</div>
      </div>
    </>
  );
}
