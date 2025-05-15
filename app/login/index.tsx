import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";

export default function LoginSelector() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        {/* Logo stays fixed at the top */}
        <Image
          style={styles.logo}
          source={require("../../assets/images/logo.png")}
        />

        {/* This view holds everything else and centers it */}
        <View style={styles.content}>
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
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    backgroundColor: "#fff",
  },
  logo: {
    width: "100%",
    height: undefined,
    aspectRatio: 2.8,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 20,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#555",
    marginBottom: 36,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#d60124",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 16,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
});
