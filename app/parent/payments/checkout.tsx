import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { httpsCallable } from "firebase/functions";
import { functions, auth, db } from "../../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function CheckoutPage() {
  const { childId = "", classId = "", branch = "" } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [priceId, setPriceId] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [groupName, setGroupName] = useState<string>("");
  const [childName, setChildName] = useState<string>("");

  const userEmail = auth.currentUser?.email;

  useEffect(() => {
    const fetchGroupDetails = async () => {
      if (!classId || typeof classId !== "string") return;

      try {
        const groupRef = doc(db, "groups", classId);
        const groupSnap = await getDoc(groupRef);

        if (groupSnap.exists()) {
          const groupData = groupSnap.data();
          setPriceId(groupData?.priceId ?? null);
          setAmount(
            typeof groupData?.price === "number" ? groupData.price : null
          );
          setGroupName(groupData?.name ?? "Unnamed Group");
          console.log("✅ Group fetched:", groupData);
        } else {
          console.log("⚠️ Group not found");
          Alert.alert("Error", "Group not found");
        }
      } catch (err) {
        console.error("❌ Error fetching group details:", err);
        Alert.alert("Error", "Failed to fetch group details");
      }
    };

    const fetchChildName = async () => {
      if (!childId || typeof childId !== "string") return;

      try {
        const childRef = doc(db, "members", childId);
        const childSnap = await getDoc(childRef);

        if (childSnap.exists()) {
          const childData = childSnap.data();
          setChildName(childData?.name ?? "Unnamed Child");
          console.log("✅ Child fetched:", childData);
        } else {
          console.log("⚠️ Child not found");
          Alert.alert("Error", "Child not found");
        }
      } catch (err) {
        console.error("❌ Error fetching child details:", err);
        Alert.alert("Error", "Failed to fetch child details");
      }
    };

    fetchGroupDetails();
    fetchChildName();
  }, [classId, childId]);

  const startCheckout = async () => {
    if (!userEmail) {
      Alert.alert("Error", "Please log in first.");
      return;
    }

    if (!priceId || !groupName || !childName) {
      Alert.alert("Error", "Missing required checkout info.");
      return;
    }

    setLoading(true);
    console.log("🧾 Starting checkout...", {
      priceId,
      customerEmail: userEmail,
      childId,
      groupName,
      branch,
    });

    try {
      const createCheckoutSession = httpsCallable(
        functions,
        "createCheckoutSession"
      );
      const result = await createCheckoutSession({
        priceId,
        customerEmail: userEmail,
        successUrl: "https://yourdomain.com/parent/payments/success", // ✅ replace with your deployed domain
        cancelUrl: "https://yourdomain.com/parent/payments/cancel",
        childId,
        groupName,
        branch,
      });

      const { url } = result.data as { url?: string };

      if (url) {
        Linking.openURL(url);
      } else {
        console.error("❌ No checkout URL received");
        Alert.alert("Error", "Failed to get checkout link.");
      }
    } catch (err) {
      console.error("❌ Checkout error:", err);
      Alert.alert("Error", "Checkout session failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout</Text>
      <Text style={styles.subTitle}>You are subscribing to:</Text>
      <Text style={styles.className}>{groupName || "Loading..."}</Text>
      <Text style={styles.subTitle}>Child: {childName || "Loading..."}</Text>

      <Text style={styles.priceLabel}>
        Price: {amount !== null ? `£${amount} / Per Session` : "Loading..."}
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#d60124" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={startCheckout}>
          <Text style={styles.buttonText}>Proceed to Payment</Text>
        </TouchableOpacity>
      )}
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
  className: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginVertical: 10,
  },
  priceLabel: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    color: "#d60124",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#d60124",
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
});
