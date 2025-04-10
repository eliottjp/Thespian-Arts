import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import * as Crypto from "expo-crypto";
import { MultiSelect } from "react-native-element-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";

// Utils
const generateCode = () =>
  Math.random().toString(36).substring(2, 8).toUpperCase();

const generateUID = async () => {
  const randomBytes = Math.random().toString() + Date.now();
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    randomBytes
  );
};

const generateUsername = (name: string) => {
  const parts = name.trim().toLowerCase().split(" ");
  return `${parts[0]}.${parts[1]?.charAt(0) || ""}`.replace(/[^a-z]/g, "");
};

export default function CreateMember() {
  const [name, setName] = useState("");
  const [branches, setBranches] = useState<string[]>([]);
  const [branchOptions, setBranchOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [loadingBranches, setLoadingBranches] = useState(true);

  const [dob, setDob] = useState<Date | null>(null);
  const [showDOBPicker, setShowDOBPicker] = useState(false);
  const [startDate] = useState(new Date());
  const [medicalInfo, setMedicalInfo] = useState("");
  const [emergencyContacts, setEmergencyContacts] = useState([
    { name: "", number: "" },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [setupLink, setSetupLink] = useState("");

  useEffect(() => {
    const fetchBranchesFromGroups = async () => {
      try {
        const groupSnap = await getDocs(collection(db, "groups"));
        const allBranches = groupSnap.docs
          .map((doc) => doc.data().branch)
          .filter(Boolean);
        const uniqueBranches = Array.from(new Set(allBranches));
        const branchLabels = uniqueBranches.map((branch) => ({
          label: branch,
          value: branch,
        }));
        setBranchOptions(branchLabels);
      } catch (error) {
        console.error("Failed to fetch branches", error);
      } finally {
        setLoadingBranches(false);
      }
    };

    fetchBranchesFromGroups();
  }, []);

  const ensureUniqueSetupCode = async (): Promise<string> => {
    let code = generateCode();
    let exists = true;
    while (exists) {
      const q = query(
        collection(db, "members"),
        where("setupCode", "==", code)
      );
      const snap = await getDocs(q);
      if (snap.empty) exists = false;
      else code = generateCode();
    }
    return code;
  };

  const ensureUniqueUsername = async (base: string): Promise<string> => {
    let username = base;
    let exists = true;
    let count = 1;
    while (exists) {
      const q = query(
        collection(db, "members"),
        where("username", "==", username)
      );
      const snap = await getDocs(q);
      if (snap.empty) exists = false;
      else {
        username = `${base}${count}`;
        count++;
      }
    }
    return username;
  };

  const handleAddMember = async () => {
    if (!name || !dob || branches.length === 0) {
      Alert.alert("Missing info", "Please fill in all required fields.");
      return;
    }

    setSubmitting(true);

    const uid = await generateUID();
    const setupCode = await ensureUniqueSetupCode();
    const usernameBase = generateUsername(name);
    const username = await ensureUniqueUsername(usernameBase);
    const linkCode = generateCode();

    try {
      await addDoc(collection(db, "members"), {
        name,
        branch: branches, // store as array
        dateOfBirth: dob ? Timestamp.fromDate(dob) : null,
        startDate: Timestamp.fromDate(startDate),
        allowPhotos: true,
        emergencyContacts: emergencyContacts.filter((c) => c.name && c.number),
        groups: [],
        linkCode,
        medicalInfo,
        password: null,
        photoURL: "",
        role: "member",
        setupCode,
        username,
        uid,
      });

      const link = `/setup?code=${setupCode}`;
      setSetupLink(link);
      Alert.alert(
        "Member Created",
        `Username: ${username}\nSetup link created.`
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not create member.");
    }

    setSubmitting(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Member</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>📍 Branches</Text>
      {loadingBranches ? (
        <ActivityIndicator size="small" color="#d60124" />
      ) : (
        <MultiSelect
          data={branchOptions}
          labelField="label"
          valueField="value"
          placeholder="Select Branches"
          value={branches}
          onChange={(items) => setBranches(items)}
          style={styles.input}
          selectedTextStyle={{ fontSize: 14 }}
        />
      )}

      <Text style={styles.label}>🎂 Date of Birth</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowDOBPicker(true)}
      >
        <Text>{dob ? dob.toLocaleDateString() : "Select Date of Birth"}</Text>
      </TouchableOpacity>

      {showDOBPicker && (
        <DateTimePicker
          value={dob || new Date(2010, 0, 1)}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDOBPicker(false);
            if (selectedDate) setDob(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>➕ Medical Info</Text>
      <TextInput
        style={styles.input}
        placeholder="Medical Info"
        value={medicalInfo}
        onChangeText={setMedicalInfo}
      />

      <Text style={styles.section}>Emergency Contacts:</Text>
      {emergencyContacts.map((c, i) => (
        <View key={i} style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1, marginRight: 6 }]}
            placeholder="Name"
            value={c.name}
            onChangeText={(text) => {
              const updated = [...emergencyContacts];
              updated[i].name = text;
              setEmergencyContacts(updated);
            }}
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Number"
            keyboardType="phone-pad"
            value={c.number}
            onChangeText={(text) => {
              const updated = [...emergencyContacts];
              updated[i].number = text;
              setEmergencyContacts(updated);
            }}
          />
        </View>
      ))}

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() =>
          setEmergencyContacts([...emergencyContacts, { name: "", number: "" }])
        }
      >
        <Text style={{ color: "#d60124", fontWeight: "bold" }}>
          + Add Contact
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleAddMember}
        disabled={submitting}
      >
        <Text style={styles.buttonText}>
          {submitting ? "Creating..." : "Create Member"}
        </Text>
      </TouchableOpacity>

      {setupLink ? (
        <Text style={styles.link}>Setup Link: {setupLink}</Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: "#fff", flexGrow: 1 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },
  label: {
    fontWeight: "600",
    marginBottom: 4,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#f1f1f1",
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 12,
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
  link: {
    marginTop: 16,
    textAlign: "center",
    color: "#444",
    fontSize: 14,
    fontStyle: "italic",
  },
});
