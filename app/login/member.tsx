import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import * as Crypto from "expo-crypto";

export default function MemberLogin() {
  const router = useRouter();
  const { loginMember } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    console.log("Logging in with:", username, password);

    if (!username || !password) {
      Alert.alert("Missing Info", "Please enter both username and password.");
      return;
    }

    setLoading(true);

    try {
      const q = query(
        collection(db, "members"),
        where("username", "==", username)
      );
      const snapshot = await getDocs(q);

      console.log("Snapshot size:", snapshot.size);

      if (snapshot.empty) {
        Alert.alert("Login Failed", "Username not found.");
        setLoading(false);
        return;
      }

      const doc = snapshot.docs[0];
      const data = doc.data();

      // 🔐 Hash the entered password to match stored hash
      const hashedInput = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password
      );

      const passwordMatch = hashedInput === data.password;
      console.log("Password match:", passwordMatch);

      if (!passwordMatch) {
        Alert.alert("Login Failed", "Incorrect password.");
        setLoading(false);
        return;
      }

      await loginMember({ ...data, uid: doc.id });
      router.replace("/member");
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Something went wrong. Try again.");
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Member Login</Text>
      <Text style={styles.subtitle}>
        Enter your username and password below.
      </Text>

      {/* Username Input */}
      <View style={styles.inputWrapper}>
        <Ionicons
          name="person-outline"
          size={20}
          color="#999"
          style={styles.icon}
        />
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
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

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Logging in..." : "Log In"}
        </Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Don't Have a Login?</Text>
        <Text style={styles.cardText}>
          Use your unique code to set up a member account provided by your
          tutor.
        </Text>
        <Pressable
          onPress={() => router.push("/login/setup")}
          style={styles.linkButton}
        >
          <Text style={styles.linkText}>➕ Set Up Member Account</Text>
        </Pressable>
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
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 6,
    color: "#222",
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 24,
    color: "#555",
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
  card: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 10,
    borderColor: "#eee",
    borderWidth: 1,
    marginTop: 32,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  cardText: {
    fontSize: 14,
    marginBottom: 10,
    color: "#333",
  },
  linkButton: {
    alignSelf: "flex-start",
  },
  linkText: {
    color: "#d60124",
    fontWeight: "600",
  },
});
