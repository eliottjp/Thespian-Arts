import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Text,
  TextInput,
  Switch,
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Platform,
  Image,
} from "react-native";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import * as Crypto from "expo-crypto";
import { db, storage } from "../../../lib/firebase";
import Screen from "../../../components/Screen";
import MyButton from "../../../components/Button";
import DateTimePicker from "@react-native-community/datetimepicker";

type Contact = { name: string; number: string };

export default function EditChildScreen() {
  const { childId } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [dob, setDob] = useState<Date | null>(null);
  const [showDobPicker, setShowDobPicker] = useState(false);
  const [dateJoined, setDateJoined] = useState("");
  const [address, setAddress] = useState("");
  const [postCode, setPostCode] = useState("");
  const [email, setEmail] = useState("");
  const [emergencyContacts, setEmergencyContacts] = useState<Contact[]>([]);
  const [medicalInfo, setMedicalInfo] = useState("");
  const [allowPhotos, setAllowPhotos] = useState(false);
  const [photoURL, setPhotoURL] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!childId || typeof childId !== "string") return;
      const docRef = doc(db, "members", childId);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) {
        Alert.alert("Error", "Child not found.");
        return;
      }
      const data = snapshot.data();
      setName(data.name || "");
      setDob(data.dob?.toDate?.() || null);
      setDateJoined(data.dateJoined || "");
      setAddress(data.address || "");
      setPostCode(data.postCode || "");
      setEmail(data.email || "");
      setEmergencyContacts(data.emergencyContacts || []);
      setMedicalInfo(data.medicalInfo || "");
      setAllowPhotos(data.allowPhotos || false);
      setPhotoURL(data.photoURL || null);
      setLoading(false);
    };

    fetchData();
  }, [childId]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });

    if (!result.canceled && result.assets.length > 0) {
      const image = result.assets[0];
      const response = await fetch(image.uri);
      const blob = await response.blob();
      const filename = `profilePhotos/${childId}-${Crypto.randomUUID()}.jpg`;
      const storageRef = ref(storage, filename);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      setPhotoURL(downloadURL);
    }
  };

  const handleSave = async () => {
    if (!childId || typeof childId !== "string") return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "members", childId), {
        name,
        dob: dob ? Timestamp.fromDate(dob) : null,
        dateJoined,
        address,
        postCode,
        email,
        emergencyContacts,
        medicalInfo,
        allowPhotos,
        photoURL,
      });
      Alert.alert("Success", "Details updated.");
      router.back();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator size="large" color="#d60124" />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        style={styles.scrollView}
      >
        <Text style={styles.sectionTitle}>🖼️ Profile Photo</Text>
        {photoURL ? (
          <Image source={{ uri: photoURL }} style={styles.avatar} />
        ) : (
          <Text style={{ marginBottom: 6 }}>No photo uploaded yet.</Text>
        )}
        <MyButton
          label="Upload Profile Photo"
          onPress={pickImage}
          style={{ marginBottom: 20 }}
        />

        <Text style={styles.sectionTitle}>🧒 Full Name</Text>
        <TextInput value={name} onChangeText={setName} style={styles.input} />

        <Text style={styles.sectionTitle}>🎂 Date of Birth</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDobPicker(true)}
        >
          <Text>{dob ? dob.toLocaleDateString() : "Select Date of Birth"}</Text>
        </TouchableOpacity>

        {showDobPicker && (
          <DateTimePicker
            value={dob || new Date(2010, 0, 1)}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDobPicker(Platform.OS === "ios");
              if (selectedDate) setDob(selectedDate);
            }}
          />
        )}

        <Text style={styles.sectionTitle}>📅 Date Joined</Text>
        <TextInput
          value={dateJoined}
          editable={false}
          style={[styles.input, { backgroundColor: "#f2f2f2", color: "#888" }]}
        />

        <Text style={styles.sectionTitle}>🏠 Address</Text>
        <TextInput
          value={address}
          onChangeText={setAddress}
          style={styles.input}
        />

        <Text style={styles.sectionTitle}>📮 Post Code</Text>
        <TextInput
          value={postCode}
          onChangeText={setPostCode}
          style={styles.input}
        />

        <Text style={styles.sectionTitle}>📧 Email (for marketing)</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
        />

        <Text style={styles.sectionTitle}>📞 Emergency Contacts</Text>
        {emergencyContacts.map((contact, index) => (
          <View key={index} style={styles.contactCard}>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TextInput
                placeholder="Name"
                value={contact.name}
                onChangeText={(text) => {
                  const updated = [...emergencyContacts];
                  updated[index].name = text;
                  setEmergencyContacts(updated);
                }}
                style={[styles.input, { flex: 1 }]}
              />
              <TextInput
                placeholder="Phone"
                value={contact.number}
                onChangeText={(text) => {
                  const updated = [...emergencyContacts];
                  updated[index].number = text;
                  setEmergencyContacts(updated);
                }}
                style={[styles.input, { flex: 1 }]}
                keyboardType="phone-pad"
              />
              <Pressable
                onPress={() => {
                  const updated = emergencyContacts.filter(
                    (_, i) => i !== index
                  );
                  setEmergencyContacts(updated);
                }}
                style={styles.removeButton}
              >
                <Text style={styles.removeText}>✕</Text>
              </Pressable>
            </View>
          </View>
        ))}

        <MyButton
          label="➕ Add Emergency Contact"
          onPress={() =>
            setEmergencyContacts([
              ...emergencyContacts,
              { name: "", number: "" },
            ])
          }
          style={{ marginBottom: 20 }}
        />

        <Text style={styles.sectionTitle}>🩺 Medical Info</Text>
        <TextInput
          value={medicalInfo}
          onChangeText={setMedicalInfo}
          multiline
          numberOfLines={3}
          style={[styles.input, { height: 80 }]}
          placeholder="e.g. Allergies, asthma..."
        />

        <View style={styles.switchRow}>
          <Text style={styles.sectionTitle}>📸 Allow Photos</Text>
          <Switch value={allowPhotos} onValueChange={setAllowPhotos} />
        </View>

        <MyButton
          label={saving ? "Saving..." : "Save Changes"}
          onPress={handleSave}
          disabled={saving}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 40,
    paddingTop: 12, // Ensure content starts correctly after header
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  contactCard: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  removeButton: {
    marginLeft: 8,
    backgroundColor: "#eee",
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  removeText: {
    color: "#d60124",
    fontWeight: "700",
    fontSize: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
});
