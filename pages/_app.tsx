import "../styles/globals.css";
import type { AppProps } from "next/app";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { createContext } from "react";
import { SupabaseClientContext } from "../util/supabase/context";
import { client } from "../util/supabase/client";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SupabaseClientContext.Provider value={client}>
      <Component {...pageProps} />
    </SupabaseClientContext.Provider>
  );
}

export default MyApp;
