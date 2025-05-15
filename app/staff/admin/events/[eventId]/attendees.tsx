import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../../lib/firebase";
import Screen from "../../../../../components/Screen";

export default function EventAttendeesPage() {
  const { eventId } = useLocalSearchParams();
  const [attendees, setAttendees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;

    const fetchAttendees = async () => {
      const snap = await getDocs(
        collection(db, "events", String(eventId), "attendees")
      );
      const data = snap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => a.name.localeCompare(b.name));

      setAttendees(data);
      setLoading(false);
    };

    fetchAttendees();
  }, [eventId]);

  return (
    <Screen>
      <Text style={styles.title}>🎟 Attendees</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#d60124" />
      ) : attendees.length === 0 ? (
        <Text style={styles.empty}>No one has marked attending yet.</Text>
      ) : (
        <FlatList
          data={attendees}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={{
                  uri:
                    item.photoURL && item.photoURL.startsWith("http")
                      ? item.photoURL
                      : "https://via.placeholder.com/50",
                }}
                style={styles.avatar}
              />
              <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.role}>{item.role}</Text>
              </View>
            </View>
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ccc",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  role: {
    fontSize: 13,
    color: "#666",
  },
  empty: {
    color: "#777",
    marginTop: 20,
    textAlign: "center",
  },
});
