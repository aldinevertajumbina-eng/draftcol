import { useRouter } from "expo-router";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

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
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.iconoCaja}>
        <Text style={styles.icono}>{icono}</Text>
      </View>

      <View style={styles.cardInfo}>
        <Text style={styles.cardTitulo}>{titulo}</Text>
        <Text style={styles.cardDescripcion}>{descripcion}</Text>
      </View>

      <Text style={styles.flecha}>›</Text>
    </Pressable>
  );
}

export default function Inicio() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* PORTADA PRINCIPAL */}
      <View style={styles.hero}>
        <Image
          source={{
            uri: "https://img.magnific.com/foto-gratis/concepto-hacer-deporte_23-2151937746.jpg?semt=ais_hybrid&w=740&q=80https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
          }}
          style={styles.imagenHero}
        />

        <View style={styles.overlay}>
          <Text style={styles.etiqueta}>
            Tu sueño hecho realidad
          </Text>

          <Text style={styles.titulo}>
            DRAFTCOL
          </Text>

          <Text style={styles.subtitulo}>
            Registrate y si eres bueno en lo que haces seras el proximo en brillar
          </Text>
        </View>
      </View>

      {/* BIENVENIDA */}
      <View style={styles.saludoBox}>
        <View>
          <Text style={styles.saludoTitulo}>
            Hola, quieres ver nuestros jugadores?
          </Text>

          <Text style={styles.saludoTexto}>
            Hay mucho talento por descubrir
          </Text>
        </View>

        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>
            ⚽
          </Text>
        </View>
      </View>

      {/* RESUMEN */}
      <View style={styles.resumen}>

        <View style={styles.resumenItem}>
          <Text style={styles.resumenNumero}>
            Millones
          </Text>

          <Text style={styles.resumenTexto}>
            De talentos
          </Text>
        </View>

        <View style={styles.separador} />

        <View style={styles.resumenItem}>
          <Text style={styles.resumenNumero}>
            100%
          </Text>

          <Text style={styles.resumenTexto}>
            Calidad
          </Text>
        </View>

        <View style={styles.separador} />

        <View style={styles.resumenItem}>
          <Text style={styles.resumenNumero}>
            Solo pocos
          </Text>

          <Text style={styles.resumenTexto}>
            Seran celebridades
          </Text>
        </View>

      </View>

      {/* TÍTULO */}
      <Text style={styles.seccionTitulo}>
        ¿Que deseas el dia de hoy?
      </Text>

      {/* FILA DE TRES BOTONES */}
      <View style={styles.menuFila}>

        {/* REGISTRARSE */}
        <Pressable
          style={({ pressed }) => [
            styles.botonPequeno,
            styles.botonGaleria,
            pressed && styles.botonPresionado,
          ]}
          onPress={() => router.push("/formulario")}
        >
          <Text style={styles.botonIcono}>
            📝
          </Text>

          <Text style={styles.botonTexto}>
            Regístrate
          </Text>
        </Pressable>

        {/* JUGADORES */}
        <Pressable
          style={({ pressed }) => [
            styles.botonPequeno,
            styles.botonCafe,
            pressed && styles.botonPresionado,
          ]}
          onPress={() => router.push("/imagenes")}
        >
          <Text style={styles.botonIcono}>
            ⚽
          </Text>

          <Text style={styles.botonTexto}>
            Jugadores
          </Text>
        </Pressable>

        {/* CONTACTO */}
        <Pressable
          style={({ pressed }) => [
            styles.botonPequeno,
            styles.botonContacto,
            pressed && styles.botonPresionado,
          ]}
          onPress={() => router.push("/contacto")}
        >
          <Text style={styles.botonIcono}>
            📍
          </Text>

          <Text style={styles.botonTexto}>
            Contacto
          </Text>
        </Pressable>

      </View>

      {/* PIE DE PÁGINA */}
      <Text style={styles.footer}>
        Draftcol movil
      </Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flexGrow: 1,
    backgroundColor: "#F4F8F5",
    padding: 18,
  },

  /* =========================
     PORTADA
  ========================= */

  hero: {
    height: 280,
    borderRadius: 28,
    overflow: "hidden",
    marginBottom: 20,
    elevation: 6,
  },

  imagenHero: {
    width: "100%",
    height: "100%",
  },

  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 22,
    backgroundColor: "rgba(10, 45, 30, 0.78)",
  },

  etiqueta: {
    color: "#B8E6C1",
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 1.8,
    marginBottom: 6,
  },

  titulo: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 6,
  },

  subtitulo: {
    color: "#E8F5EB",
    fontSize: 14,
    lineHeight: 21,
  },

  /* =========================
     SALUDO
  ========================= */

  saludoBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    elevation: 2,
  },

  saludoTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#123B28",
  },

  saludoTexto: {
    marginTop: 3,
    color: "#668073",
    fontSize: 14,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#DCEFE1",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarTexto: {
    fontSize: 24,
  },

  /* =========================
     RESUMEN
  ========================= */

  resumen: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 24,
    elevation: 2,
  },

  resumenItem: {
    flex: 1,
    alignItems: "center",
  },

  resumenNumero: {
    color: "#16834B",
    fontSize: 18,
    fontWeight: "bold",
  },

  resumenTexto: {
    color: "#668073",
    fontSize: 12,
    marginTop: 3,
  },

  separador: {
    width: 1,
    height: 35,
    backgroundColor: "#D5E5DA",
  },

  /* =========================
     TÍTULO
  ========================= */

  seccionTitulo: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#123B28",
    marginBottom: 14,
  },

  /* =========================
     BOTONES
  ========================= */

  menuFila: {
    flexDirection: "row",
    gap: 9,
    marginBottom: 20,
  },

  botonPequeno: {
    flex: 1,
    minHeight: 90,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,

    shadowColor: "#123B28",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.18,
    shadowRadius: 3,
  },

  botonGaleria: {
    backgroundColor: "#16834B",
  },

  botonContacto: {
    backgroundColor: "#145C38",
  },

  botonCafe: {
    backgroundColor: "#4CAF70",
  },

  botonPresionado: {
    opacity: 0.7,
    transform: [
      {
        scale: 0.95,
      },
    ],
  },

  botonIcono: {
    fontSize: 22,
    marginBottom: 5,
  },

  botonTexto: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "center",
  },

  /* =========================
     ESTILOS ANTERIORES
  ========================= */

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DCE9E0",
    elevation: 2,
  },

  cardPresionada: {
    opacity: 0.75,
    transform: [
      {
        scale: 0.98,
      },
    ],
  },

  iconoCaja: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#E0F2E5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  icono: {
    fontSize: 25,
  },

  cardInfo: {
    flex: 1,
  },

  cardTitulo: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#123B28",
    marginBottom: 4,
  },

  cardDescripcion: {
    color: "#60786B",
    fontSize: 13,
    lineHeight: 18,
  },

  flecha: {
    fontSize: 30,
    color: "#16834B",
    marginLeft: 8,
  },

  /* =========================
     FOOTER
  ========================= */

  footer: {
    textAlign: "center",
    color: "#789084",
    fontSize: 12,
    marginTop: 24,
    marginBottom: 12,
  },

});