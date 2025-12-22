import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { auth } from "@/app/utils/auth";

import UserMenu from "../user-menu";

export async function Navbar() {
  const session = await auth();

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/60 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-12 rounded-full bg-linear-to-tr from-white/20 to-white/5 p-1 backdrop-blur-sm border border-white/10 shadow-lg mb-1">
            <Image
              src="/logo.png"
              alt="Novus Logo"
              className="w-full h-full object-contain rounded-full"
              width={40}
              height={40}
            />
          </div>
          <span className="font-bold text-2xl tracking-tighter text-foreground">
            Novus
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {session?.user ? (
            <UserMenu />
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Login
              </Link>
              <Button asChild size="sm" className="rounded-full px-6">
                <Link href="/dashboard">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
