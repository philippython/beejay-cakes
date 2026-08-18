import { Phone } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

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

const CHANNELS = [
  { Icon: Phone, label: "Call or text", value: "07495 225986", href: "tel:07495225986" },
  { Icon: WhatsappGlyph, label: "WhatsApp", value: "07495 225986", href: "https://wa.me/447495225986" },
  { Icon: InstagramGlyph, label: "Instagram", value: "@beejay_cakes", href: "https://instagram.com/beejay_cakes" },
  { Icon: TikTokGlyph, label: "TikTok", value: "@beejaycakes_", href: "https://tiktok.com/@beejaycakes_" },
];

export default function ContactPage() {
  return (
    <div className="pb-16">
      <PageHeader
        eyebrow="Get in touch"
        title="Contact us"
        blurb="Questions about an order, a custom cake, or a celebration package — reach us however's easiest for you."
      />

      <div className="mx-auto mt-10 grid max-w-2xl gap-3 px-5 sm:grid-cols-2 sm:px-8">
        {CHANNELS.map((c) => (
          <a
            key={c.label}
            href={c.href}
            target={c.href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="flex items-center gap-3.5 rounded-2xl bg-surface p-5 shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-lift)]"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-peach-tint">
              <c.Icon className="h-[18px] w-[18px] text-honey-deep" strokeWidth={1.8} />
            </span>
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-wide text-cocoa-faint">{c.label}</p>
              <p className="text-[14.5px] font-medium text-cocoa">{c.value}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
