import { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";

export default function Index() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      // If not loading and still no userData, redirect to login
      if (!loading) {
        if (!user || !userData) {
          router.replace("/login");
          return;
        }

        // If logged in, redirect to the correct dashboard
        const role = userData.role?.toLowerCase();
        if (role === "parent") router.replace("/parent");
        else if (role === "member") router.replace("/member");
        else if (role === "staff") router.replace("/staff");
        else router.replace("/unknown-role");
      }
    }, 1500); // ⏳ fallback delay

    return () => clearTimeout(timeout);
  }, [user, userData, loading]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#d60124" />
      <Text>Loading...</Text>
    </View>
  );
}
