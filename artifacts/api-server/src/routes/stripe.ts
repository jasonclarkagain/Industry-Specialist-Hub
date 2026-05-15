import { Router, type IRouter } from "express";
import { storage } from "../storage";
import { stripeService } from "../stripeService";

const router: IRouter = Router();

router.get("/packages-with-prices", async (_req, res) => {
  let rows: Awaited<ReturnType<typeof storage.listProductsWithPrices>>;
  try {
    rows = await storage.listProductsWithPrices();
  } catch {
    return res.json({ data: [] });
  }

  const productsMap = new Map<
    string,
    {
      id: unknown;
      name: unknown;
      description: unknown;
      metadata: unknown;
      prices: {
        id: unknown;
        unit_amount: unknown;
        currency: unknown;
        recurring: unknown;
      }[];
    }
  >();

  for (const row of rows) {
    const pid = row.product_id as string;
    if (!productsMap.has(pid)) {
      productsMap.set(pid, {
        id: row.product_id,
        name: row.product_name,
        description: row.product_description,
        metadata: row.product_metadata,
        prices: [],
      });
    }
    if (row.price_id) {
      productsMap.get(pid)!.prices.push({
        id: row.price_id,
        unit_amount: row.unit_amount,
        currency: row.currency,
        recurring: row.recurring,
      });
    }
  }

  res.json({ data: Array.from(productsMap.values()) });
});

router.post("/checkout", async (req, res) => {
  const { priceId } = req.body as { priceId?: string };

  if (!priceId) {
    return res.status(400).json({ error: "priceId is required" });
  }

  try {
    const host =
      process.env.REPLIT_DOMAINS?.split(",")[0] ?? (req.get("host") as string);
    const baseUrl = `https://${host}`;

    const session = await stripeService.createCheckoutSession(
      priceId,
      `${baseUrl}/checkout/success`,
      `${baseUrl}/checkout/cancel`,
    );

    res.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    res.status(500).json({ error: message });
  }
});

export default router;
