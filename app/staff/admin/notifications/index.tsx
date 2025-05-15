import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  Pressable,
} from "react-native";
import { db } from "../../../../lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  Timestamp,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import DateTimePicker from "@react-native-community/datetimepicker";

const roles = ["staff", "parents", "member"];

export default function AnnouncementManager() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [audience, setAudience] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  );
  const [existing, setExisting] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const announcementsRef = collection(db, "announcements");

  const fetchAnnouncements = async () => {
    const snap = await getDocs(announcementsRef);
    const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setExisting(data);
  };

  const toggleAudience = (role: string) => {
    setAudience((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const hasOverlap = () => {
    return existing.some((a) => {
      if (editingId && a.id === editingId) return false; // skip if editing this one
      const overlap =
        a.audience?.some((r: string) => audience.includes(r)) &&
        !(endDate < a.startTime.toDate() || startDate > a.endTime.toDate());
      return overlap;
    });
  };

  const handleCreateOrUpdate = async () => {
    if (!title || !description || audience.length === 0) {
      return Alert.alert("Missing Info", "Please fill out all fields.");
    }

    if (hasOverlap()) {
      return Alert.alert("Conflict", "There's an overlapping announcement.");
    }

    if (editingId) {
      const ref = doc(db, "announcements", editingId);
      await updateDoc(ref, {
        title,
        description,
        audience,
        startTime: Timestamp.fromDate(startDate),
        endTime: Timestamp.fromDate(endDate),
      });
      Alert.alert("Updated", "Announcement updated successfully.");
    } else {
      await addDoc(announcementsRef, {
        title,
        description,
        audience,
        startTime: Timestamp.fromDate(startDate),
        endTime: Timestamp.fromDate(endDate),
        createdBy: "admin",
      });
      Alert.alert("Success", "Announcement scheduled!");
    }

    resetForm();
    fetchAnnouncements();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setAudience([]);
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    Alert.alert("Delete", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteDoc(doc(db, "announcements", id));
          fetchAnnouncements();
        },
      },
    ]);
  };

  const handleEdit = (a: any) => {
    setTitle(a.title);
    setDescription(a.description);
    setAudience(a.audience);
    setStartDate(a.startTime.toDate());
    setEndDate(a.endTime.toDate());
    setEditingId(a.id);
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.subheader}>👥 Audience</Text>
      <View style={styles.row}>
        {roles.map((role) => (
          <Pressable
            key={role}
            style={[styles.tag, audience.includes(role) && styles.tagActive]}
            onPress={() => toggleAudience(role)}
          >
            <Text style={{ color: audience.includes(role) ? "#fff" : "#333" }}>
              {role}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.subheader}>🕓 Start Time</Text>
      <DateTimePicker
        value={startDate}
        mode="datetime"
        display="default"
        onChange={(_, date) => date && setStartDate(date)}
      />

      <Text style={styles.subheader}>📅 End Time</Text>
      <DateTimePicker
        value={endDate}
        mode="datetime"
        display="default"
        onChange={(_, date) => date && setEndDate(date)}
      />

      <View style={{ marginTop: 20 }}>
        <Button
          title={editingId ? "Update Announcement" : "Schedule Announcement"}
          onPress={handleCreateOrUpdate}
        />
      </View>

      <Text style={styles.subheader}>📋 Existing Announcements</Text>
      {existing.map((a) => (
        <View key={a.id} style={styles.card}>
          <Text style={styles.cardTitle}>{a.title}</Text>
          <Text style={styles.cardText}>{a.description}</Text>
          <Text style={styles.cardText}>
            {a.audience.join(", ")} | {a.startTime.toDate().toLocaleString()} -{" "}
            {a.endTime.toDate().toLocaleString()}
          </Text>

          <View style={styles.row}>
            <Pressable style={styles.button} onPress={() => handleEdit(a)}>
              <Text style={styles.buttonText}>Edit</Text>
            </Pressable>
            <Pressable
              style={[styles.button, { backgroundColor: "#e53935" }]}
              onPress={() => handleDelete(a.id)}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 16,
    paddingBottom: 100,
  },
  header: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },
  subheader: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    backgroundColor: "#f2f2f2",
  },
  tagActive: {
    backgroundColor: "#d60124",
    borderColor: "#d60124",
  },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  cardTitle: {
    fontWeight: "700",
    fontSize: 16,
  },
  cardText: {
    fontSize: 13,
    color: "#444",
    marginTop: 4,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#d60124",
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
