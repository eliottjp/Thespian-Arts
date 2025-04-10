import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { db } from "../../../lib/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  increment,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import Screen from "../../../components/Screen";
import Title from "../../../components/Title";
import { useAuth } from "../../../context/AuthContext";
import Dropdown from "react-native-input-select";
import CustomModal from "../../../components/CustomModal";

const pointOptions = [5, 10, 15];
const reasons = [
  "Helping another member",
  "Great attitude",
  "Perfect attendance",
  "Extra effort in class",
  "Kindness shown to others",
];

export default function StaffAwardPointsScreen() {
  const { userData } = useAuth(); // tutor giving the points
  const [members, setMembers] = useState<any[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [selectedPoints, setSelectedPoints] = useState<number>(5);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const openModal = (title: string, message: string) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
  };

  const fetchMembers = async () => {
    const snap = await getDocs(collection(db, "members"));
    const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setMembers(list);
  };

  const handleAward = async () => {
    if (!selectedMemberId || !selectedPoints || !selectedReason) {
      Alert.alert("Please complete all fields.");
      return;
    }

    const getTodayMidnight = () => {
      const now = new Date();
      now.setHours(0, 0, 0, 0); // Midnight today
      return now;
    };

    setLoading(true);
    const memberRef = doc(db, "members", selectedMemberId);
    const pointsLogRef = collection(memberRef, "pointsLog");

    try {
      // STEP 1: Check if this tutor has already rewarded this member today
      const snap = await getDocs(pointsLogRef);
      const today = getTodayMidnight();

      const alreadyAwardedToday = snap.docs.some((doc) => {
        const data = doc.data();
        return (
          data.givenBy === userData?.uid && data.timestamp?.toDate?.() >= today
        );
      });

      if (alreadyAwardedToday) {
        openModal(
          "⛔ Limit Reached",
          "You've already awarded points to this member today."
        );
        setLoading(false);
        return;
      }

      // STEP 2: Award points
      await Promise.all([
        updateDoc(memberRef, {
          points: increment(selectedPoints),
        }),
        addDoc(pointsLogRef, {
          amount: selectedPoints,
          reason: selectedReason,
          givenBy: userData?.uid || "Unknown Tutor",
          timestamp: serverTimestamp(),
        }),
      ]);

      Alert.alert("✅ Points awarded!", "Successfully added points.");
      setSelectedMemberId("");
      setSelectedPoints(5);
      setSelectedReason("");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not award points.");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <Title>🧑‍🏫 Award Points</Title>

        <Text style={styles.label}>Select Member</Text>
        <Dropdown
          placeholder="Choose a member"
          options={members.map((m) => ({ label: m.name, value: m.id }))}
          selectedValue={selectedMemberId}
          onValueChange={(val: string) => setSelectedMemberId(val)}
          primaryColor="#d60124"
        />

        <Text style={styles.label}>Points to Award</Text>
        <View style={styles.pointButtons}>
          {pointOptions.map((val) => (
            <TouchableOpacity
              key={val}
              style={[
                styles.pointButton,
                selectedPoints === val && styles.pointSelected,
              ]}
              onPress={() => setSelectedPoints(val)}
            >
              <Text
                style={[
                  styles.pointText,
                  selectedPoints === val && styles.pointTextSelected,
                ]}
              >
                {val} pts
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Reason</Text>
        <Dropdown
          placeholder="Choose a reason"
          options={reasons.map((r) => ({ label: r, value: r }))}
          selectedValue={selectedReason}
          onValueChange={(val: string) => setSelectedReason(val)}
          primaryColor="#d60124"
        />

        <TouchableOpacity
          style={styles.awardButton}
          onPress={handleAward}
          disabled={loading}
        >
          <Text style={styles.awardButtonText}>
            {loading ? "Awarding..." : "Award Points"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <CustomModal
        visible={modalVisible}
        title={modalTitle}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 8,
  },
  pointButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  pointButton: {
    backgroundColor: "#eee",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    minWidth: 80,
    alignItems: "center",
  },
  pointSelected: {
    backgroundColor: "#d60124",
  },
  pointText: {
    color: "#000",
    fontWeight: "600",
  },
  pointTextSelected: {
    color: "#fff",
  },
  awardButton: {
    backgroundColor: "#d60124",
    padding: 14,
    borderRadius: 12,
    marginTop: 30,
  },
  awardButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
