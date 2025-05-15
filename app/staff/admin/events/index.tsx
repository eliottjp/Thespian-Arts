import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { useRouter } from "expo-router";
import Screen from "../../../../components/Screen";
import Card from "../../../../components/Card";
import MyButton from "../../../../components/Button";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      const snap = await getDocs(collection(db, "events"));
      const eventList = snap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => a.date.toDate().getTime() - b.date.toDate().getTime());
      setEvents(eventList);
      setLoading(false);
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator size="large" color="#d60124" />
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.pageTitle}>All Events</Text>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {events.map((event) => (
          <Pressable
            key={event.id}
            onPress={() => router.push(`/staff/admin/events/${event.id}`)}
          >
            <Card style={styles.card}>
              <Text style={styles.title}>{event.name}</Text>
              <Text style={styles.date}>
                {event.date.toDate().toLocaleString()}
              </Text>

              <View style={styles.buttonRow}>
                <MyButton
                  label="Edit"
                  small
                  onPress={() =>
                    router.push(`/staff/admin/events/${event.id}/edit`)
                  }
                />
                <MyButton
                  label="View Attendees"
                  small
                  onPress={() =>
                    router.push(`/staff/admin/events/${event.id}/attendees`)
                  }
                />
              </View>
            </Card>
          </Pressable>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pageTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
});
