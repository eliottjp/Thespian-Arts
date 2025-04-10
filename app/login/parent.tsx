import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";

export default function ParentLoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { refreshUserData } = useAuth();

  const login = async () => {
    setError("");
    setLoading(true);
    try {
      // Firebase Auth login
      const res = await signInWithEmailAndPassword(auth, email, password);

      // Immediately fetch user data from Firestore
      const userRef = doc(db, "users", res.user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setError("User profile not found.");
        setLoading(false);
        return;
      }

      // Set context userData
      await refreshUserData();

      // Redirects are handled by RoleRouter
    } catch (e: any) {
      console.error("Login error", e);
      setError("Incorrect email or password. Please try again.");
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back 👋</Text>
      <Text style={styles.subtitle}>Log in to access your dashboard</Text>

      {/* Email Input */}
      <View style={styles.inputWrapper}>
        <Ionicons
          name="mail-outline"
          size={20}
          color="#999"
          style={styles.icon}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
          placeholderTextColor="#999"
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputWrapper}>
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color="#999"
          style={styles.icon}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={secure}
          style={styles.input}
          placeholderTextColor="#999"
        />
        <Pressable onPress={() => setSecure(!secure)}>
          <Ionicons
            name={secure ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#d60124"
          />
        </Pressable>
      </View>

      {/* Error Message */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Login Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={login}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Log In</Text>
        )}
      </TouchableOpacity>

      {/* Create Account Link */}
      <View style={{ marginTop: 24 }}>
        <TouchableOpacity onPress={() => router.push("/login/create-account")}>
          <Text
            style={{ textAlign: "center", color: "#d60124", fontWeight: "600" }}
          >
            Don’t have an account? Create one
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 6,
    color: "#222",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    color: "#666",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 14,
    color: "#333",
  },
  button: {
    backgroundColor: "#d60124",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  error: {
    color: "#d60124",
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "500",
  },
});
