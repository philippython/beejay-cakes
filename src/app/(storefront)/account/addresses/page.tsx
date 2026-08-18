import Link from "next/link";
import { LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAddresses } from "@/lib/data/addresses";
import { AddressList } from "@/components/account/AddressList";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function AddressesPage() {
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
        <h1 className="mt-5 font-display text-[22px] font-medium text-cocoa">Log in to manage addresses</h1>
        <p className="mt-1.5 text-[14px] text-cocoa-soft">
          Save an address to check out faster next time.
        </p>
        <Link href="/login">
          <Button className="mt-6">Log in</Button>
        </Link>
      </div>
    );
  }

  const addresses = await getAddresses(supabase, user.id);

  return <AddressList userId={user.id} initial={addresses} />;
}
