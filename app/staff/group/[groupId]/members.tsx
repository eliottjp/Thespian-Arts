import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import Screen from "../../../../components/Screen";
import { Image } from "expo-image";

export default function GroupMembersPage() {
  const { groupId } = useLocalSearchParams();
  const router = useRouter();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!groupId) return;

    const fetchMembers = async () => {
      const q = query(
        collection(db, "members"),
        where("groups", "array-contains", groupId)
      );
      const snap = await getDocs(q);
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMembers(data);
      setLoading(false);
    };

    fetchMembers();
  }, [groupId]);

  return (
    <Screen>
      {loading ? (
        <ActivityIndicator size="large" color="#d60124" />
      ) : members.length === 0 ? (
        <Text style={styles.empty}>No members found in this group.</Text>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          {members.map((member) => (
            <TouchableOpacity
              key={member.id}
              style={styles.card}
              onPress={() => router.push(`/staff/search/${member.id}`)}
            >
              <Image
                source={{
                  uri: member.photoURL || "https://via.placeholder.com/50",
                }}
                style={styles.avatar}
              />
              <View>
                <Text style={styles.name}>{member.name}</Text>
                <Text style={styles.info}>Branch: {member.branch}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ccc",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  info: {
    fontSize: 13,
    color: "#666",
  },
  empty: {
    color: "#777",
    marginTop: 20,
    textAlign: "center",
  },
});
