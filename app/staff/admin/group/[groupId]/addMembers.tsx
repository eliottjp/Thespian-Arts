import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
  Keyboard,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { db } from "../../../../../lib/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

export default function AddMembersPage() {
  const { groupId } = useLocalSearchParams();
  const router = useRouter();

  const [members, setMembers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Search function with case-insensitive filtering
  const handleSearch = async () => {
    if (!groupId || typeof groupId !== "string") return;
    Keyboard.dismiss();
    setLoading(true);

    // If the searchQuery is empty, fetch all members
    if (searchQuery.trim() === "") {
      setLoading(false);
      setMembers([]);
      return;
    }

    const searchLower = searchQuery.toLowerCase();

    try {
      const membersRef = collection(db, "members");
      const snap = await getDocs(membersRef);
      const membersList = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Filter the list of members for case-insensitive comparison
      const filteredMembers = membersList.filter((member) =>
        member.name.toLowerCase().includes(searchLower)
      );

      setMembers(filteredMembers);
    } catch (error) {
      console.error("Error fetching members:", error);
      Alert.alert("Error", "Could not fetch members.");
    } finally {
      setLoading(false);
    }
  };

  // Handle adding or removing members from the group
  const handleAddOrRemove = async (memberId: string, isInGroup: boolean) => {
    if (!groupId || typeof groupId !== "string") return;

    try {
      const memberRef = doc(db, "members", memberId);
      await updateDoc(memberRef, {
        groups: isInGroup ? arrayRemove(groupId) : arrayUnion(groupId),
      });
      handleSearch(); // Refresh the member list
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Group Members</Text>

      <TextInput
        style={styles.input}
        placeholder="Search for a member..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />

      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>🔍 Search</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#d60124"
          style={{ marginTop: 30 }}
        />
      ) : (
        <FlatList
          data={members}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 30 }}
          renderItem={({ item }) => {
            const isInGroup = item.groups?.includes(groupId);
            return (
              <View style={styles.memberCard}>
                <View style={styles.memberInfo}>
                  <Image
                    source={{
                      uri:
                        item.photoURL ||
                        "https://cdn-icons-png.flaticon.com/512/847/847969.png",
                    }}
                    style={styles.avatar}
                  />
                  <View>
                    <Text style={styles.memberName}>{item.name}</Text>
                    <Text style={styles.memberSub}>
                      {isInGroup ? "Already in this group" : "Not in group"}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: isInGroup ? "#999" : "#d60124" },
                  ]}
                  onPress={() => handleAddOrRemove(item.id, isInGroup)}
                >
                  <Text style={styles.actionButtonText}>
                    {isInGroup ? "Remove" : "Add"}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#f1f1f1",
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  searchButton: {
    backgroundColor: "#d60124",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  memberCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  memberInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#eee",
    marginRight: 10,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  memberSub: {
    fontSize: 13,
    color: "#999",
    marginTop: 2,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
