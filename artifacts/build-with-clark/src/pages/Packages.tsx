import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, ArrowLeft, Loader2, Star, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

type Price = {
  id: string;
  unit_amount: number;
  currency: string;
  recurring: { interval: string } | null;
};

type Product = {
  id: string;
  name: string;
  description: string;
  metadata: {
    category: string;
    features: string;
    popular: string;
    delivery: string;
    badge: string;
  };
  prices: Price[];
};

const CATEGORY_ICONS: Record<string, typeof Zap> = {
  website: Zap,
  webmaster: Shield,
};

function formatPrice(cents: number, recurring: boolean) {
  const dollars = (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return recurring ? `${dollars}/mo` : dollars;
}

function PackageCard({
  product,
  onBuy,
  buying,
}: {
  product: Product;
  onBuy: (priceId: string) => void;
  buying: string | null;
}) {
  const price = product.prices[0];
  if (!price) return null;

  const isPopular = product.metadata.popular === "true";
  const badge = product.metadata.badge;
  const features = (product.metadata.features ?? "").split(",").filter(Boolean);
  const isRecurring = !!price.recurring;
  const isBuying = buying === price.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={`relative rounded-2xl border-2 p-7 flex flex-col ${
        isPopular
          ? "border-primary bg-primary text-primary-foreground shadow-2xl scale-[1.02]"
          : "border-border bg-card text-card-foreground shadow-sm"
      }`}
    >
      {badge && (
        <div
          className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold tracking-wide ${
            isPopular
              ? "bg-secondary text-secondary-foreground"
              : "bg-primary text-primary-foreground"
          }`}
        >
          {badge}
        </div>
      )}

      <div className="mb-4">
        <h3
          className={`text-xl font-bold mb-1 ${isPopular ? "text-primary-foreground" : "text-foreground"}`}
        >
          {product.name}
        </h3>
        <p
          className={`text-sm leading-relaxed ${isPopular ? "text-primary-foreground/80" : "text-muted-foreground"}`}
        >
          {product.description}
        </p>
      </div>

      <div className="mb-5">
        <span
          className={`text-4xl font-black ${isPopular ? "text-primary-foreground" : "text-foreground"}`}
        >
          {formatPrice(price.unit_amount, isRecurring)}
        </span>
        {!isRecurring && (
          <span
            className={`ml-2 text-sm ${isPopular ? "text-primary-foreground/70" : "text-muted-foreground"}`}
          >
            one-time
          </span>
        )}
        {product.metadata.delivery && (
          <p
            className={`text-xs mt-1 ${isPopular ? "text-primary-foreground/70" : "text-muted-foreground"}`}
          >
            {isRecurring ? "Billed monthly" : `Delivered in ${product.metadata.delivery}`}
          </p>
        )}
      </div>

      <ul className="space-y-2.5 mb-7 flex-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm">
            <Check
              className={`h-4 w-4 mt-0.5 shrink-0 ${isPopular ? "text-secondary" : "text-primary"}`}
            />
            <span className={isPopular ? "text-primary-foreground/90" : "text-foreground"}>
              {f.trim()}
            </span>
          </li>
        ))}
      </ul>

      <Button
        size="lg"
        className={`w-full font-bold h-12 ${
          isPopular
            ? "bg-white text-primary hover:bg-white/90"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        }`}
        onClick={() => onBuy(price.id)}
        disabled={isBuying}
      >
        {isBuying ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Opening checkout…
          </>
        ) : (
          "Get Started"
        )}
      </Button>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border-2 border-border p-7 animate-pulse">
      <div className="h-5 bg-muted rounded w-2/3 mb-2" />
      <div className="h-3 bg-muted rounded w-full mb-1" />
      <div className="h-3 bg-muted rounded w-4/5 mb-6" />
      <div className="h-10 bg-muted rounded w-1/2 mb-6" />
      <div className="space-y-2 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-3 bg-muted rounded w-full" />
        ))}
      </div>
      <div className="h-12 bg-muted rounded" />
    </div>
  );
}

export function Packages() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/packages-with-prices")
      .then((r) => r.json())
      .then((d) => setProducts(d.data ?? []))
      .catch(() =>
        toast({
          variant: "destructive",
          title: "Couldn't load packages",
          description: "Please refresh the page or contact me directly.",
        }),
      )
      .finally(() => setLoading(false));
  }, []);

  async function handleBuy(priceId: string) {
    setBuying(priceId);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error ?? "No checkout URL");
      }
    } catch (err: unknown) {
      toast({
        variant: "destructive",
        title: "Checkout failed",
        description: "Something went wrong. Please try again or contact me directly.",
      });
      setBuying(null);
    }
  }

  const websiteProducts = products.filter(
    (p) => p.metadata?.category === "website",
  );
  const webmasterProducts = products.filter(
    (p) => p.metadata?.category === "webmaster",
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground pt-16 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_#fff_0%,_transparent_60%)]" />
        <div className="container max-w-4xl mx-auto relative z-10">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 mb-8 -ml-2"
            >
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back to home
            </Button>
          </Link>
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 rounded-full px-4 py-1.5 text-sm font-semibold mb-5">
            <Star className="h-4 w-4 text-secondary" />
            Clear, honest pricing
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-serif mb-4">
            Pick your plan.
            <br />
            I'll handle the rest.
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl">
            No surprise fees. No confusing tiers. Just straightforward pricing
            for a professional website — and the ongoing care to keep it running great.
          </p>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-16 space-y-20">
        {/* Website Packages */}
        <section>
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
              <Zap className="h-4 w-4" />
              One-time website builds
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground mb-3">
              Get your site built right
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Every package includes a custom design built just for your business — no templates, no cookie-cutter layouts.
            </p>
          </motion.div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : websiteProducts.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6 items-stretch">
              {websiteProducts.map((p) => (
                <PackageCard
                  key={p.id}
                  product={p}
                  onBuy={handleBuy}
                  buying={buying}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p className="mb-4">Packages loading — check back shortly, or reach out directly.</p>
              <Button asChild>
                <a href="/#contact">Contact me</a>
              </Button>
            </div>
          )}
        </section>

        {/* Webmaster Plans */}
        <section>
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
              <Shield className="h-4 w-4" />
              Ongoing webmaster care
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground mb-3">
              Keep your site in great shape
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Your website needs regular attention to stay fast, secure, and up to date.
              I handle all of that so you can focus on running your business.
            </p>
          </motion.div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : webmasterProducts.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6 items-stretch">
              {webmasterProducts.map((p) => (
                <PackageCard
                  key={p.id}
                  product={p}
                  onBuy={handleBuy}
                  buying={buying}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p className="mb-4">Care plans loading — or reach out directly.</p>
              <Button asChild>
                <a href="/#contact">Contact me</a>
              </Button>
            </div>
          )}
        </section>

        {/* FAQ / reassurance strip */}
        <motion.section
          className="bg-muted rounded-3xl p-8 md:p-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold font-serif mb-8 text-center">
            Common questions
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                q: "Can I bundle a website build with a care plan?",
                a: "Absolutely — and I'll knock a bit off the monthly rate when you do both. Just mention it when you reach out.",
              },
              {
                q: "What if I need something not listed here?",
                a: "Get in touch and we'll build a custom quote. I handle everything from simple landing pages to complex web apps.",
              },
              {
                q: "How do payments work?",
                a: "One-time builds are paid upfront via secure Stripe checkout. Monthly care plans are billed automatically each month and can be cancelled anytime.",
              },
              {
                q: "Do I need to have my own hosting?",
                a: "Nope — I handle hosting setup as part of every build. I'll recommend the best option for your budget and needs.",
              },
            ].map((item, i) => (
              <div key={i} className="space-y-1.5">
                <h3 className="font-bold text-foreground">{item.q}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <p className="text-muted-foreground mb-4">
              Still have questions? I'm easy to reach.
            </p>
            <Button size="lg" asChild className="font-bold">
              <a href="/#contact">Send me a message</a>
            </Button>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
