import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { db } from "../../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Screen from "../../../components/Screen";
import Title from "../../../components/Title";

type Group = {
  id: string;
  name: string;
  schedule: { day: string; time: string; location: string }[];
};

export default function ChildTimetableScreen() {
  const { childId } = useLocalSearchParams<{ childId: string }>();
  const [loading, setLoading] = useState(true);
  const [childName, setChildName] = useState("");
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!childId) return;

      const childRef = doc(db, "members", childId);
      const childSnap = await getDoc(childRef);
      const childData = childSnap.data();

      if (!childData) return;

      setChildName(childData.name || "Child");

      const groupIds: string[] = childData.groups || [];
      const fetchedGroups: Group[] = [];

      for (const groupId of groupIds) {
        const groupSnap = await getDoc(doc(db, "groups", groupId));
        if (groupSnap.exists()) {
          const group = groupSnap.data();
          fetchedGroups.push({
            id: groupId,
            name: group.name,
            schedule: group.schedule || [],
          });
        }
      }

      setGroups(fetchedGroups);
      setLoading(false);
    };

    fetchData();
  }, [childId]);

  return (
    <Screen>
      <Title>{childName}’s Schedule</Title>

      {loading ? (
        <Text>Loading schedule...</Text>
      ) : groups.length === 0 ? (
        <Text style={styles.empty}>No groups found for this child.</Text>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ marginTop: 12 }}
        >
          {groups.map((group) => (
            <View key={group.id} style={styles.groupCard}>
              <Text style={styles.groupTitle}>🎭 {group.name}</Text>

              {group.schedule.length === 0 ? (
                <Text style={styles.empty}>No schedule available</Text>
              ) : (
                group.schedule.map((slot, idx) => (
                  <View key={idx} style={styles.scheduleRow}>
                    <Text style={styles.scheduleText}>
                      🕓 {slot.day} @ {slot.time}
                    </Text>
                    <Text style={styles.scheduleText}>📍 {slot.location}</Text>
                  </View>
                ))
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  groupCard: {
    backgroundColor: "#f4f4f4",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  scheduleRow: {
    marginBottom: 6,
  },
  scheduleText: {
    fontSize: 14,
    color: "#333",
  },
  empty: {
    marginTop: 16,
    color: "#777",
    fontStyle: "italic",
  },
});
