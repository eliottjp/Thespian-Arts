import { View, Text, StyleSheet, Button } from "react-native";
import { useRouter } from "expo-router";

export default function CancelPage() {
  const router = useRouter();

  const handleBackToHome = () => {
    router.push("/parent"); // Go back to the home page or wherever you want
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Canceled</Text>
      <Text style={styles.subTitle}>You have canceled your subscription.</Text>
      <Button title="Back to Home" onPress={handleBackToHome} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  subTitle: {
    fontSize: 18,
    marginTop: 12,
    color: "#555",
    textAlign: "center",
  },
});
