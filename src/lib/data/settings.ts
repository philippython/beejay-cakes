import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

export type BankDetails = {
  accountName: string | null;
  bankName: string | null;
  sortCode: string | null;
  accountNumber: string | null;
};

export async function getBankDetails(client: SupabaseClient<Database>): Promise<BankDetails> {
  const { data, error } = await client
    .from("store_settings")
    .select("bank_account_name, bank_name, bank_sort_code, bank_account_number")
    .eq("id", true)
    .maybeSingle();

  if (error || !data) {
    return { accountName: null, bankName: null, sortCode: null, accountNumber: null };
  }

  return {
    accountName: data.bank_account_name,
    bankName: data.bank_name,
    sortCode: data.bank_sort_code,
    accountNumber: data.bank_account_number,
  };
}

export async function updateBankDetails(client: SupabaseClient<Database>, details: BankDetails) {
  const { error } = await client
    .from("store_settings")
    .update({
      bank_account_name: details.accountName,
      bank_name: details.bankName,
      bank_sort_code: details.sortCode,
      bank_account_number: details.accountNumber,
      updated_at: new Date().toISOString(),
    })
    .eq("id", true);

  if (error) throw error;
}

/** True once all three fields required to actually show payment details
 *  are filled in. Bank name is optional (some banks/accounts don't need
 *  it for a domestic transfer), so it's not part of this check. */
export function hasBankDetails(details: BankDetails): boolean {
  return !!(details.accountName && details.sortCode && details.accountNumber);
}
