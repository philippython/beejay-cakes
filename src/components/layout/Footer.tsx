import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

function InstagramGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function FacebookGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v6h3v-6h2.5l.5-3H14V9.5c0-.3.2-.5.5-.5H14V9z" />
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
      { label: "Reviews", href: "/reviews" },
      { label: "Careers", href: "/careers" },
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
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cocoa font-display text-[16px] font-semibold text-cream">
                B
              </span>
              <span className="font-display text-[19px] font-medium text-cocoa">Beejay Cakes</span>
            </Link>
            <p className="mt-3 max-w-[220px] text-[13px] leading-relaxed text-cocoa-soft">
              Handcrafted cakes, pastries and celebration treats — baked fresh and delivered
              across London.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {[InstagramGlyph, FacebookGlyph, WhatsappGlyph].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
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
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> London, UK
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" /> +44 20 0000 0000
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" /> hello@beejaycakes.com
            </span>
          </div>
          <p>© {new Date().getFullYear()} Beejay Cakes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
