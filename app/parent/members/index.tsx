import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  Text,
  View,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Pressable,
  RefreshControl,
} from "react-native";
import { db, auth } from "../../../lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  DocumentData,
} from "firebase/firestore";
import { Image } from "expo-image";
import Screen from "../../../components/Screen";
import Title from "../../../components/Title";
import MyButton from "../../../components/Button";

export default function ParentDashboard() {
  const router = useRouter();
  const [children, setChildren] = useState<DocumentData[]>([]);
  const [groups, setGroups] = useState<Record<string, string>>({}); // Mapping of group IDs to names
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchChildren();
    fetchGroupNames();
  }, []);

  const fetchChildren = async () => {
    if (!auth.currentUser?.uid) return;

    const q = query(
      collection(db, "members"),
      where("role", "==", "member"),
      where("parentUids", "array-contains", auth.currentUser.uid)
    );

    const snap = await getDocs(q);
    const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setChildren(list);
    setLoading(false);
  };

  const fetchGroupNames = async () => {
    const groupQuery = query(collection(db, "groups")); // Query to get all group names
    const groupSnap = await getDocs(groupQuery);
    const groupMap: Record<string, string> = {};

    groupSnap.forEach((doc) => {
      const groupData = doc.data();
      groupMap[doc.id] = groupData.name; // Assuming the group name is stored in the 'name' field
    });

    setGroups(groupMap);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchChildren();
    setRefreshing(false);
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
      {children.length === 0 ? (
        <Text style={{ fontSize: 16 }}>
          You haven’t linked any child accounts yet.
        </Text>
      ) : (
        <FlatList
          data={children}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 30 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => {
            const initials = item.name
              ?.split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase();

            // Convert group IDs to group names
            const groupNames = item.groups?.map((groupId: string) => {
              return groups[groupId] || groupId; // Use the group name or the ID if not found
            });

            return (
              <View style={styles.card}>
                {/* Avatar / Header */}
                <View style={styles.headerRow}>
                  <View style={styles.avatar}>
                    {item.photoURL ? (
                      <Image
                        cachePolicy="memory-disk"
                        source={{ uri: item.photoURL }}
                        style={{ width: 50, height: 50, borderRadius: 25 }}
                      />
                    ) : (
                      <Text style={styles.avatarText}>{initials}</Text>
                    )}
                  </View>
                  <View>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.branch}>📍 {item.branch}</Text>
                    <Text style={styles.groups}>
                      🧑‍🎓 {groupNames?.join(", ") || "No Groups"}
                    </Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonRow}>
                  <Pressable
                    style={styles.action}
                    onPress={() => router.push(`/parent/timetable/${item.id}`)}
                  >
                    <Text style={styles.actionText}>🗓️ Timetable</Text>
                  </Pressable>

                  <Pressable
                    style={styles.action}
                    onPress={() => router.push(`/parent/resources/${item.id}`)}
                  >
                    <Text style={styles.actionText}>📚 Resources</Text>
                  </Pressable>

                  <Pressable
                    style={styles.action}
                    onPress={() =>
                      router.push({
                        pathname: "/parent/edit-child/[childId]",
                        params: { childId: item.id },
                      })
                    }
                  >
                    <Text style={styles.actionText}>✏️ Edit</Text>
                  </Pressable>
                </View>
              </View>
            );
          }}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#d60124",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
  },
  branch: {
    color: "#555",
    fontSize: 14,
    marginTop: 2,
  },
  groups: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
    fontStyle: "italic",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  action: {
    flex: 1,
    backgroundColor: "#f3f3f3",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  actionText: {
    color: "#222",
    fontWeight: "600",
  },
});
