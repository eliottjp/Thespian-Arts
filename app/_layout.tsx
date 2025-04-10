// app/_layout.tsx
import { Slot, Stack } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import RoleRouter from "../components/RoleRouter";
import { View, ActivityIndicator } from "react-native";
import Toast from "react-native-toast-message";
import { AdminProvider } from "../context/AdminModeContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppContent />
      <Toast />
    </AuthProvider>
  );
}

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#d60124" />
      </View>
    );
  }

  return (
    <RoleRouter>
      <AdminProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Slot />
        </Stack>
      </AdminProvider>
    </RoleRouter>
  );
}
