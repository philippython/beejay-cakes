import nodemailer from "nodemailer";
import { formatPrice } from "@/lib/utils";
import type { OrderStatusDb } from "@/lib/database.types";
import type { BankDetails } from "@/lib/data/settings";

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

/** Plain SMTP via Nodemailer — works with any provider (Zoho, Google
 *  Workspace, Amazon SES, your host's email hosting, etc.), not tied to
 *  a specific vendor. Point it at whichever one you're using via these
 *  four env vars. */
function getTransporter() {
  if (!transporter) {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASSWORD;

    if (!host || !port || !user || !pass) {
      throw new Error(
        "SMTP is not configured. Add SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASSWORD to .env — see .env.example."
      );
    }

    transporter = nodemailer.createTransport({
      host,
      port: Number(port),
      secure: Number(port) === 465, // 465 = implicit TLS, 587/25 = STARTTLS
      auth: { user, pass },
    });
  }
  return transporter;
}

const FROM = () => process.env.SMTP_FROM || "Beejay Cakes <orders@beejaycakes.com>";

const SMTP_CONFIGURED = () =>
  !!(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASSWORD);

/** Never throws — an email failure should never take down order
 *  submission or an admin action, since the underlying database change
 *  already succeeded by the time this runs. Just logs so it's visible
 *  server-side. */
async function send(to: string, subject: string, html: string, context: string) {
  if (!SMTP_CONFIGURED()) {
    // eslint-disable-next-line no-console
    console.warn(`SMTP not configured — skipping ${context} email.`);
    return;
  }
  try {
    await getTransporter().sendMail({ from: FROM(), to, subject, html });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Failed to send ${context} email`, err);
  }
}

function orderRef(orderId: string) {
  return orderId.slice(0, 8).toUpperCase();
}

type OrderEmailItem = {
  name: string;
  size?: string | null;
  flavour?: string | null;
  unitPrice: number;
  quantity: number;
};

function itemRow(item: OrderEmailItem) {
  const details = [item.size, item.flavour].filter((v): v is string => !!v).map(escapeHtml).join(" · ");
  return `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #ede3f2;">
        <p style="margin:0;font-size:14px;font-weight:600;color:#2E1A47;">${escapeHtml(item.name)}</p>
        <p style="margin:2px 0 0;font-size:12.5px;color:#6b5c82;">
          ${details}${details ? " · " : ""}Qty ${item.quantity}
        </p>
      </td>
      <td style="padding:12px 0;border-bottom:1px solid #ede3f2;text-align:right;font-size:14px;font-weight:600;color:#2E1A47;white-space:nowrap;">
        ${escapeHtml(formatPrice(item.unitPrice * item.quantity))}
      </td>
    </tr>`;
}

function itemsTotalTable(items: OrderEmailItem[], subtotal: number, total: number) {
  return `
    <table style="width:100%;border-collapse:collapse;">${items.map(itemRow).join("")}</table>
    <table style="width:100%;border-collapse:collapse;margin-top:8px;">
      <tr>
        <td style="padding:6px 0;font-size:13.5px;color:#6b5c82;">Subtotal</td>
        <td style="padding:6px 0;text-align:right;font-size:13.5px;color:#2E1A47;">${escapeHtml(formatPrice(subtotal))}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:13.5px;color:#6b5c82;">Delivery</td>
        <td style="padding:6px 0;text-align:right;font-size:13.5px;color:#6b5c82;">To be confirmed</td>
      </tr>
      <tr>
        <td style="padding:10px 0 0;font-size:15px;font-weight:700;color:#2E1A47;border-top:1px solid #ede3f2;">Total</td>
        <td style="padding:10px 0 0;text-align:right;font-size:15px;font-weight:700;color:#2E1A47;border-top:1px solid #ede3f2;">${escapeHtml(formatPrice(total))}</td>
      </tr>
    </table>`;
}

function bankDetailsBlock(reference: string, bank: BankDetails) {
  const { accountName, bankName, sortCode, accountNumber } = bank;

  if (!accountName || !sortCode || !accountNumber) {
    return `
      <div style="margin-top:20px;padding:14px 16px;background:#fbeaf5;border-radius:12px;">
        <p style="margin:0;font-size:13px;color:#c71880;">
          We'll send you bank transfer details shortly to complete payment.
        </p>
      </div>`;
  }

  return `
    <div style="margin-top:20px;padding:16px;background:#fbeaf5;border-radius:12px;">
      <p style="margin:0 0 8px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.03em;color:#c71880;">
        Pay by bank transfer
      </p>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:2px 0;font-size:13px;color:#6b5c82;">Account name</td><td style="padding:2px 0;text-align:right;font-size:13px;font-weight:600;color:#2E1A47;">${escapeHtml(accountName)}</td></tr>
        ${bankName ? `<tr><td style="padding:2px 0;font-size:13px;color:#6b5c82;">Bank</td><td style="padding:2px 0;text-align:right;font-size:13px;font-weight:600;color:#2E1A47;">${escapeHtml(bankName)}</td></tr>` : ""}
        <tr><td style="padding:2px 0;font-size:13px;color:#6b5c82;">Sort code</td><td style="padding:2px 0;text-align:right;font-size:13px;font-weight:600;color:#2E1A47;">${escapeHtml(sortCode)}</td></tr>
        <tr><td style="padding:2px 0;font-size:13px;color:#6b5c82;">Account number</td><td style="padding:2px 0;text-align:right;font-size:13px;font-weight:600;color:#2E1A47;">${escapeHtml(accountNumber)}</td></tr>
        <tr><td style="padding:2px 0;font-size:13px;color:#6b5c82;">Reference</td><td style="padding:2px 0;text-align:right;font-size:13px;font-weight:700;color:#c71880;">${escapeHtml(reference)}</td></tr>
      </table>
      <p style="margin:10px 0 0;font-size:12px;line-height:1.5;color:#9a8cae;">
        Please use the reference above so we can match your payment. We'll email you again to confirm once it's received.
      </p>
    </div>`;
}

/* ---------------------------------------------------------
   1. Order received — sent to the CUSTOMER the moment they submit
      an order. Includes bank transfer details so they can pay
      straight away. Bank details are passed in (fetched from the
      store_settings table by the caller) — this module never reads
      env vars for them, since they're admin-editable at /admin/settings.
--------------------------------------------------------- */
type OrderReceivedInput = {
  to: string;
  orderId: string;
  items: OrderEmailItem[];
  subtotal: number;
  total: number;
  deliveryAddress: string;
  bankDetails: BankDetails;
};

export async function sendOrderReceivedEmail(input: OrderReceivedInput) {
  const ref = orderRef(input.orderId);

  const body = `
    <p style="margin:0 0 4px;font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:#c71880;">
      Order received
    </p>
    <h1 style="margin:0 0 8px;font-size:22px;color:#2E1A47;">Thanks for your order!</h1>
    <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#6b5c82;">
      We've received order <strong style="color:#2E1A47;">#${ref}</strong>. It'll go into the kitchen as
      soon as payment's confirmed — details below.
    </p>

    ${itemsTotalTable(input.items, input.subtotal, input.total)}
    ${bankDetailsBlock(ref, input.bankDetails)}

    <div style="margin-top:14px;padding:14px 16px;background:#f3ecf7;border-radius:12px;">
      <p style="margin:0;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.03em;color:#6b2ea8;">Delivering to</p>
      <p style="margin:4px 0 0;font-size:13.5px;color:#2E1A47;">${escapeHtml(input.deliveryAddress)}</p>
    </div>`;

  await send(input.to, `We've received your order #${ref}`, renderShell(body), "order received");
}

/* ---------------------------------------------------------
   2. New order alert — sent to the ADMIN the moment an order is
      submitted, so they know to watch for the bank transfer.
--------------------------------------------------------- */
type AdminNewOrderInput = {
  orderId: string;
  items: OrderEmailItem[];
  subtotal: number;
  total: number;
  deliveryAddress: string;
  phone: string;
  customerEmail: string;
};

export async function sendAdminNewOrderEmail(input: AdminNewOrderInput) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!adminEmail) {
    // eslint-disable-next-line no-console
    console.warn("ADMIN_NOTIFICATION_EMAIL not set — skipping new-order admin alert.");
    return;
  }

  const ref = orderRef(input.orderId);

  const body = `
    <p style="margin:0 0 4px;font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:#c71880;">
      New order
    </p>
    <h1 style="margin:0 0 8px;font-size:22px;color:#2E1A47;">Order #${ref} needs payment confirming</h1>
    <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#6b5c82;">
      A customer just placed an order. Watch your bank for their transfer (reference
      <strong style="color:#2E1A47;">${ref}</strong>), then confirm it in the admin panel.
    </p>

    ${itemsTotalTable(input.items, input.subtotal, input.total)}

    <div style="margin-top:14px;padding:14px 16px;background:#f3ecf7;border-radius:12px;">
      <p style="margin:0 0 6px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.03em;color:#6b2ea8;">Customer</p>
      <p style="margin:0;font-size:13.5px;color:#2E1A47;">${escapeHtml(input.customerEmail)}</p>
      <p style="margin:2px 0 0;font-size:13.5px;color:#2E1A47;">${escapeHtml(input.phone)}</p>
      <p style="margin:8px 0 0;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.03em;color:#6b2ea8;">Delivering to</p>
      <p style="margin:4px 0 0;font-size:13.5px;color:#2E1A47;">${escapeHtml(input.deliveryAddress)}</p>
    </div>`;

  await send(adminEmail, `New order #${ref} — awaiting payment`, renderShell(body), "admin new-order alert");
}

/* ---------------------------------------------------------
   3. Payment confirmed — sent to the CUSTOMER once the admin marks
      the bank transfer as received.
--------------------------------------------------------- */
type PaymentConfirmedInput = { to: string; orderId: string };

export async function sendPaymentConfirmedEmail(input: PaymentConfirmedInput) {
  const ref = orderRef(input.orderId);

  const body = `
    <p style="margin:0 0 4px;font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:#c71880;">
      Payment received
    </p>
    <h1 style="margin:0 0 8px;font-size:22px;color:#2E1A47;">You're all set!</h1>
    <p style="margin:0 0 4px;font-size:14px;line-height:1.6;color:#6b5c82;">
      We've received your payment for order <strong style="color:#2E1A47;">#${ref}</strong> — it's confirmed
      and going into the kitchen. We'll email you again as it's baked, packed and out for delivery.
    </p>`;

  await send(input.to, `Payment received for order #${ref}`, renderShell(body), "payment confirmed");
}

/* ---------------------------------------------------------
   4. Status updates — sent to the CUSTOMER as the admin moves the
      order through baking → ready → out for delivery → delivered
      (or cancels it). "pending" and "confirmed" aren't in here —
      order-received and payment-confirmed already cover those.
--------------------------------------------------------- */
const STATUS_COPY: Partial<Record<OrderStatusDb, { eyebrow: string; heading: string; body: string }>> = {
  baking: {
    eyebrow: "In the kitchen",
    heading: "Your order is being baked!",
    body: "We've started baking your order fresh — we'll let you know the moment it's ready.",
  },
  ready: {
    eyebrow: "Ready to go",
    heading: "Your order is ready!",
    body: "Your order is baked, packed and just waiting to head out for delivery.",
  },
  out_for_delivery: {
    eyebrow: "On its way",
    heading: "Your order is out for delivery!",
    body: "Your order has left our kitchen and is on its way to you now.",
  },
  delivered: {
    eyebrow: "All done",
    heading: "Your order has been delivered!",
    body: "Enjoy! We hope it's exactly what you were celebrating. We'd love a review if you have a moment.",
  },
  cancelled: {
    eyebrow: "Order update",
    heading: "Your order has been cancelled",
    body: "This order has been cancelled. If that doesn't sound right, just reply to this email and we'll sort it out.",
  },
};

type OrderStatusUpdateInput = { to: string; orderId: string; status: OrderStatusDb };

export async function sendOrderStatusUpdateEmail(input: OrderStatusUpdateInput) {
  const copy = STATUS_COPY[input.status];
  if (!copy) return;

  const ref = orderRef(input.orderId);

  const body = `
    <p style="margin:0 0 4px;font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:#c71880;">
      ${escapeHtml(copy.eyebrow)}
    </p>
    <h1 style="margin:0 0 8px;font-size:22px;color:#2E1A47;">${escapeHtml(copy.heading)}</h1>
    <p style="margin:0 0 4px;font-size:14px;line-height:1.6;color:#6b5c82;">
      ${escapeHtml(copy.body)}
    </p>
    <p style="margin:16px 0 0;font-size:13px;color:#9a8cae;">Order reference: <strong style="color:#2E1A47;">#${ref}</strong></p>`;

  await send(input.to, `${copy.heading} · Order #${ref}`, renderShell(body), `order status (${input.status})`);
}

/** Shared branded wrapper — header with logo colors/tagline, footer with
 *  contact info. `bodyHtml` is inserted in the middle. */
function renderShell(bodyHtml: string) {
  return `
  <div style="background:#faf7fc;padding:32px 16px;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;">
    <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 24px rgba(46,26,71,0.08);">
      <div style="background:#2E1A47;padding:28px 28px 24px;text-align:center;">
        <p style="margin:0;font-size:20px;font-weight:700;color:#faf7fc;letter-spacing:-0.01em;">Beejay Cakes</p>
        <p style="margin:6px 0 0;font-size:12.5px;font-style:italic;color:#f2b6dd;">… taste the difference …</p>
      </div>

      <div style="padding:28px;">
        ${bodyHtml}

        <p style="margin:24px 0 0;font-size:12.5px;line-height:1.6;color:#9a8cae;text-align:center;">
          Questions about your order? Reply to this email, or reach us on
          Instagram <strong>@beejay_cakes</strong> / WhatsApp 07495 225986.
        </p>
      </div>
    </div>
  </div>`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
