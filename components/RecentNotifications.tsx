import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";

export default function RecentNotifications() {
  const { role } = useAuth();
  const [recentAnnouncements, setRecentAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    if (!role) return;

    const q = query(
      collection(db, "announcements"),
      orderBy("startTime", "desc"),
      limit(10)
    );

    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((a) => a.audience?.includes(role));

      setRecentAnnouncements(items.slice(0, 3));
    });

    return () => unsub();
  }, [role]);

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Notifications</Text>

      {recentAnnouncements.length === 0 ? (
        <Text style={styles.empty}>No recent announcements.</Text>
      ) : (
        recentAnnouncements.map((note) => (
          <View key={note.id} style={styles.item}>
            <Text style={styles.title} numberOfLines={1}>
              {note.title}
            </Text>
            <Text style={styles.date}>
              {note.startTime.toDate().toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              })}
            </Text>
          </View>
        ))
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  date: {
    fontSize: 13,
    color: "#999",
    marginLeft: 10,
  },
  empty: {
    fontSize: 14,
    color: "#888",
    fontStyle: "italic",
  },
});
