import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import Screen from "../../../components/Screen";
import Title from "../../../components/Title";
import MyButton from "../../../components/Button";
import SlideUpModal from "../../../components/SlideUpModal";
import Card from "../../../components/Card"; // ✅ import your custom Card

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
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#d60124"
          style={{ marginTop: 40 }}
        />
      ) : events.length === 0 ? (
        <Text style={{ marginTop: 24, color: "#888", textAlign: "center" }}>
          No events found.
        </Text>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 10, paddingBottom: 40 }}
        >
          {events.map((event) => (
            <Card key={event.id} style={{ marginBottom: 16 }}>
              <Text style={styles.name}>{event.name}</Text>
              <Text style={styles.date}>🕒 {formatDate(event.date)}</Text>
              <Text style={styles.location}>📍 {event.location}</Text>

              <MyButton
                label="View More"
                onPress={() => setSelectedEvent(event)}
                style={{ marginTop: 12 }}
              />
            </Card>
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
