import Link from "next/link";
import { Phone } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

function InstagramGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function TikTokGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
      <path d="M16.5 3c.4 2.1 1.8 3.6 4 3.9v2.9c-1.4 0-2.8-.4-4-1.2v6.6c0 3.3-2.7 5.8-5.9 5.6-2.9-.2-5.2-2.6-5.3-5.5-.1-3.2 2.5-5.9 5.7-5.9.3 0 .6 0 .9.1v3.1c-.3-.1-.6-.2-.9-.2-1.4 0-2.6 1.2-2.5 2.7.1 1.3 1.1 2.3 2.4 2.4 1.5.1 2.8-1.1 2.8-2.6V3h2.8z" />
    </svg>
  );
}
function WhatsappGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path d="M6 18l-1.2 3.2L8.1 20A8 8 0 1 0 5 15" />
      <path d="M9 9c0 3.5 2.5 6 6 6l1-2-2.5-1-1 1c-1-.5-2.5-2-3-3l1-1-1-2.5L9 9z" />
    </svg>
  );
}

const SOCIALS = [
  { Icon: InstagramGlyph, href: "https://instagram.com/beejay_cakes", label: "Instagram @beejay_cakes" },
  { Icon: TikTokGlyph, href: "https://tiktok.com/@beejaycakes_", label: "TikTok @beejaycakes_" },
  { Icon: WhatsappGlyph, href: "https://wa.me/447495225986", label: "WhatsApp" },
];

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "Birthday Cakes", href: "/category/birthday-cakes" },
      { label: "Wedding Cakes", href: "/category/wedding-cakes" },
      { label: "Cupcakes", href: "/category/cupcakes" },
      { label: "Small Chops", href: "/category/small-chops" },
      { label: "Treat Boxes", href: "/category/treat-boxes" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Celebration Packages", href: "/celebrations" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Track an Order", href: "/orders" },
      { label: "Delivery Info", href: "/delivery" },
      { label: "FAQs", href: "/faq" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-16 mb-20 border-t border-line/70 bg-cream pt-14 md:mb-0">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Link href="/">
              <Logo size="md" />
            </Link>
            <p className="mt-3 font-display text-[13px] italic text-honey-deep">
              … taste the difference …
            </p>
            <p className="mt-2 max-w-[220px] text-[13px] leading-relaxed text-cocoa-soft">
              Handcrafted cakes, pastries and celebration treats — baked fresh in London,
              delivered UK-wide.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {SOCIALS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-cocoa shadow-[var(--shadow-soft)] transition-colors hover:text-honey-deep"
                >
                  <Icon className="h-4 w-4" strokeWidth={1.8} />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-[12px] font-bold uppercase tracking-wide text-cocoa-faint">
                {col.title}
              </p>
              <ul className="mt-3 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13.5px] text-cocoa-soft transition-colors hover:text-cocoa"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-line/70 py-6 text-[13px] text-cocoa-soft sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a href="tel:07495225986" className="flex items-center gap-1.5 hover:text-cocoa">
              <Phone className="h-3.5 w-3.5" /> 07495 225986
            </a>
            <a
              href="https://instagram.com/beejay_cakes"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cocoa"
            >
              @beejay_cakes
            </a>
            <a
              href="https://tiktok.com/@beejaycakes_"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cocoa"
            >
              @beejaycakes_
            </a>
          </div>
          <p>© {new Date().getFullYear()} Beejay Cakes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
