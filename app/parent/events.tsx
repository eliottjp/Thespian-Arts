import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import Screen from "../../components/Screen";
import Title from "../../components/Title";
import MyButton from "../../components/Button";
import SlideUpModal from "../../components/SlideUpModal";

type EventItem = {
  id: string;
  name: string;
  date: Date;
  location: string;
  notes?: string;
};

export default function EventsScreen() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const snapshot = await getDocs(collection(db, "events"));
      const eventList = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            date: data.date.toDate(),
            location: data.location,
            notes: data.notes,
          };
        })
        .sort((a, b) => a.date.getTime() - b.date.getTime());

      setEvents(eventList);
      setLoading(false);
    };

    fetchEvents();
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Screen>
      <Title>📆 Upcoming Events</Title>

      {loading ? (
        <Text>Loading events...</Text>
      ) : events.length === 0 ? (
        <Text>No events found.</Text>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ marginTop: 16 }}
        >
          {events.map((event) => (
            <View key={event.id} style={styles.card}>
              <Text style={styles.name}>{event.name}</Text>
              <Text style={styles.date}>🕒 {formatDate(event.date)}</Text>
              <Text style={styles.location}>📍 {event.location}</Text>

              <MyButton
                label="View More"
                onPress={() => setSelectedEvent(event)}
                style={{ marginTop: 10 }}
              />
            </View>
          ))}
        </ScrollView>
      )}

      {/* Modal Detail View */}
      <SlideUpModal
        visible={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
      >
        {selectedEvent && (
          <>
            <Text style={styles.modalTitle}>{selectedEvent.name}</Text>
            <Text style={styles.modalDetail}>
              🕒 {formatDate(selectedEvent.date)}
            </Text>
            <Text style={styles.modalDetail}>📍 {selectedEvent.location}</Text>
            {selectedEvent.notes && (
              <Text style={styles.modalNotes}>📝 {selectedEvent.notes}</Text>
            )}

            <Pressable
              style={styles.closeButton}
              onPress={() => setSelectedEvent(null)}
            >
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </>
        )}
      </SlideUpModal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f4f4f4",
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  date: {
    marginTop: 6,
    fontSize: 14,
    color: "#444",
  },
  location: {
    fontSize: 14,
    color: "#444",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  modalDetail: {
    fontSize: 16,
    marginBottom: 6,
  },
  modalNotes: {
    marginTop: 10,
    fontStyle: "italic",
    color: "#555",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#d60124",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  closeText: {
    color: "#fff",
    fontWeight: "600",
  },
});
