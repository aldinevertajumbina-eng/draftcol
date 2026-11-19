import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
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

type Jugador = {
  id: number;
  nombre: string | null;
  correo: string | null;
  telefono: string | null;
  ciudad: string | null;
  foto_url: string | null;
};

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

export default function Jugadores() {
  const router = useRouter();

  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    const { data, error: errorConsulta } = await supabase
      .from("jugadores")
      .select("id, nombre, correo, telefono, ciudad, foto_url")
      .order("id", { ascending: false });

    if (errorConsulta) {
      setError(errorConsulta.message);
    } else {
      setError(null);
      setJugadores((data ?? []) as Jugador[]);
    }
  }, []);

  // Se recarga cada vez que se entra a esta pantalla
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

  const verDetalles = (id: number) => {
    router.push({ pathname: "/Detalle", params: { id: String(id) } } as any);
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
        <Text style={styles.errorTitulo}>No se pudo cargar la lista</Text>
        <Text style={styles.errorTexto}>{error}</Text>
        <Pressable style={styles.botonReintentar} onPress={alRefrescar}>
          <Text style={styles.botonReintentarTexto}>Reintentar</Text>
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
      ListHeaderComponent={
        <View style={styles.encabezado}>
          <Text style={styles.subtitulo}>
            Conoce los nuevos talentos del fútbol colombiano
          </Text>
          <View style={styles.contador}>
            <Text style={styles.contadorTexto}>
              {jugadores.length}{" "}
              {jugadores.length === 1
                ? "jugador registrado"
                : "jugadores registrados"}
            </Text>
          </View>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.vacio}>
          <Text style={styles.vacioTitulo}>Aún no hay jugadores</Text>
          <Text style={styles.vacioTexto}>
            Sé el primero en inscribirte y aparecer aquí.
          </Text>
          <Pressable
            style={styles.botonReintentar}
            onPress={() => router.push("/formulario" as any)}
          >
            <Text style={styles.botonReintentarTexto}>Inscribir jugador</Text>
          </Pressable>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.tarjeta}>
          <View style={styles.fila}>
            <Avatar jugador={item} />

            <View style={styles.info}>
              <Text style={styles.nombre} numberOfLines={1}>
                {item.nombre}
              </Text>

              {!!item.ciudad && (
                <Text style={styles.dato} numberOfLines={1}>
                  📍 {item.ciudad}
                </Text>
              )}
              {!!item.telefono && (
                <Text style={styles.dato} numberOfLines={1}>
                  📞 {item.telefono}
                </Text>
              )}
              {!!item.correo && (
                <Text style={styles.dato} numberOfLines={1}>
                  ✉️ {item.correo}
                </Text>
              )}
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.botonDetalles,
              pressed && styles.presionado,
            ]}
            onPress={() => verDetalles(item.id)}
          >
            <Text style={styles.botonDetallesTexto}>Ver más detalles</Text>
          </Pressable>
        </View>
      )}
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

  encabezado: {
    marginBottom: 16,
  },
  subtitulo: {
    color: C.gris,
    fontSize: 15,
    lineHeight: 21,
  },
  contador: {
    alignSelf: "flex-start",
    backgroundColor: C.pasto,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    marginTop: 12,
  },
  contadorTexto: {
    color: C.oro,
    fontWeight: "800",
    fontSize: 13,
  },

  tarjeta: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: C.borde,
  },
  fila: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
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
    fontSize: 28,
    fontWeight: "900",
    color: C.cesped,
  },
  info: {
    flex: 1,
  },
  nombre: {
    fontSize: 17,
    fontWeight: "800",
    color: C.tinta,
    marginBottom: 4,
  },
  dato: {
    color: C.gris,
    fontSize: 13,
    lineHeight: 19,
  },

  botonDetalles: {
    backgroundColor: C.pasto,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 14,
  },
  botonDetallesTexto: {
    color: C.oro,
    fontWeight: "800",
    fontSize: 14,
  },
  presionado: {
    opacity: 0.85,
  },

  vacio: {
    alignItems: "center",
    paddingVertical: 50,
  },
  vacioTitulo: {
    fontSize: 20,
    fontWeight: "800",
    color: C.tinta,
  },
  vacioTexto: {
    color: C.gris,
    marginTop: 6,
    marginBottom: 18,
    textAlign: "center",
  },

  errorTitulo: {
    fontSize: 18,
    fontWeight: "800",
    color: C.tinta,
    marginBottom: 6,
  },
  errorTexto: {
    color: C.gris,
    textAlign: "center",
    marginBottom: 18,
  },
  botonReintentar: {
    backgroundColor: C.pasto,
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 999,
  },
  botonReintentarTexto: {
    color: C.oro,
    fontWeight: "800",
  },
});
