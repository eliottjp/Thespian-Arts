// app/_layout.tsx
import { useEffect } from "react";
import { Slot, Stack } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import RoleRouter from "../components/RoleRouter";
import { View, ActivityIndicator, Platform } from "react-native";
import Toast from "react-native-toast-message";
import { AdminProvider } from "../context/AdminModeContext";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppContent />
      <Toast />
    </AuthProvider>
  );
}

function AppContent() {
  const { loading, userData } = useAuth();

  // 🔔 Global announcement listener
  useEffect(() => {
    if (!userData?.role) return;

    const q = query(
      collection(db, "announcements"),
      orderBy("startTime", "desc")
    );

    const unsub = onSnapshot(q, async (snap) => {
      const now = new Date();

      const items = snap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter(
          (a) =>
            a.audience?.includes(userData.role) &&
            a.startTime?.toDate?.() <= now
        );

      const latest = items[0];
      const lastSeen = await AsyncStorage.getItem("lastSeenAnnouncement");

      if (latest?.id && latest.id !== lastSeen) {
        console.log("📢 New announcement detected:", latest.title);

        if (Platform.OS === "web") {
          // 👉 Web fallback toast
          Toast.show({
            type: "info",
            text1: "📢 New Announcement",
            text2: latest.title,
          });
        } else {
          // 👉 Native local notification
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "📢 New Announcement",
              body: latest.title,
            },
            trigger: null,
          });
        }

        await AsyncStorage.setItem("lastSeenAnnouncement", latest.id);
      }
    });

    return () => unsub();
  }, [userData?.role]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#d60124" />
      </View>
    );
  }

  return (
    <RoleRouter>
      <AdminProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Slot />
        </Stack>
      </AdminProvider>
    </RoleRouter>
  );
}
