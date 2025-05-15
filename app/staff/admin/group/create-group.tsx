// app/(admin)/groups/create.tsx
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

export default function CreateGroupPage() {
  const [name, setName] = useState("");
  const [branch, setBranch] = useState<string | null>(null);
  const [photoURL, setPhotoURL] = useState("");
  const [price, setPrice] = useState("");
  const [priceId, setPriceId] = useState("");
  const [branches, setBranches] = useState<string[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(true);
  const [schedule, setSchedule] = useState([
    { day: "Monday", time: "18:00", location: "" },
  ]);
  const [openBranchDropdown, setOpenBranchDropdown] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchBranches = async () => {
      const snapshot = await getDocs(collection(db, "groups"));
      const uniqueBranches = Array.from(
        new Set(snapshot.docs.map((doc) => doc.data().branch))
      );
      setBranches(uniqueBranches);
      setLoadingBranches(false);
    };
    fetchBranches();
  }, []);

  const formatId = (text: string) =>
    text.trim().toLowerCase().replace(/\s+/g, "-");

  const handleCreateGroup = async () => {
    if (!name || !branch || !price || !priceId || !photoURL) {
      Alert.alert("Missing info", "Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    const groupId = `${formatId(name)}-${formatId(branch)}`;

    try {
      await setDoc(doc(db, "groups", groupId), {
        name,
        branch,
        photoURL,
        price,
        priceId,
        schedule,
        id: groupId,
      });

      Alert.alert("Success", "Group created successfully.");
      setName("");
      setBranch(null);
      setPhotoURL("");
      setPrice("");
      setPriceId("");
      setSchedule([{ day: "Monday", time: "18:00", location: "" }]);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to create group.");
    }

    setSubmitting(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Group Name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>📍 Branch</Text>
      {loadingBranches ? (
        <ActivityIndicator size="small" color="#d60124" />
      ) : (
        <DropDownPicker
          open={openBranchDropdown}
          value={branch}
          items={branches.map((b) => ({ label: b, value: b }))}
          setOpen={setOpenBranchDropdown}
          setValue={setBranch}
          setItems={() => {}}
          placeholder="Select Branch"
          style={{ marginBottom: 12 }}
          zIndex={1000}
        />
      )}

      <Text style={styles.label}>📷 Group Photo</Text>
      <TouchableOpacity
        style={styles.imagePicker}
        onPress={async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });

          if (!result.canceled) {
            setPhotoURL(result.assets[0].uri);
          }
        }}
      >
        {photoURL ? (
          <Image
            source={{ uri: photoURL }}
            style={{ width: "100%", height: 180, borderRadius: 10 }}
            resizeMode="cover"
          />
        ) : (
          <Text style={{ color: "#888", textAlign: "center" }}>
            Tap to select an image
          </Text>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Price (e.g. 5)"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Stripe Price ID"
        value={priceId}
        onChangeText={setPriceId}
      />

      <Text style={styles.section}>🗓 Schedule</Text>
      {schedule.map((item, i) => (
        <View key={i} style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1, marginRight: 6 }]}
            placeholder="Day"
            value={item.day}
            onChangeText={(val) => {
              const copy = [...schedule];
              copy[i].day = val;
              setSchedule(copy);
            }}
          />
          <TextInput
            style={[styles.input, { flex: 1, marginRight: 6 }]}
            placeholder="Time (e.g. 18:00)"
            value={item.time}
            onChangeText={(val) => {
              const copy = [...schedule];
              copy[i].time = val;
              setSchedule(copy);
            }}
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Location"
            value={item.location}
            onChangeText={(val) => {
              const copy = [...schedule];
              copy[i].location = val;
              setSchedule(copy);
            }}
          />
        </View>
      ))}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() =>
          setSchedule([...schedule, { day: "", time: "", location: "" }])
        }
      >
        <Text style={{ color: "#d60124", fontWeight: "bold" }}>
          + Add Schedule Entry
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleCreateGroup}
        disabled={submitting}
      >
        <Text style={styles.buttonText}>
          {submitting ? "Creating..." : "Create Group"}
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
