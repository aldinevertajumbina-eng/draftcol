import { useRouter } from "expo-router";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";

const C = {
  fondo: "#EEF4EC",
  pasto: "#0B2E1F",
  cesped: "#1F8A4C",
  menta: "#D9EBDD",
  oro: "#F2B632",
  tinta: "#10261B",
  gris: "#5F7568",
  rojo: "#B3363F",
};

function Tarjeta({
  icono,
  titulo,
  descripcion,
  onPress,
  destacada = false,
}: {
  icono: string;
  titulo: string;
  descripcion: string;
  onPress: () => void;
  destacada?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tarjeta,
        destacada && styles.tarjetaDestacada,
        pressed && styles.presionado,
      ]}
    >
      <View style={[styles.iconoCaja, destacada && styles.iconoCajaDestacada]}>
        <Text style={styles.icono}>{icono}</Text>
      </View>

      <View style={styles.tarjetaInfo}>
        <Text style={[styles.tarjetaTitulo, destacada && styles.textoClaro]}>
          {titulo}
        </Text>
        <Text
          style={[styles.tarjetaDescripcion, destacada && styles.textoSuave]}
        >
          {descripcion}
        </Text>
      </View>

      <Text style={[styles.flecha, destacada && { color: C.oro }]}>›</Text>
    </Pressable>
  );
}

/* Componente del profe: reutiliza el diseño de Tarjeta */
function OpcionMenu({
  icono,
  titulo,
  descripcion,
  onPress,
}: {
  icono: string;
  titulo: string;
  descripcion: string;
  onPress: () => void;
}) {
  return (
    <Tarjeta
      icono={icono}
      titulo={titulo}
      descripcion={descripcion}
      onPress={onPress}
    />
  );
}

export default function Inicio() {
  const router = useRouter();
  const { cerrarSesion } = useAuth();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* PORTADA */}
      <View style={styles.hero}>
        <Image
          source={{
            uri: "https://img.magnific.com/foto-gratis/concepto-hacer-deporte_23-2151937746.jpg?semt=ais_hybrid&w=740&q=80",
          }}
          style={styles.heroImagen}
        />
        <View style={styles.heroVelo} />

        <View style={styles.heroContenido}>
          <Text style={styles.heroEtiqueta}>Tu sueño hecho realidad</Text>
          <Text style={styles.heroTitulo}>DraftCol</Text>
          <Text style={styles.heroTexto}>
            Regístrate y, si eres bueno en lo que haces, serás el próximo en
            brillar.
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.heroBoton,
              pressed && styles.presionado,
            ]}
            onPress={() => router.push("/formulario" as any)}
          >
            <Text style={styles.heroBotonTexto}>Inscribirme ahora</Text>
          </Pressable>
        </View>
      </View>

      {/* CIFRAS */}
      <View style={styles.cifras}>
        <View style={styles.cifra}>
          <Text style={styles.cifraNumero}>Millones</Text>
          <Text style={styles.cifraTexto}>de talentos</Text>
        </View>

        <View style={styles.cifraLinea} />

        <View style={styles.cifra}>
          <Text style={styles.cifraNumero}>100%</Text>
          <Text style={styles.cifraTexto}>calidad</Text>
        </View>

        <View style={styles.cifraLinea} />

        <View style={styles.cifra}>
          <Text style={styles.cifraNumero}>Solo pocos</Text>
          <Text style={styles.cifraTexto}>serán celebridades</Text>
        </View>
      </View>

      {/* ACCIONES */}
      <Text style={styles.seccion}>¿Qué quieres hacer hoy?</Text>

      <Tarjeta
        destacada
        icono="⚽"
        titulo="Ver jugadores"
        descripcion="Hay mucho talento por descubrir"
        onPress={() => router.push("/VerJugadores" as any)}
      />

      <Tarjeta
        icono="📝"
        titulo="Inscribirme"
        descripcion="Llena tu ficha y entra al draft"
        onPress={() => router.push("/formulario" as any)}
      />

      <Tarjeta
        icono="📍"
        titulo="Contacto"
        descripcion="Escríbenos o visítanos"
        onPress={() => router.push("/contacto" as any)}
      />

      {/* HERRAMIENTAS (código del profe) */}
      <View style={styles.herramientasContainer}>
       

        <OpcionMenu
          icono="📷"
          titulo="Escáner"
          descripcion="Escanea un código para ver su información."
          onPress={() => router.push("/scanear" as any)}
        />

        <OpcionMenu
          icono="📄"
          titulo="Detalles"
          descripcion="Consulta el detalle de un registro."
          onPress={() => router.push("/Detalle" as any)}
        />
      </View>

      {/* CERRAR SESIÓN */}
      <Pressable
        style={({ pressed }) => [
          styles.botonCerrar,
          pressed && styles.botonCerrarPresionado,
        ]}
        onPress={cerrarSesion}
      >
        <Text style={styles.textoCerrar}>Cerrar sesión</Text>
      </Pressable>

      <Text style={styles.footer}>DraftCol móvil</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: C.fondo,
    padding: 18,
    paddingBottom: 32,
  },

  /* PORTADA */
  hero: {
    height: 330,
    borderRadius: 26,
    overflow: "hidden",
    marginBottom: 18,
    backgroundColor: C.pasto,
  },
  heroImagen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  heroVelo: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(5, 28, 18, 0.62)",
  },
  heroContenido: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 22,
  },
  heroEtiqueta: {
    color: C.oro,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 4,
  },
  heroTitulo: {
    color: "#FFFFFF",
    fontSize: 44,
    fontWeight: "900",
    marginBottom: 6,
  },
  heroTexto: {
    color: "#DDEBE2",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 18,
  },
  heroBoton: {
    alignSelf: "flex-start",
    backgroundColor: C.oro,
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 999,
  },
  heroBotonTexto: {
    color: C.pasto,
    fontWeight: "800",
    fontSize: 15,
  },

  /* CIFRAS */
  cifras: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 26,
    borderWidth: 1,
    borderColor: "#DCE8DF",
  },
  cifra: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 4,
  },
  cifraNumero: {
    color: C.cesped,
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },
  cifraTexto: {
    color: C.gris,
    fontSize: 12,
    marginTop: 3,
    textAlign: "center",
  },
  cifraLinea: {
    width: 1,
    height: 36,
    backgroundColor: "#DCE8DF",
  },

  /* ACCIONES */
  seccion: {
    fontSize: 22,
    fontWeight: "800",
    color: C.tinta,
    marginBottom: 14,
  },
  tarjeta: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DCE8DF",
  },
  tarjetaDestacada: {
    backgroundColor: C.pasto,
    borderColor: C.pasto,
  },
  iconoCaja: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: C.menta,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  iconoCajaDestacada: {
    backgroundColor: C.oro,
  },
  icono: {
    fontSize: 24,
  },
  tarjetaInfo: {
    flex: 1,
  },
  tarjetaTitulo: {
    fontSize: 17,
    fontWeight: "800",
    color: C.tinta,
    marginBottom: 2,
  },
  tarjetaDescripcion: {
    color: C.gris,
    fontSize: 13,
    lineHeight: 18,
  },
  textoClaro: {
    color: "#FFFFFF",
  },
  textoSuave: {
    color: "#A9C7B5",
  },
  flecha: {
    fontSize: 30,
    color: C.cesped,
    marginLeft: 8,
  },
  presionado: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },

  /* HERRAMIENTAS (profe) */
  herramientasContainer: {
    marginTop: 4,
  },

  /* CERRAR SESIÓN */
  botonCerrar: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: C.rojo,
  },
  botonCerrarPresionado: {
    backgroundColor: "#F8E3E5",
  },
  textoCerrar: {
    color: C.rojo,
    fontWeight: "800",
    fontSize: 15,
  },

  footer: {
    textAlign: "center",
    color: C.gris,
    fontSize: 12,
    marginTop: 22,
  },
});