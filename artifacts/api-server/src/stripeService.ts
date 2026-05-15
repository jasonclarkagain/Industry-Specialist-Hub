import { getUncachableStripeClient } from "./stripeClient";

export class StripeService {
  async createCheckoutSession(
    priceId: string,
    successUrl: string,
    cancelUrl: string,
  ) {
    const stripe = await getUncachableStripeClient();
    const price = await stripe.prices.retrieve(priceId);
    const mode = price.recurring ? "subscription" : "payment";

    return await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode,
      success_url: successUrl,
      cancel_url: cancelUrl,
      ...(mode === "payment" ? { customer_creation: "always" } : {}),
      billing_address_collection: "auto",
    });
  }
}

export const stripeService = new StripeService();
