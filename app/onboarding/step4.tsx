import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import * as Animatable from "react-native-animatable";

export default function OnboardingStep4() {
  const router = useRouter();
  const { user, userData, refreshUserData } = useAuth();
  const [loading, setLoading] = useState(false);

  const finish = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (user?.uid && userData?.role) {
        const collectionName = userData.role === "member" ? "members" : "users";

        await updateDoc(doc(db, collectionName, user.uid), {
          onboardingComplete: true,
        });

        // ✅ Refresh context to reflect onboardingComplete
        await refreshUserData();

        // ✅ Redirect based on role
        const target =
          userData.role === "parent"
            ? "/parent"
            : userData.role === "member"
            ? "/member"
            : "/";

        router.replace(target);
      }
    } catch (error) {
      console.warn("Failed to complete onboarding:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Animatable.Text animation="fadeInDown" delay={100} style={styles.emoji}>
        🧒
      </Animatable.Text>

      <Animatable.Text animation="fadeInUp" delay={300} style={styles.title}>
        Link a Child
      </Animatable.Text>

      <Animatable.Text animation="fadeInUp" delay={500} style={styles.subtitle}>
        Parents can link their child to stay informed about classes, payments,
        and updates.
      </Animatable.Text>

      <Animatable.View animation="fadeInUp" delay={700}>
        <TouchableOpacity
          style={styles.button}
          onPress={finish}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Finishing..." : "Finish"}
          </Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#222",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#d60124",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    opacity: 1,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 24,
  },
  backText: {
    fontSize: 16,
    color: "#d60124",
    fontWeight: "600",
  },
});
