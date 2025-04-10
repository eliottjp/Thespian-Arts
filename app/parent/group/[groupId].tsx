import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useAuth } from "../../../context/AuthContext";

export default function GroupDetail() {
  const { groupId } = useLocalSearchParams();
  const { userData } = useAuth();
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const branch = userData?.branches?.[0];
      if (!branch || !groupId) return;

      const ref = collection(
        db,
        "branches",
        branch,
        "groups",
        groupId as string,
        "members"
      );
      const snap = await getDocs(ref);
      const list = snap.docs.map((doc) => doc.data());
      setMembers(list);
    };

    fetchMembers();
  }, [groupId]);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        Group Members
      </Text>
      <FlatList
        data={members}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 12,
              backgroundColor: "#e8e8e8",
              borderRadius: 6,
              marginBottom: 8,
            }}
          >
            <Text style={{ fontSize: 16 }}>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
}
