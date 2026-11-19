import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { supabase } from "../../lib/supabase";

const C = {
  fondo: "#EEF0F8",
  pasto: "#21263A",
  cesped: "#157954",
  menta: "#C7CEE8",
  oro: "#D0D34D",
  tinta: "#21263A",
  gris: "#5E6580",
  borde: "#D5DAEC",
};

export default function Login() {
  const router = useRouter();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);

  const iniciarSesion = async () => {
    if (!correo.trim() || !password) {
      Alert.alert("Campos incompletos", "Ingresa tu correo y contraseña.");
      return;
    }

    try {
      setCargando(true);

      const { error } = await supabase.auth.signInWithPassword({
        email: correo.trim(),
        password: password,
      });

      if (error) {
        Alert.alert("Inicio de sesión", error.message);
        return;
      }
    } catch {
      Alert.alert(
        "Error",
        "No fue posible iniciar sesión. Inténtalo nuevamente."
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <ScrollView
      style={styles.fondo}
      contentContainerStyle={styles.scroll}
      keyboardShouldPersistTaps="handled"
    >
      {/* PARTE SUPERIOR */}
      <View style={styles.cabecera}>
        <View style={styles.circuloVerde} />
        <View style={styles.circuloLavanda} />

        <View style={styles.logoCaja}>
          <Text style={styles.logo}>⚽</Text>
        </View>

        <Text style={styles.titulo}>DraftCol</Text>
        <Text style={styles.subtitulo}>Inicia sesión para continuar</Text>
      </View>

      {/* PANEL DEL FORMULARIO */}
      <View style={styles.panel}>
        <Text style={styles.panelTitulo}>Bienvenido de nuevo</Text>

        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="correo@ejemplo.com"
          placeholderTextColor="#7F86A3"
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Tu contraseña"
          placeholderTextColor="#7F86A3"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable
          style={({ pressed }) => [
            styles.boton,
            cargando && styles.botonDeshabilitado,
            pressed && styles.presionado,
          ]}
          onPress={iniciarSesion}
          disabled={cargando}
        >
          {cargando ? (
            <ActivityIndicator color={C.oro} />
          ) : (
            <Text style={styles.botonTexto}>Iniciar sesión</Text>
          )}
        </Pressable>

        <Pressable onPress={() => router.push("/registro" as any)}>
          <Text style={styles.enlace}>¿No tienes cuenta? Regístrate</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: C.pasto,
  },
  scroll: {
    flexGrow: 1,
  },

  /* PARTE SUPERIOR */
  cabecera: {
    paddingTop: 70,
    paddingBottom: 60,
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: C.pasto,
  },
  circuloVerde: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: C.cesped,
    top: -100,
    right: -80,
    opacity: 0.55,
  },
  circuloLavanda: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: C.menta,
    left: -30,
    bottom: 20,
    opacity: 0.12,
  },
  logoCaja: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: C.oro,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  logo: {
    fontSize: 44,
  },
  titulo: {
    fontSize: 36,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  subtitulo: {
    color: C.menta,
    marginTop: 6,
    fontSize: 15,
  },

  /* PANEL */
  panel: {
    flex: 1,
    backgroundColor: C.fondo,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -28,
    padding: 24,
    paddingTop: 28,
  },
  panelTitulo: {
    fontSize: 22,
    fontWeight: "800",
    color: C.tinta,
    marginBottom: 20,
  },
  label: {
    color: C.tinta,
    fontWeight: "700",
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: C.borde,
    borderRadius: 14,
    padding: 15,
    marginBottom: 16,
    fontSize: 15,
    color: C.tinta,
  },
  boton: {
    backgroundColor: C.pasto,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 4,
  },
  botonDeshabilitado: {
    opacity: 0.7,
  },
  botonTexto: {
    color: C.oro,
    fontWeight: "800",
    fontSize: 16,
  },
  presionado: {
    opacity: 0.85,
  },
  enlace: {
    color: C.cesped,
    textAlign: "center",
    marginTop: 22,
    fontWeight: "700",
  },
}); 