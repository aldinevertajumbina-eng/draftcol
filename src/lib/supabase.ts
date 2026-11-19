import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

const supabaseUrl = "https://jlndjqprmvexvepvqucu.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsbmRqcXBybXZleHZlcHZxdWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxMDI1ODEsImV4cCI6MjEwNTY3ODU4MX0.siNU2EDMzVcfaAy5owiQ1UtDm8oguN8TXFYdoiz-3ik";

// En el servidor (renderizado web) no existe "window", así que no
// se usa almacenamiento ni se intenta recuperar la sesión.
const esServidor = typeof window === "undefined";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: esServidor ? undefined : AsyncStorage,
    persistSession: !esServidor,
    autoRefreshToken: !esServidor,
    detectSessionInUrl: false,
  },
});