import Stripe from "stripe";

let stripe: Stripe | null = null;

/**
 * Server-only Stripe client. Reads STRIPE_SECRET_KEY from the environment.
 * Throws only when actually invoked (not at import time), so the app can
 * still build/run before Stripe keys are configured.
 */
export function getStripe() {
  if (!stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error(
        "STRIPE_SECRET_KEY is not set. Add it to .env.local — see .env.example."
      );
    }
    stripe = new Stripe(key);
  }
  return stripe;
}
