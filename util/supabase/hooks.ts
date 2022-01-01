import { useContext } from "react";
import { SupabaseClientContext } from "./context";

export function useSupabaseClient() {
  const supabase = useContext(SupabaseClientContext);
  if (!supabase) {
    throw new Error("useSupabaseClient must be used within a SupabaseContext");
  }
  return supabase;
}
