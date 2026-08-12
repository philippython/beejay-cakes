import { Truck, ChefHat, ShieldCheck, Clock } from "lucide-react";

const POINTS = [
  {
    icon: ChefHat,
    title: "Baked to order",
    text: "Every cake is baked fresh after you order — never frozen, never pre-made.",
  },
  {
    icon: Clock,
    title: "On-time, every time",
    text: "Live order tracking from the oven to your door, with real delivery windows.",
  },
  {
    icon: ShieldCheck,
    title: "Secure checkout",
    text: "Pay safely by card or transfer with Stripe-powered, encrypted checkout.",
  },
  {
    icon: Truck,
    title: "London-wide delivery",
    text: "Careful, temperature-safe delivery across Central London and beyond.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="mx-auto mt-16 max-w-7xl px-5 sm:px-8 sm:mt-20">
      <div className="rounded-[28px] bg-cocoa px-6 py-10 sm:px-12 sm:py-14">
        <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-gold-soft">
          Why Beejay Cakes
        </p>
        <h2 className="mt-2 max-w-md font-display text-[26px] font-medium leading-tight text-cream sm:text-[30px]">
          A bakery experience built around trust
        </h2>

        <div className="mt-9 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {POINTS.map((point) => (
            <div key={point.title}>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
                <point.icon className="h-5 w-5 text-gold-soft" strokeWidth={1.6} />
              </span>
              <h3 className="mt-4 font-display text-[17px] font-medium text-cream">
                {point.title}
              </h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-cream/65">{point.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
