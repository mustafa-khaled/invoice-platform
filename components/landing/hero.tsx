import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, TrendingUp } from "lucide-react";
import { HeroChart } from "./hero-chart";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background Creative Animation (Vivamos Style) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-accent/10 rounded-full blur-[100px] animate-[pulse_10s_ease-in-out_infinite_1s]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] bg-zinc-800/20 rounded-full blur-[130px] animate-[pulse_12s_ease-in-out_infinite_2s]" />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-foreground mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span className="font-medium">Novus 2.0</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
          <span className="block text-foreground">Manage Invoices</span>
          <span className="block text-accent mt-2">With Confidence</span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          Streamline your billing process with our intuitive platform. Create,
          track, and manage invoices effortlessly.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <Button
            asChild
            size="lg"
            className="h-12 px-8 text-base rounded-full shadow-[0_0_20px_-5px_var(--color-primary)] hover:shadow-[0_0_30px_-5px_var(--color-primary)] transition-shadow"
          >
            <Link href="/dashboard">
              Start for Free <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Mock Dashboard Preview */}
        <div className="relative max-w-5xl mx-auto rounded-xl border border-white/10 bg-background/50 backdrop-blur-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-1000 delay-500 hover:scale-[1.01] transition-transform">
          <div className="absolute inset-0 bg-linear-to-t from-background to-transparent z-10 h-full w-full pointer-events-none" />

          <div className="p-4 border-b border-white/5 flex items-center gap-4 bg-white/5">
            <div className="flex gap-1.5">
              <div className="size-3 rounded-full bg-red-500/20" />
              <div className="size-3 rounded-full bg-yellow-500/20" />
              <div className="size-3 rounded-full bg-green-500/20" />
            </div>
            <div className="ml-4 h-2 w-32 bg-white/5 rounded-full" />
            <div className="ml-auto flex gap-2">
              <div className="h-2 w-8 bg-white/5 rounded-full" />
              <div className="h-2 w-8 bg-white/5 rounded-full" />
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-90">
            {/* Chart Card */}
            <div className="p-6 rounded-2xl border border-white/5 bg-card/40 col-span-2 shadow-inner">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="text-sm text-muted-foreground">
                    Revenue Trend
                  </div>
                  <div className="text-2xl font-bold mt-1">$124,500.20</div>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="h-[300px] w-full">
                <HeroChart />
              </div>
            </div>

            {/* Stats Cards */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border border-white/5 bg-card/40 hover:bg-card/60 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                    <div className="h-5 w-5 bg-blue-500 rounded-full opacity-60" />
                  </div>
                  <span className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                    +12%
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mb-1">
                  Total Revenue
                </div>
                <div className="text-3xl font-bold text-foreground overflow-hidden relative">
                  <span className="animate-in slide-in-from-bottom-2 duration-500">
                    $24,500
                  </span>
                </div>
              </div>
              <div className="p-6 rounded-2xl border border-white/5 bg-card/40 hover:bg-card/60 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                    <div className="h-5 w-5 bg-purple-500 rounded-full opacity-60" />
                  </div>
                  <span className="text-xs font-medium text-orange-400 bg-orange-400/10 px-2 py-1 rounded-full">
                    Action
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mb-1">
                  Pending Invoices
                </div>
                <div className="text-3xl font-bold text-foreground">12</div>
                <div className="text-xs text-muted-foreground mt-2">
                  Needs attention
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
