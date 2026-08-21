// Standalone SMTP test — checks your Gmail host/port/username/app password
// work, completely independent of Next.js, Supabase, or the rest of the
// app. Run from the project root:
//
//   node --env-file=.env scripts/test-email.mjs
//
// (Requires Node 20.6+ for --env-file. If that flag isn't recognised,
// install dotenv instead: npm install dotenv, then run
// `node -r dotenv/config scripts/test-email.mjs`.)

import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASSWORD;
const from = process.env.SMTP_FROM || user;

console.log("Testing SMTP with:");
console.log("  host:", host);
console.log("  port:", port);
console.log("  user:", user);
console.log("  pass:", pass ? `${pass.slice(0, 4)}${"*".repeat(Math.max(pass.length - 4, 0))} (${pass.length} chars)` : "(missing!)");
console.log("  from:", from);
console.log("");

if (!host || !port || !user || !pass) {
  console.error("❌ One or more SMTP_* env vars are missing. Check your .env file.");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  auth: { user, pass },
});

try {
  console.log("Step 1: verifying login credentials...");
  await transporter.verify();
  console.log("✅ Login succeeded — host, port, username and password are all correct.\n");

  console.log(`Step 2: sending a real test email to ${user}...`);
  const info = await transporter.sendMail({
    from,
    to: user,
    subject: "Beejay Cakes — SMTP test",
    html: "<p>If you're reading this, your SMTP credentials work end to end. 🎂</p>",
  });
  console.log("✅ Email sent! Message ID:", info.messageId);
  console.log(`\nCheck the inbox for ${user} (and its spam folder) — it should arrive within a few seconds.`);
} catch (err) {
  console.error("❌ Failed:", err.message);
  if (err.message?.includes("Username and Password not accepted")) {
    console.error(
      "\nThis is a Google-side rejection of the credentials — regenerate a fresh app password " +
        "(myaccount.google.com → Security → App passwords) and make sure there are no spaces when you paste it in."
    );
  }
  process.exit(1);
}
