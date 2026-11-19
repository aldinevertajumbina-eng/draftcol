import AsyncStorage from "@react-native-async-storage/async-storage";
import { Session } from "@supabase/supabase-js";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabase } from "../lib/supabase";

type AuthContextType = {
  session: Session | null;
  cargando: boolean;
  cerrarSesion: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  cargando: true,
  cerrarSesion: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error("Error al recuperar la sesión:", error.message);
      }

      setSession(data.session);
      setCargando(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, sessionActual) => {
      setSession(sessionActual);
      setCargando(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const cerrarSesion = async () => {
    try {
      // scope "local": no depende de la red, solo borra la sesión del dispositivo
      await supabase.auth.signOut({ scope: "local" });
    } catch (e) {
      console.warn("Error al cerrar sesión:", e);
    }

    // Limpieza extra por si quedó algo guardado
    try {
      const claves = await AsyncStorage.getAllKeys();
      const clavesSupabase = claves.filter((k) => k.startsWith("sb-"));
      if (clavesSupabase.length > 0) {
        await AsyncStorage.multiRemove(clavesSupabase);
      }
    } catch (e) {
      console.warn("Error al limpiar el almacenamiento:", e);
    }

    // Fuerza el cambio: al quedar session en null, aparece el Login
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, cargando, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}