import { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function Index() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const setup = async () => {
      // Request notification permissions
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.warn("Notification permissions not granted");
      }

      const timeout = setTimeout(() => {
        if (!loading) {
          if (!user || !userData) {
            router.replace("/login");
            return;
          }

          const role = userData.role?.toLowerCase();
          if (role === "parent") router.replace("/parent");
          else if (role === "member") router.replace("/member");
          else if (role === "staff") router.replace("/staff");
          else router.replace("/unknown-role");
        }
      }, 1500);

      return () => clearTimeout(timeout);
    };

    setup();
  }, [user, userData, loading]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#d60124" />
      <Text>Loading...</Text>
    </View>
  );
}
