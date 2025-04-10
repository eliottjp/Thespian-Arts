import { useEffect, useState } from "react";
import {
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  StyleSheet,
} from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "expo-router";
import Screen from "../../../components/Screen";
import Title from "../../../components/Title";

export default function GroupsScreen() {
  const { userData } = useAuth();
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchGroups = async () => {
      const groupIds = userData?.groups;

      if (!groupIds || groupIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const results = await Promise.all(
          groupIds.map(async (id) => {
            const ref = doc(db, "groups", id);
            const snap = await getDoc(ref);
            return snap.exists() ? { id: snap.id, ...snap.data() } : null;
          })
        );

        setGroups(results.filter((g) => g !== null));
      } catch (err) {
        console.error("Error fetching groups:", err);
      }

      setLoading(false);
    };

    fetchGroups();
  }, [userData]);

  return (
    <Screen>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#d60124"
          style={{ marginTop: 40 }}
        />
      ) : groups.length === 0 ? (
        <Text style={styles.empty}>You’re not currently in any groups.</Text>
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 12 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`member/group/${item.id}`)}
              style={styles.groupCard}
            >
              <View style={styles.cardContent}>
                <Text style={styles.groupName}>{item.name}</Text>
                {item.branch && (
                  <Text style={styles.groupMeta}>{item.branch}</Text>
                )}
                {item.days && (
                  <Text style={styles.groupMeta}>🗓 {item.days}</Text>
                )}
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  empty: {
    marginTop: 24,
    color: "#888",
    fontSize: 15,
    textAlign: "center",
  },
  groupCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardContent: {
    gap: 6,
  },
  groupName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111",
  },
  groupMeta: {
    fontSize: 14,
    color: "#888",
  },
});
