import { getUncachableStripeClient } from "./stripeClient";

const PRODUCTS = [
  {
    name: "Starter Site",
    description:
      "A clean, professional 3-5 page website that gets your business online and looking great — fast.",
    metadata: {
      category: "website",
      features:
        "Up to 5 pages,Mobile-friendly design,Contact form,Basic SEO setup,2 rounds of revisions,Delivered in 1-2 weeks",
      popular: "false",
      delivery: "1–2 weeks",
      badge: "",
    },
    price: 49900,
  },
  {
    name: "Business Pro",
    description:
      "A powerful site for growing businesses. More pages, blog-ready, SEO-optimized, and built to convert.",
    metadata: {
      category: "website",
      features:
        "Up to 10 pages,Blog / news section,Google Analytics setup,Advanced on-page SEO,Social media integration,3 rounds of revisions,Delivered in 2-3 weeks",
      popular: "true",
      delivery: "2–3 weeks",
      badge: "Most Popular",
    },
    price: 89900,
  },
  {
    name: "E-commerce Store",
    description:
      "A fully-featured online store where customers can browse, add to cart, and pay — all on your site.",
    metadata: {
      category: "website",
      features:
        "Full product catalog,Stripe payment processing,Inventory management,Order tracking,Customer accounts,3 rounds of revisions,Delivered in 3-4 weeks",
      popular: "false",
      delivery: "3–4 weeks",
      badge: "",
    },
    price: 149900,
  },
  {
    name: "Basic Care",
    description:
      "Keep your site healthy and up to date every month without lifting a finger.",
    metadata: {
      category: "webmaster",
      features:
        "Monthly content updates,Uptime monitoring,Security patches,Plugin / dependency updates,Email support (3-5 day response)",
      popular: "false",
      delivery: "Ongoing",
      badge: "",
    },
    price: 4900,
    recurring: true,
  },
  {
    name: "Pro Care",
    description:
      "Priority support, weekly updates, and monthly performance reports to keep your business growing.",
    metadata: {
      category: "webmaster",
      features:
        "Weekly content updates,Priority support (48h response),Monthly analytics report,SEO health monitoring,1 new page per month,Uptime & security monitoring",
      popular: "true",
      delivery: "Ongoing",
      badge: "Best Value",
    },
    price: 9900,
    recurring: true,
  },
  {
    name: "Elite Care",
    description:
      "Your site, fully managed. Unlimited updates, same-day support, and proactive SEO growth every month.",
    metadata: {
      category: "webmaster",
      features:
        "Unlimited content updates,Priority support (24h response),Full SEO management,Monthly strategy call,Up to 3 new pages per month,Performance & speed optimization,Monthly reporting",
      popular: "false",
      delivery: "Ongoing",
      badge: "",
    },
    price: 19900,
    recurring: true,
  },
];

async function seedProducts() {
  const stripe = await getUncachableStripeClient();

  console.log("Seeding Build With Clark products to Stripe...\n");

  for (const def of PRODUCTS) {
    const existing = await stripe.products.search({
      query: `name:'${def.name}' AND active:'true'`,
    });

    if (existing.data.length > 0) {
      console.log(`  ✓ Already exists: ${def.name}`);
      continue;
    }

    const product = await stripe.products.create({
      name: def.name,
      description: def.description,
      metadata: def.metadata,
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: def.price,
      currency: "usd",
      ...(def.recurring
        ? { recurring: { interval: "month" } }
        : {}),
    });

    console.log(
      `  Created: ${product.name} (${product.id}) — price: $${def.price / 100}${def.recurring ? "/mo" : " one-time"} (${price.id})`,
    );
  }

  console.log("\nDone! Webhooks will sync products to your database.");
}

seedProducts().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
