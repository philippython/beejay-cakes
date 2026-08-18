export function PageHeader({ eyebrow, title, blurb }: { eyebrow: string; title: string; blurb?: string }) {
  return (
    <div className="mx-auto max-w-2xl px-5 pb-2 pt-10 text-center sm:px-8">
      <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-rose-deep">{eyebrow}</p>
      <h1 className="mt-2 font-display text-[30px] font-medium text-cocoa sm:text-[36px]">{title}</h1>
      {blurb && <p className="mt-3 text-[14.5px] leading-relaxed text-cocoa-soft">{blurb}</p>}
    </div>
  );
}
