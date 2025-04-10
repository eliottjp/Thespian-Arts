import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import * as Animatable from "react-native-animatable";

export default function OnboardingStep2() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      <Animatable.Text animation="fadeInDown" delay={100} style={styles.emoji}>
        📅
      </Animatable.Text>

      <Animatable.Text animation="fadeInUp" delay={300} style={styles.title}>
        Check Your Timetable
      </Animatable.Text>

      <Animatable.Text animation="fadeInUp" delay={500} style={styles.subtitle}>
        Stay on top of your schedule and never miss a rehearsal or lesson.
      </Animatable.Text>

      <Animatable.View animation="fadeInUp" delay={700}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/onboarding/step3")}
        >
          <Text style={styles.buttonText}>Next</Text>
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
