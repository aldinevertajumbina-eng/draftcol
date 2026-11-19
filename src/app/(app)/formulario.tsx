import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { supabase } from "../../lib/supabase";

const C = {
  fondo: "#EEF4EC",
  pasto: "#0B2E1F",
  cesped: "#1F8A4C",
  menta: "#D9EBDD",
  oro: "#F2B632",
  tinta: "#10261B",
  gris: "#5F7568",
  borde: "#DCE8DF",
};

const POSICIONES = ["Portero", "Defensa", "Mediocampista", "Delantero"];
const PIES = ["Derecho", "Izquierdo", "Ambidiestro"];

// Alert.alert no se muestra en el navegador, así que se usa alert allí.
function avisar(titulo: string, mensaje: string) {
  if (Platform.OS === "web") {
    alert(`${titulo}\n\n${mensaje}`);
  } else {
    Alert.alert(titulo, mensaje);
  }
}

// Convierte base64 a bytes sin depender de paquetes externos.
function base64ABytes(base64: string): Uint8Array {
  const limpio = base64.replace(/^data:.*?;base64,/, "").replace(/\s/g, "");
  const letras =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  const lookup = new Uint8Array(256);
  for (let i = 0; i < letras.length; i++) lookup[letras.charCodeAt(i)] = i;

  const sinRelleno = limpio.replace(/=+$/, "");
  const largo = Math.floor((sinRelleno.length * 3) / 4);
  const salida = new Uint8Array(largo);

  let p = 0;
  for (let i = 0; i < sinRelleno.length; i += 4) {
    const a = lookup[sinRelleno.charCodeAt(i)];
    const b = lookup[sinRelleno.charCodeAt(i + 1)];
    const c = lookup[sinRelleno.charCodeAt(i + 2)];
    const d = lookup[sinRelleno.charCodeAt(i + 3)];
    if (p < largo) salida[p++] = (a << 2) | (b >> 4);
    if (p < largo) salida[p++] = ((b & 15) << 4) | (c >> 2);
    if (p < largo) salida[p++] = ((c & 3) << 6) | d;
  }
  return salida;
}

// Detecta el formato real de la imagen por su cabecera.
function detectarTipo(b: Uint8Array): { tipo: string; extension: string } {
  if (b[0] === 0x89 && b[1] === 0x50) return { tipo: "image/png", extension: "png" };
  if (b[0] === 0xff && b[1] === 0xd8) return { tipo: "image/jpeg", extension: "jpg" };
  if (b[0] === 0x52 && b[1] === 0x49) return { tipo: "image/webp", extension: "webp" };
  if (b[0] === 0x47 && b[1] === 0x49) return { tipo: "image/gif", extension: "gif" };
  return { tipo: "image/jpeg", extension: "jpg" };
}

export default function Formulario() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [posicion, setPosicion] = useState("");
  const [pieHabil, setPieHabil] = useState("");
  const [cualidades, setCualidades] = useState("");
  const [foto, setFoto] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [guardando, setGuardando] = useState(false);

  const elegirFoto = async () => {
    if (Platform.OS !== "web") {
      const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permiso.granted) {
        avisar(
          "Permiso necesario",
          "Permite el acceso a tus fotos para elegir una imagen."
        );
        return;
      }
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });

    if (!resultado.canceled) {
      setFoto(resultado.assets[0]);
    }
  };

  const subirFoto = async (
    asset: ImagePicker.ImagePickerAsset
  ): Promise<string> => {
    // Se sube desde el base64 que entrega el selector: no depende de fetch/blob
    // y funciona con cualquier imagen (captura, foto o descargada de internet).
    let base64 = asset.base64 ?? "";
    if (!base64 && asset.uri.startsWith("data:")) {
      base64 = asset.uri.split(",")[1] ?? "";
    }
    if (!base64) {
      throw new Error("No se pudo leer la imagen. Elige otra.");
    }

    const bytes = base64ABytes(base64);
    if (bytes.length < 100) {
      throw new Error("La imagen quedó vacía. Elige otra foto.");
    }

    // El tipo real se detecta por los primeros bytes del archivo.
    const { tipo, extension } = detectarTipo(bytes);
    const ruta = `perfil-${Date.now()}.${extension}`;

    const { error } = await supabase.storage
      .from("fotos-jugadores")
      .upload(ruta, bytes, { contentType: tipo });

    if (error) throw error;

    const { data } = supabase.storage
      .from("fotos-jugadores")
      .getPublicUrl(ruta);

    return data.publicUrl;
  };

  const guardar = async () => {
    if (!nombre.trim()) {
      avisar("Falta el nombre", "Escribe el nombre del jugador.");
      return;
    }
    if (!posicion) {
      avisar("Falta la posición", "Elige la posición en la que juega.");
      return;
    }
    if (!pieHabil) {
      avisar("Falta el pie hábil", "Elige con qué pie juega.");
      return;
    }

    try {
      setGuardando(true);

      let fotoUrl: string | null = null;
      if (foto) {
        fotoUrl = await subirFoto(foto);
      }

      const { error } = await supabase.from("jugadores").insert({
        nombre: nombre.trim(),
        correo: correo.trim(),
        telefono: telefono.trim(),
        ciudad: ciudad.trim(),
        posicion,
        cualidades: cualidades.trim(),
        pie_habil: pieHabil,
        foto_url: fotoUrl,
      });

      if (error) throw error;

      setNombre("");
      setCorreo("");
      setTelefono("");
      setCiudad("");
      setPosicion("");
      setPieHabil("");
      setCualidades("");
      setFoto(null);

      avisar("Inscripción lista", "El jugador quedó registrado.");
      router.push("/imagenes" as any);
    } catch (e: any) {
      avisar("No se pudo guardar", e?.message ?? "Inténtalo nuevamente.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.titulo}>Inscribe a un jugador</Text>
      <Text style={styles.subtitulo}>
        Completa la ficha. Con una foto, el perfil se ve mucho mejor.
      </Text>

      {/* FOTO */}
      <Pressable style={styles.fotoZona} onPress={elegirFoto}>
        <View style={styles.fotoCirculo}>
          {foto ? (
            <Image source={{ uri: foto.uri }} style={styles.fotoImagen} />
          ) : (
            <Text style={styles.fotoIcono}>📷</Text>
          )}
        </View>
        <Text style={styles.fotoTexto}>
          {foto ? "Cambiar foto" : "Agregar foto"}
        </Text>
      </Pressable>

      {/* CAMPOS */}
      <Text style={styles.label}>Nombre completo</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: Daniel Cabezas"
        placeholderTextColor="#7A8F84"
        value={nombre}
        onChangeText={setNombre}
      />

      <Text style={styles.label}>Correo electrónico</Text>
      <TextInput
        style={styles.input}
        placeholder="correo@ejemplo.com"
        placeholderTextColor="#7A8F84"
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Text style={styles.label}>Teléfono</Text>
      <TextInput
        style={styles.input}
        placeholder="3001234567"
        placeholderTextColor="#7A8F84"
        value={telefono}
        onChangeText={setTelefono}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Ciudad</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: Pasto"
        placeholderTextColor="#7A8F84"
        value={ciudad}
        onChangeText={setCiudad}
      />

      {/* POSICIÓN */}
      <Text style={styles.label}>Posición</Text>
      <View style={styles.chips}>
        {POSICIONES.map((p) => {
          const activo = posicion === p;
          return (
            <Pressable
              key={p}
              style={[styles.chip, activo && styles.chipActivo]}
              onPress={() => setPosicion(p)}
            >
              <Text style={[styles.chipTexto, activo && styles.chipTextoActivo]}>
                {p}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* PIE HÁBIL */}
      <Text style={styles.label}>Pie hábil</Text>
      <View style={styles.chips}>
        {PIES.map((p) => {
          const activo = pieHabil === p;
          return (
            <Pressable
              key={p}
              style={[styles.chip, activo && styles.chipActivo]}
              onPress={() => setPieHabil(p)}
            >
              <Text style={[styles.chipTexto, activo && styles.chipTextoActivo]}>
                {p}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* CUALIDADES */}
      <Text style={styles.label}>Cualidades</Text>
      <TextInput
        style={[styles.input, styles.inputGrande]}
        placeholder="Ej: Velocidad, buen pase, remate de media distancia..."
        placeholderTextColor="#7A8F84"
        value={cualidades}
        onChangeText={setCualidades}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      <Pressable
        style={({ pressed }) => [
          styles.boton,
          guardando && styles.botonDeshabilitado,
          pressed && styles.presionado,
        ]}
        onPress={guardar}
        disabled={guardando}
      >
        {guardando ? (
          <ActivityIndicator color={C.oro} />
        ) : (
          <Text style={styles.botonTexto}>Guardar jugador</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: C.fondo,
    padding: 20,
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 26,
    fontWeight: "900",
    color: C.tinta,
  },
  subtitulo: {
    color: C.gris,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
    marginBottom: 22,
  },

  fotoZona: {
    alignItems: "center",
    marginBottom: 22,
  },
  fotoCirculo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: C.menta,
    borderWidth: 3,
    borderColor: C.oro,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  fotoImagen: {
    width: "100%",
    height: "100%",
  },
  fotoIcono: {
    fontSize: 38,
  },
  fotoTexto: {
    marginTop: 8,
    color: C.cesped,
    fontWeight: "800",
    fontSize: 14,
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
    padding: 14,
    marginBottom: 16,
    fontSize: 15,
    color: C.tinta,
  },
  inputGrande: {
    minHeight: 100,
  },

  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: C.borde,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  chipActivo: {
    backgroundColor: C.pasto,
    borderColor: C.pasto,
  },
  chipTexto: {
    color: C.tinta,
    fontWeight: "700",
    fontSize: 14,
  },
  chipTextoActivo: {
    color: C.oro,
  },

  boton: {
    backgroundColor: C.pasto,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 6,
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
});
