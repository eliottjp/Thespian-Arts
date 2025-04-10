import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function SuccessPage() {
  const { childId, groupName } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Here you can verify if the payment was successful through a backend or other means.
    console.log(
      `Payment was successful for ${childId} in the class: ${groupName}`
    );
  }, [childId, groupName]);

  const handleBackToHome = () => {
    router.push("/parent"); // Go back to the home page or wherever you want
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Successful!</Text>
      <Text style={styles.subTitle}>
        You've successfully subscribed to {groupName} for {childId}.
      </Text>
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
