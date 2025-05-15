import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { db } from "../../../../lib/firebase";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import DropDownPicker from "react-native-dropdown-picker";
import * as ImagePicker from "expo-image-picker";

export default function CreateEventPage() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const formatId = (text: string) =>
    text.trim().toLowerCase().replace(/\s+/g, "-");

  const handleCreateEvent = async () => {
    if (!name || !location || !date) {
      Alert.alert("Missing info", "Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    const eventId = `${formatId(name)}-${formatId(branch)}`;

    try {
      await setDoc(doc(db, "events", eventId), {
        name,
        date,
        location,
        id: eventId,
      });

      Alert.alert("Success", "event created successfully.");
      setName("");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to create event.");
    }

    setSubmitting(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="event Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      ))
      <TouchableOpacity
        style={styles.button}
        onPress={handleCreateEvent}
        disabled={submitting}
      >
        <Text style={styles.buttonText}>
          {submitting ? "Creating..." : "Create event"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: "#fff", flexGrow: 1 },
  input: {
    backgroundColor: "#f1f1f1",
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  label: {
    fontWeight: "600",
    marginBottom: 4,
    marginTop: 10,
  },
  button: {
    backgroundColor: "#d60124",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  row: { flexDirection: "row", marginBottom: 12 },
  addBtn: { marginBottom: 20, alignItems: "center" },
  section: { fontWeight: "bold", marginTop: 20, marginBottom: 6 },
  imagePicker: {
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
});
