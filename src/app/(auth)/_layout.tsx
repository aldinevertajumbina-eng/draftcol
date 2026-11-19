import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen
        name="registro"
        options={{
          title: "Crear cuenta",
          headerStyle: { backgroundColor: "#0B2E1F" },
          headerTintColor: "#F2B632",
          headerTitleStyle: { color: "#FFFFFF", fontWeight: "bold" },
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}