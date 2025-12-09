import { Zap, Shield, Globe, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Generate invoices in seconds with our optimized templates and automated workflows.",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description:
      "Enterprise-grade encryption ensures your data and payments are always protected.",
  },
  {
    icon: Globe,
    title: "Global Currency",
    description:
      "Accept payments from anywhere in the world with multi-currency support.",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description:
      "Gain insights into your revenue streams with detailed, real-time reporting.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-secondary/30 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-primary)_0%,transparent_100%)] opacity-5 blur-3xl" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Features that <span className="text-primary">Empower</span> You
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to manage your billing, all in one premium
            platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group p-8 rounded-2xl bg-card border border-white/5 hover:border-primary/20 transition-all duration-300 hover:shadow-[0_0_30px_-10px_var(--color-primary)]"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
