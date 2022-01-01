import { SupabaseClient } from "@supabase/supabase-js";
import { createContext } from "react";

export const SupabaseClientContext = createContext<SupabaseClient | undefined>(
  undefined
);
