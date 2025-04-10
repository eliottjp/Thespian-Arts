import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function LoginSelector() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Who are you logging in as?</Text>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/login/parent")}
      >
        <Text style={styles.buttonText}>Parent / Staff</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/login/member")}
      >
        <Text style={styles.buttonText}>Member</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 32,
  },
  button: {
    backgroundColor: "#d60124",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginBottom: 16,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
