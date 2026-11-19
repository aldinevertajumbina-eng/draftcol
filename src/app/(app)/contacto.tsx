import {
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function Contacto() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Contacto</Text>
      <Text style={styles.subtitulo}>
        Información general de la aplicación.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Universidad</Text>
        <Text style={styles.valor}>Universidad CESMAG</Text>

        <Text style={styles.label}>Programa</Text>
        <Text style={styles.valor}>Ingeniería de Sistemas</Text>

        <Text style={styles.label}>Asignatura</Text>
        <Text style={styles.valor}>Desarrollo Móvil</Text>

        <Text style={styles.label}>Correo</Text>
        <Text style={styles.valor}>contacto@ejemplo.com</Text>

        <Text style={styles.label}>Ciudad</Text>
        <Text style={styles.valor}>Pasto</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F8F4",
    justifyContent: "center",
    padding: 20,
  },

  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#145A32",
  },

  subtitulo: {
    textAlign: "center",
    color: "#52705D",
    marginBottom: 22,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#B7DCC5",
    elevation: 3,
  },

  label: {
    color: "#36865A",
    fontSize: 13,
    marginTop: 8,
  },

  valor: {
    color: "#183B2A",
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 8,
  },
});