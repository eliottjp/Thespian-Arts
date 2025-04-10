// app/unknown-role.tsx
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";

export default function UnknownRoleScreen() {
  const router = useRouter();
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Oops! 🤔</Text>
      <Text style={styles.subtitle}>
        Your account doesn't have a valid role assigned.
      </Text>
      <Text style={styles.message}>
        Please contact support or try logging in again.
      </Text>

      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#d60124",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 8,
    color: "#333",
  },
  message: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
    color: "#666",
  },
  button: {
    backgroundColor: "#d60124",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
