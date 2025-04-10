import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  InteractionManager,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import { Ionicons } from "@expo/vector-icons";

export default function CreateAccount() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [secure, setSecure] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name || !email || !password || !confirm) {
      Alert.alert("Missing Info", "Please fill out all fields.");
      return;
    }

    if (password !== confirm) {
      Alert.alert("Password Mismatch", "Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(res.user, { displayName: name });

      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        name,
        email,
        role: "parent",
        photoURL: "",
        onboardingComplete: false,
        linkedChildren: [],
      });

      InteractionManager.runAfterInteractions(() => {
        router.replace("/onboarding");
      });
    } catch (err: any) {
      console.error("Signup Error:", err);
      Alert.alert("Signup Error", err.message);
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Parent Account</Text>
      <Text style={styles.subtitle}>
        Sign up to get the most out of Thespian Arts
      </Text>

      {/* Full Name */}
      <View style={styles.inputWrapper}>
        <Ionicons name="person-outline" size={20} color="#999" />
        <TextInput
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholderTextColor="#999"
        />
      </View>

      {/* Email */}
      <View style={styles.inputWrapper}>
        <Ionicons name="mail-outline" size={20} color="#999" />
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

      {/* Password */}
      <View style={styles.inputWrapper}>
        <Ionicons name="lock-closed-outline" size={20} color="#999" />
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

      {/* Confirm Password */}
      <View style={styles.inputWrapper}>
        <Ionicons name="lock-closed-outline" size={20} color="#999" />
        <TextInput
          placeholder="Confirm Password"
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry={secureConfirm}
          style={styles.input}
          placeholderTextColor="#999"
        />
        <Pressable onPress={() => setSecureConfirm(!secureConfirm)}>
          <Ionicons
            name={secureConfirm ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#d60124"
          />
        </Pressable>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleCreate}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Creating..." : "Create Account"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.replace("/login/parent")}
        style={{ marginTop: 24 }}
      >
        <Text style={styles.loginLink}>Already have an account? Log In</Text>
      </TouchableOpacity>
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
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 14,
    color: "#333",
    marginLeft: 8,
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
  loginLink: {
    color: "#d60124",
    textAlign: "center",
    fontWeight: "600",
  },
});
