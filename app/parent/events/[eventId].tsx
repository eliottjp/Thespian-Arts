import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";

export default function EventDetailsPage() {
  const { eventId } = useLocalSearchParams();
  const [eventDetails, setEventDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventId) return;

      try {
        const eventRef = doc(db, "events", eventId);
        const eventDoc = await getDoc(eventRef);

        if (eventDoc.exists()) {
          const eventData = eventDoc.data();

          // Convert Firestore Timestamp to Date string
          const eventDate = eventData?.date?.toDate().toLocaleString();

          setEventDetails({
            ...eventData,
            date: eventDate, // Format the date
          });
        } else {
          Alert.alert("Error", "Event not found");
        }
      } catch (err) {
        console.error("Error fetching event details:", err);
        Alert.alert("Error", "Failed to fetch event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#d60124" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{eventDetails?.name}</Text>
      <Text style={styles.subTitle}>Date: {eventDetails?.date}</Text>
      <Text style={styles.description}>{eventDetails?.description}</Text>
      <Text style={styles.branch}>Location: {eventDetails?.branch}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 18,
    color: "#555",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#444",
    marginBottom: 20,
  },
  branch: {
    fontSize: 16,
    color: "#777",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
