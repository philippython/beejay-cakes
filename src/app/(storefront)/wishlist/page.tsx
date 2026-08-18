import Link from "next/link";
import { Heart, LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getWishlist } from "@/lib/data/products";
import { ProductCard } from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-peach-tint">
          <LogIn className="h-7 w-7 text-honey-deep" strokeWidth={1.6} />
        </span>
        <h1 className="mt-5 font-display text-[22px] font-medium text-cocoa">Log in to see your favourites</h1>
        <p className="mt-1.5 text-[14px] text-cocoa-soft">
          Your saved products are tied to your account so they follow you across devices.
        </p>
        <Link href="/login">
          <Button className="mt-6">Log in</Button>
        </Link>
      </div>
    );
  }

  const saved = await getWishlist(supabase, user.id);

  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-6 sm:px-8">
      <h1 className="font-display text-[26px] font-medium text-cocoa">Favourites</h1>
      <p className="mt-1 text-[13.5px] text-cocoa-soft">{saved.length} saved products</p>

      {saved.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {saved.map((p) => (
            <ProductCard key={p.id} product={p} className="w-full" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center py-20 text-center">
          <Heart className="h-8 w-8 text-cocoa-faint" strokeWidth={1.5} />
          <p className="mt-3 text-[14px] font-medium text-cocoa">No favourites yet</p>
          <p className="mt-1 text-[13px] text-cocoa-soft">Tap the heart on any product to save it here.</p>
        </div>
      )}
    </div>
  );
}
