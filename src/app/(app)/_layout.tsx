import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#21263A" },
        headerTintColor: "#D0D34D",
        headerTitleStyle: { color: "#FFFFFF", fontWeight: "bold" },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "DraftCol" }} />
      <Stack.Screen name="formulario" options={{ title: "Inscripción" }} />
      <Stack.Screen name="resultado" options={{ title: "Resultado" }} />
      <Stack.Screen name="registros" options={{ title: "Registros" }} />
      <Stack.Screen name="VerJugadores" options={{ title: "Jugadores" }} />
      <Stack.Screen name="contacto" options={{ title: "Contacto" }} />
      <Stack.Screen name="explore" options={{ title: "Explorar" }} />
      <Stack.Screen name="Detalle" options={{ title: "Detalles" }} />
      <Stack.Screen name="scanear" options={{ title: "scanear" }} />
    </Stack>
  );
}