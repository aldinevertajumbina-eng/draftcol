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

export default function Registro() {
  const router = useRouter();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [guardando, setGuardando] = useState(false);

  const crearCuenta = async () => {
    if (!correo.trim() || !password) {
      Alert.alert("Campos incompletos", "Ingresa correo y contraseña.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Contraseña", "Debe tener mínimo 6 caracteres.");
      return;
    }

    try {
      setGuardando(true);

      const { error } = await supabase.auth.signUp({
        email: correo.trim(),
        password: password,
      });

      if (error) {
        Alert.alert("Error", error.message);
        return;
      }

      // Cerramos la sesión creada por signUp para practicar el login.
      await supabase.auth.signOut();

      Alert.alert("Cuenta creada", "Ahora puedes iniciar sesión.");
      router.replace("/login" as any);
    } catch {
      Alert.alert("Error", "No fue posible crear la cuenta.");
    } finally {
      setGuardando(false);
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

        <Text style={styles.titulo}>Crea tu cuenta</Text>
        <Text style={styles.subtitulo}>
          Entra a DraftCol y muestra tu talento
        </Text>
      </View>

      {/* PANEL DEL FORMULARIO */}
      <View style={styles.panel}>
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
          placeholder="Mínimo 6 caracteres"
          placeholderTextColor="#7F86A3"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable
          style={({ pressed }) => [
            styles.boton,
            guardando && styles.botonDeshabilitado,
            pressed && styles.presionado,
          ]}
          onPress={crearCuenta}
          disabled={guardando}
        >
          {guardando ? (
            <ActivityIndicator color={C.oro} />
          ) : (
            <Text style={styles.botonTexto}>Crear cuenta</Text>
          )}
        </Pressable>

        <Pressable onPress={() => router.replace("/login" as any)}>
          <Text style={styles.enlace}>Ya tengo una cuenta</Text>
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
    paddingTop: 30,
    paddingBottom: 56,
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: C.pasto,
  },
  circuloVerde: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: C.cesped,
    top: -110,
    left: -70,
    opacity: 0.55,
  },
  circuloLavanda: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: C.menta,
    right: -30,
    bottom: 20,
    opacity: 0.12,
  },
  logoCaja: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: C.oro,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  logo: {
    fontSize: 38,
  },
  titulo: {
    fontSize: 30,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  subtitulo: {
    color: C.menta,
    marginTop: 6,
    fontSize: 15,
    textAlign: "center",
    paddingHorizontal: 20,
  },

  /* PANEL */
  panel: {
    flex: 1,
    backgroundColor: C.fondo,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -28,
    padding: 24,
    paddingTop: 32,
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