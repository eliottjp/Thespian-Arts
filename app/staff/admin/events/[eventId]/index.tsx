import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../../lib/firebase";
import Screen from "../../../../../components/Screen";
import MyButton from "../../../../../components/Button";

export default function EventDetailAdminPage() {
  const { eventId } = useLocalSearchParams();
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      const ref = doc(db, "events", String(eventId));
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setEvent({ id: snap.id, ...snap.data() });
      }
      setLoading(false);
    };

    fetchEvent();
  }, [eventId]);

  return (
    <Screen>
      {loading ? (
        <ActivityIndicator size="large" color="#d60124" />
      ) : !event ? (
        <Text style={styles.empty}>Event not found.</Text>
      ) : (
        <>
          <Text style={styles.title}>{event.name}</Text>
          <Text style={styles.detail}>📍 {event.location}</Text>
          <Text style={styles.detail}>
            🕒 {event.date?.toDate?.().toLocaleString() || "Unknown date"}
          </Text>
          {event.notes && <Text style={styles.notes}>📝 {event.notes}</Text>}

          <MyButton
            label="View Attendees"
            onPress={() =>
              router.push(`/staff/admin/events/${event.id}/attendees`)
            }
            style={{ marginTop: 20 }}
          />
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
  },
  detail: {
    fontSize: 16,
    marginBottom: 6,
    color: "#444",
  },
  notes: {
    marginTop: 12,
    fontSize: 15,
    color: "#555",
    fontStyle: "italic",
  },
  empty: {
    color: "#888",
    textAlign: "center",
    marginTop: 40,
  },
});
