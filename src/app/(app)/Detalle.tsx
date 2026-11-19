import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Linking,
    Pressable,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
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

type Jugador = {
  id: number;
  codigo: string | null;
  nombre: string | null;
  correo: string | null;
  telefono: string | null;
  ciudad: string | null;
  foto_url: string | null;
  posicion: string | null;
  pie_habil: string | null;
  cualidades: string | null;
};

// Enlace de WhatsApp con indicativo de Colombia (57).
// Devuelve null si el teléfono no tiene 10 dígitos.
function enlaceWhatsApp(j: Jugador): string | null {
  const digitos = (j.telefono ?? "").replace(/\D/g, "");
  if (digitos.length !== 10) return null;
  const mensaje = `Hola ${j.nombre ?? ""}, vi tu perfil ${
    j.codigo ?? ""
  } en DraftCol y me gustaría contactarte.`;
  return `https://wa.me/57${digitos}?text=${encodeURIComponent(mensaje)}`;
}

function Avatar({ jugador }: { jugador: Jugador }) {
  if (jugador.foto_url) {
    return <Image source={{ uri: jugador.foto_url }} style={styles.avatar} />;
  }
  const inicial = (jugador.nombre ?? "?").trim().charAt(0).toUpperCase();
  return (
    <View style={[styles.avatar, styles.avatarInicial]}>
      <Text style={styles.avatarLetra}>{inicial || "?"}</Text>
    </View>
  );
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor?: string | null }) {
  if (!valor) return null;
  return (
    <View style={styles.dato}>
      <Text style={styles.datoEtiqueta}>{etiqueta}</Text>
      <Text style={styles.datoValor}>{valor}</Text>
    </View>
  );
}

export default function Detalles() {
  // Si se llega desde "Ver más detalles", viene el id del jugador elegido.
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const idElegido = Array.isArray(params.id) ? params.id[0] : params.id;

  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    const { data, error: errorConsulta } = await supabase
      .from("jugadores")
      .select("*")
      .order("id", { ascending: false });

    if (errorConsulta) {
      setError(errorConsulta.message);
      return;
    }

    setError(null);
    const lista = (data ?? []) as Jugador[];

    // El jugador elegido aparece primero; los demás van detrás.
    if (idElegido) {
      const elegido = lista.filter((j) => String(j.id) === String(idElegido));
      const resto = lista.filter((j) => String(j.id) !== String(idElegido));
      setJugadores([...elegido, ...resto]);
    } else {
      setJugadores(lista);
    }
  }, [idElegido]);

  useFocusEffect(
    useCallback(() => {
      setCargando(true);
      cargar().finally(() => setCargando(false));
    }, [cargar])
  );

  const alRefrescar = async () => {
    setRefrescando(true);
    await cargar();
    setRefrescando(false);
  };

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color={C.cesped} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centro}>
        <Text style={styles.errorTitulo}>No se pudieron cargar los detalles</Text>
        <Text style={styles.errorTexto}>{error}</Text>
        <Pressable style={styles.botonPrincipal} onPress={alRefrescar}>
          <Text style={styles.botonPrincipalTexto}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.lista}
      contentContainerStyle={styles.contenido}
      data={jugadores}
      keyExtractor={(item) => String(item.id)}
      refreshControl={
        <RefreshControl refreshing={refrescando} onRefresh={alRefrescar} />
      }
      ListEmptyComponent={
        <View style={styles.centro}>
          <Text style={styles.errorTitulo}>Aún no hay jugadores</Text>
          <Text style={styles.errorTexto}>
            Cuando alguien se inscriba, sus detalles aparecerán aquí.
          </Text>
        </View>
      }
      renderItem={({ item }) => {
        const wa = enlaceWhatsApp(item);
        const esElegido = !!idElegido && String(item.id) === String(idElegido);

        return (
          <View style={[styles.tarjeta, esElegido && styles.tarjetaElegida]}>
            {/* Cabecera */}
            <View style={styles.cabecera}>
              <Avatar jugador={item} />
              <View style={styles.cabeceraTexto}>
                {!!item.codigo && (
                  <View style={styles.codigo}>
                    <Text style={styles.codigoTexto}>{item.codigo}</Text>
                  </View>
                )}
                <Text style={styles.nombre}>{item.nombre}</Text>
                {!!item.posicion && (
                  <Text style={styles.posicion}>{item.posicion}</Text>
                )}
              </View>
            </View>

            {/* Datos */}
            <Dato etiqueta="Pie hábil" valor={item.pie_habil} />
            <Dato etiqueta="Cualidades" valor={item.cualidades} />
            <Dato etiqueta="Ciudad" valor={item.ciudad} />
            <Dato etiqueta="Teléfono" valor={item.telefono} />
            <Dato etiqueta="Correo" valor={item.correo} />

            {/* QR de WhatsApp */}
            <View style={styles.qrZona}>
              {wa ? (
                <>
                  <View style={styles.qrMarco}>
                    <QRCode value={wa} size={130} />
                  </View>
                  <Text style={styles.qrTexto}>
                    Escanea para escribirle por WhatsApp
                  </Text>
                  <Pressable
                    style={styles.botonPrincipal}
                    onPress={() => Linking.openURL(wa)}
                  >
                    <Text style={styles.botonPrincipalTexto}>
                      Abrir WhatsApp
                    </Text>
                  </Pressable>
                </>
              ) : (
                <Text style={styles.qrAviso}>
                  Este jugador no tiene un teléfono válido de 10 dígitos, por
                  eso no se puede generar el QR.
                </Text>
              )}
            </View>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  lista: {
    flex: 1,
    backgroundColor: C.fondo,
  },
  contenido: {
    padding: 18,
    paddingBottom: 40,
  },
  centro: {
    flex: 1,
    backgroundColor: C.fondo,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  tarjeta: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: C.borde,
  },
  tarjetaElegida: {
    borderColor: C.oro,
    borderWidth: 2,
  },

  cabecera: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  cabeceraTexto: {
    flex: 1,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 2,
    borderColor: C.oro,
    marginRight: 14,
  },
  avatarInicial: {
    backgroundColor: C.menta,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarLetra: {
    fontSize: 32,
    fontWeight: "900",
    color: C.cesped,
  },
  codigo: {
    alignSelf: "flex-start",
    backgroundColor: C.pasto,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 6,
  },
  codigoTexto: {
    color: C.oro,
    fontWeight: "800",
    fontSize: 12,
  },
  nombre: {
    fontSize: 20,
    fontWeight: "900",
    color: C.tinta,
  },
  posicion: {
    color: C.cesped,
    fontWeight: "700",
    fontSize: 14,
    marginTop: 2,
  },

  dato: {
    borderTopWidth: 1,
    borderTopColor: C.borde,
    paddingVertical: 10,
  },
  datoEtiqueta: {
    color: C.gris,
    fontSize: 12,
    marginBottom: 2,
  },
  datoValor: {
    color: C.tinta,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 21,
  },

  qrZona: {
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: C.borde,
    paddingTop: 16,
    marginTop: 4,
  },
  qrMarco: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.borde,
  },
  qrTexto: {
    color: C.gris,
    fontSize: 13,
    marginTop: 10,
    marginBottom: 12,
    textAlign: "center",
  },
  qrAviso: {
    color: C.gris,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
  },

  botonPrincipal: {
    backgroundColor: C.pasto,
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 999,
  },
  botonPrincipalTexto: {
    color: C.oro,
    fontWeight: "800",
  },

  errorTitulo: {
    fontSize: 18,
    fontWeight: "800",
    color: C.tinta,
    marginBottom: 6,
    textAlign: "center",
  },
  errorTexto: {
    color: C.gris,
    textAlign: "center",
    marginBottom: 18,
  },
});
