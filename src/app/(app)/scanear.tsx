import { CameraView, useCameraPermissions } from "expo-camera";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

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

// Intenta sacar el id del jugador desde lo que trae el código QR.
// Acepta: "12", {"id":12}, "...?id=12" o "https://sitio.com/jugador/12"
function sacarId(texto: string): string | null {
  const limpio = texto.trim();

  if (/^\d+$/.test(limpio)) return limpio;

  try {
    const json = JSON.parse(limpio);
    if (json?.id != null) return String(json.id);
  } catch {
    // no era JSON, se sigue probando
  }

  const enQuery = limpio.match(/[?&]id=(\d+)/i);
  if (enQuery) return enQuery[1];

  const alFinal = limpio.match(/\/(\d+)\/?$/);
  if (alFinal) return alFinal[1];

  return null;
}

export default function Scanear() {
  const router = useRouter();
  const [permiso, pedirPermiso] = useCameraPermissions();

  // Evita que la cámara lea el mismo código muchas veces seguidas
  const bloqueado = useRef(false);
  const [noReconocido, setNoReconocido] = useState<string | null>(null);

  // Al volver a esta pantalla, el escáner queda listo otra vez
  useFocusEffect(
    useCallback(() => {
      bloqueado.current = false;
      setNoReconocido(null);
    }, [])
  );

  const alEscanear = ({ data }: { data: string }) => {
    if (bloqueado.current) return;
    bloqueado.current = true;

    const id = sacarId(data);

    if (id) {
      router.push({ pathname: "/Detalle", params: { id } } as any);
    } else {
      setNoReconocido(data);
    }
  };

  const escanearOtra = () => {
    bloqueado.current = false;
    setNoReconocido(null);
  };

  // 1) Todavía se está consultando el permiso
  if (!permiso) {
    return (
      <View style={styles.centro}>
        <Text style={styles.texto}>Preparando la cámara...</Text>
      </View>
    );
  }

  // 2) Sin permiso
  if (!permiso.granted) {
    return (
      <View style={styles.centro}>
        <Text style={styles.emoji}>📷</Text>
        <Text style={styles.titulo}>Necesitamos la cámara</Text>
        <Text style={styles.texto}>
          Permite el acceso a la cámara para escanear el código de un jugador.
        </Text>

        {permiso.canAskAgain ? (
          <Pressable style={styles.boton} onPress={pedirPermiso}>
            <Text style={styles.botonTexto}>Permitir cámara</Text>
          </Pressable>
        ) : (
          <Pressable
            style={styles.boton}
            onPress={() => Linking.openSettings()}
          >
            <Text style={styles.botonTexto}>Abrir ajustes</Text>
          </Pressable>
        )}
      </View>
    );
  }

  // 3) Cámara lista
  return (
    <View style={styles.contenedor}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={noReconocido ? undefined : alEscanear}
      />

      {/* Marco de guía */}
      <View style={styles.capa} pointerEvents="none">
        <View style={styles.marco}>
          <View style={[styles.esquina, styles.esqSupIzq]} />
          <View style={[styles.esquina, styles.esqSupDer]} />
          <View style={[styles.esquina, styles.esqInfIzq]} />
          <View style={[styles.esquina, styles.esqInfDer]} />
        </View>
        <Text style={styles.ayuda}>Apunta al código QR del jugador</Text>
      </View>

      {/* Código leído pero no reconocido */}
      {noReconocido && (
        <View style={styles.tarjeta}>
          <Text style={styles.tarjetaTitulo}>Código no reconocido</Text>
          <Text style={styles.tarjetaTexto} numberOfLines={3}>
            {noReconocido}
          </Text>

          <View style={styles.tarjetaBotones}>
            {/^https?:\/\//i.test(noReconocido) && (
              <Pressable
                style={[styles.boton, styles.botonSecundario]}
                onPress={() => Linking.openURL(noReconocido)}
              >
                <Text style={styles.botonSecundarioTexto}>Abrir enlace</Text>
              </Pressable>
            )}
            <Pressable style={styles.boton} onPress={escanearOtra}>
              <Text style={styles.botonTexto}>Escanear de nuevo</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const ESQUINA = 34;
const GROSOR = 5;

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#000",
  },
  centro: {
    flex: 1,
    backgroundColor: C.fondo,
    justifyContent: "center",
    alignItems: "center",
    padding: 28,
  },
  emoji: {
    fontSize: 54,
    marginBottom: 12,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "900",
    color: C.tinta,
    marginBottom: 8,
  },
  texto: {
    color: C.gris,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 22,
  },

  capa: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  marco: {
    width: 250,
    height: 250,
  },
  esquina: {
    position: "absolute",
    width: ESQUINA,
    height: ESQUINA,
    borderColor: C.oro,
  },
  esqSupIzq: {
    top: 0,
    left: 0,
    borderTopWidth: GROSOR,
    borderLeftWidth: GROSOR,
    borderTopLeftRadius: 14,
  },
  esqSupDer: {
    top: 0,
    right: 0,
    borderTopWidth: GROSOR,
    borderRightWidth: GROSOR,
    borderTopRightRadius: 14,
  },
  esqInfIzq: {
    bottom: 0,
    left: 0,
    borderBottomWidth: GROSOR,
    borderLeftWidth: GROSOR,
    borderBottomLeftRadius: 14,
  },
  esqInfDer: {
    bottom: 0,
    right: 0,
    borderBottomWidth: GROSOR,
    borderRightWidth: GROSOR,
    borderBottomRightRadius: 14,
  },
  ayuda: {
    marginTop: 22,
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 15,
    backgroundColor: "rgba(11,46,31,0.75)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    overflow: "hidden",
  },

  tarjeta: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 30,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: C.borde,
  },
  tarjetaTitulo: {
    fontSize: 17,
    fontWeight: "900",
    color: C.tinta,
    marginBottom: 6,
  },
  tarjetaTexto: {
    color: C.gris,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
  },
  tarjetaBotones: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-end",
  },

  boton: {
    backgroundColor: C.pasto,
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 999,
    alignItems: "center",
  },
  botonTexto: {
    color: C.oro,
    fontWeight: "800",
    fontSize: 14,
  },
  botonSecundario: {
    backgroundColor: C.menta,
  },
  botonSecundarioTexto: {
    color: C.cesped,
    fontWeight: "800",
    fontSize: 14,
  },
});
