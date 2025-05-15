import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { db } from "../../../../lib/firebase";
import {
  collection,
  getDocs,
  getDoc,
  updateDoc,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import Screen from "../../../../components/Screen";
import {
  getISOWeek,
  getYear,
  subWeeks,
  format,
  isSameWeek,
  parseISO,
} from "date-fns";

import { useAuth } from "../../../../context/AuthContext";

export default function GroupRegisterPage() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const { userData } = useAuth();
  const router = useRouter();

  const [members, setMembers] = useState<any[]>([]);
  const [presentIds, setPresentIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const membersSnap = await getDocs(collection(db, "members"));
        const groupMembers = membersSnap.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((m) => m.groups?.includes(groupId));

        setMembers(groupMembers);
      } catch (err) {
        console.error("Error fetching members:", err);
        Alert.alert("Error", "Could not load members.");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [groupId]);

  const togglePresent = (memberId: string) => {
    setPresentIds((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSubmit = async () => {
    const now = new Date();
    const currentWeek = `${getYear(now)}-W${String(getISOWeek(now)).padStart(
      2,
      "0"
    )}`;
    const lastWeek = `${getYear(subWeeks(now, 1))}-W${String(
      getISOWeek(subWeeks(now, 1))
    ).padStart(2, "0")}`;

    const dateKey = now.toISOString().split("T")[0]; // e.g. "2024-04-17"

    try {
      // Save the register for the group
      await setDoc(doc(db, "groups", groupId, "registers", dateKey), {
        takenBy: userData?.uid,
        takenAt: serverTimestamp(),
        present: presentIds,
      });

      // Update streak for each present member
      await Promise.all(
        presentIds.map(async (memberId) => {
          const memberRef = doc(db, "members", memberId);
          const memberSnap = await getDoc(memberRef);
          const memberData = memberSnap.data();

          const previousWeek = memberData?.lastAttendanceWeek;
          const currentStreak = memberData?.streak || 0;
          const currentSessions = memberData?.sessionsAttended || 0;

          const newStreak = previousWeek === lastWeek ? currentStreak + 1 : 1;

          await updateDoc(memberRef, {
            lastAttendanceWeek: currentWeek,
            streak: newStreak,
            sessionsAttended: currentSessions + 1,
          });
        })
      );

      Alert.alert(
        "✅ Register Saved",
        "Attendance and streaks have been updated."
      );
      router.back();
    } catch (err) {
      console.error("Error saving register:", err);
      Alert.alert("Error", "Failed to save register.");
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
      <Text style={styles.title}>Take Register</Text>

      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Switch
              value={presentIds.includes(item.id)}
              onValueChange={() => togglePresent(item.id)}
            />
          </View>
        )}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
        <Text style={styles.saveButtonText}>Save Register</Text>
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 10,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#d60124",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
