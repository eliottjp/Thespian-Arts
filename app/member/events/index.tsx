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
import { db } from "../../../lib/firebase";
import Screen from "../../../components/Screen";
import MyButton from "../../../components/Button";
import SlideUpModal from "../../../components/SlideUpModal";
import Card from "../../../components/Card";
import AddToCalendarButton from "../../../components/AddToCalendarButton";
import AttendingButton from "../../../components/AttendingButton";

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
        <Text style={styles.noEvents}>No events found.</Text>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 10, paddingBottom: 40 }}
        >
          {events.map((event) => (
            <Card key={event.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.name}>{event.name}</Text>
                <AddToCalendarButton
                  title={event.name}
                  startDate={event.date}
                  endDate={new Date(event.date.getTime() + 60 * 60 * 1000)}
                  location={event.location}
                  notes={event.notes}
                />
              </View>

              <Text style={styles.detail}>🕒 {formatDate(event.date)}</Text>
              <Text style={styles.detail}>📍 {event.location}</Text>

              <MyButton
                label="View More"
                onPress={() => setSelectedEvent(event)}
                style={styles.viewButton}
              />
            </Card>
          ))}
        </ScrollView>
      )}

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

            <AddToCalendarButton
              title={selectedEvent.name}
              startDate={selectedEvent.date}
              endDate={new Date(selectedEvent.date.getTime() + 60 * 60 * 1000)}
              location={selectedEvent.location}
              notes={selectedEvent.notes}
            />

            {/* ✅ I'm Attending button */}
            <AttendingButton
              eventId={selectedEvent.id}
              eventName={selectedEvent.name}
            />

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
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
    flexShrink: 1,
  },
  detail: {
    fontSize: 14,
    color: "#444",
    marginBottom: 2,
  },
  noEvents: {
    marginTop: 24,
    color: "#888",
    textAlign: "center",
  },
  viewButton: {
    marginTop: 12,
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
