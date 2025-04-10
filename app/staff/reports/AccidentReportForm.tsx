import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../lib/firebase";
import MyButton from "../../../components/Button";
import { Dropdown } from "react-native-element-dropdown";
import { useAuth } from "../../../context/AuthContext";

type Props = {
  childId: string;
};

export default function AccidentReportForm({ childId }: Props) {
  const { user } = useAuth();
  const [time, setTime] = useState("");
  const [project, setProject] = useState("");
  const [injuryType, setInjuryType] = useState("");
  const [location, setLocation] = useState("");
  const [how, setHow] = useState("");
  const [actionTaken, setActionTaken] = useState("");
  const [comments, setComments] = useState("");
  const [secondedBy, setSecondedBy] = useState("");

  const [staffList, setStaffList] = useState([]);
  const [groupOptions, setGroupOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [loadingGroups, setLoadingGroups] = useState(true);

  const INJURY_TYPES = [
    "Burn",
    "Bruising",
    "Graze",
    "Cut",
    "Fracture",
    "Sprain",
    "Other",
  ];

  useEffect(() => {
    const fetchGroups = async () => {
      if (!childId) return;

      try {
        const memberSnap = await getDoc(doc(db, "members", childId));
        if (!memberSnap.exists()) return;

        const memberData = memberSnap.data();
        const memberGroups: string[] = memberData.groups || [];

        const groupSnap = await getDocs(collection(db, "groups"));
        const groupMap: { [id: string]: string } = {};
        groupSnap.forEach((g) => {
          groupMap[g.id] = g.data().name;
        });

        const groupLabels = memberGroups.map((groupId) => ({
          label: groupMap[groupId] || groupId,
          value: groupId,
        }));

        setGroupOptions(groupLabels);
      } catch (err) {
        console.error("Failed to load groups", err);
      } finally {
        setLoadingGroups(false);
      }
    };

    fetchGroups();
  }, [childId]);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const q = query(collection(db, "users"), where("role", "==", "staff"));
        const snap = await getDocs(q);
        const results = snap.docs.map((doc) => ({
          label: doc.data().name,
          value: doc.id,
        }));
        setStaffList(results);
      } catch (err) {
        console.error("Error fetching staff:", err);
      }
    };

    fetchStaff();
  }, []);

  const handleSubmit = async () => {
    if (!time || !project || !injuryType || !location || !how || !actionTaken) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    try {
      await addDoc(collection(db, "reports"), {
        type: "accident",
        childId,
        time,
        project,
        injuryType,
        location,
        how,
        actionTaken,
        comments,
        reportedBy: user?.uid || "unknown",
        secondedBy,
        timestamp: serverTimestamp(),
      });

      Alert.alert("Success", "Accident report submitted.");
      setTime("");
      setProject("");
      setInjuryType("");
      setLocation("");
      setHow("");
      setActionTaken("");
      setComments("");
      setSecondedBy("");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={styles.label}>⏰ Time of Accident</Text>
      <TextInput
        placeholder="e.g. 14:30"
        style={styles.input}
        value={time}
        onChangeText={setTime}
      />

      <Text style={styles.label}>🧑‍🤝‍🧑 Which Project?</Text>
      <Dropdown
        data={groupOptions}
        labelField="label"
        valueField="value"
        placeholder={loadingGroups ? "Loading..." : "Select Group"}
        value={project}
        onChange={(item) => setProject(item.value)}
        style={styles.input}
      />

      <Text style={styles.label}>💥 Type of Injury</Text>
      <Dropdown
        data={INJURY_TYPES.map((type) => ({ label: type, value: type }))}
        labelField="label"
        valueField="value"
        placeholder="Select type"
        value={injuryType}
        onChange={(item) => setInjuryType(item.value)}
        style={styles.input}
      />

      <Text style={styles.label}>📍 Where did it happen?</Text>
      <TextInput
        placeholder="Location"
        style={styles.input}
        value={location}
        onChangeText={setLocation}
      />

      <Text style={styles.label}>📝 How did it happen?</Text>
      <TextInput
        placeholder="Describe the incident"
        style={styles.input}
        value={how}
        onChangeText={setHow}
        multiline
      />

      <Text style={styles.label}>✅ Action Taken</Text>
      <TextInput
        placeholder="e.g. Ice pack applied"
        style={styles.input}
        value={actionTaken}
        onChangeText={setActionTaken}
        multiline
      />

      <Text style={styles.label}>💬 Additional Comments</Text>
      <TextInput
        placeholder="Optional"
        style={styles.input}
        value={comments}
        onChangeText={setComments}
        multiline
      />

      <Text style={styles.label}>✍️ Report Seconded By</Text>
      <Dropdown
        style={styles.input}
        data={staffList}
        search
        searchPlaceholder="Search staff..."
        labelField="label"
        valueField="value"
        placeholder="Select a staff member"
        value={secondedBy}
        onChange={(item) => setSecondedBy(item.value)}
      />

      <MyButton label="Submit Accident Report" onPress={handleSubmit} />
      <View style={{ height: 150 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  label: {
    fontWeight: "600",
    marginBottom: 6,
  },
});
