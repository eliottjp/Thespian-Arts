import { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, Text } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "expo-router";
import Screen from "../../../components/Screen";
import Title from "../../../components/Title";

export default function GroupsScreen() {
  const { userData } = useAuth();
  const [groups, setGroups] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchGroups = async () => {
      const branch = userData?.branches?.[0];
      if (!branch) return;

      const ref = collection(db, "branches", branch, "groups");
      const snap = await getDocs(ref);
      const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setGroups(list);
    };

    fetchGroups();
  }, [userData]);

  return (
    <Screen>
      <Title>Your Groups</Title>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/group/${item.id}`)}
            style={{
              backgroundColor: "#f0f0f0",
              padding: 14,
              borderRadius: 8,
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 16 }}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </Screen>
  );
}
