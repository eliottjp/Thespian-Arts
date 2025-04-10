import { useEffect, useState } from "react";
import {
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  StyleSheet,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { useRouter } from "expo-router";
import Screen from "../../../../components/Screen";

export default function GroupsScreen() {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const groupSnap = await getDocs(collection(db, "groups"));
        const groupList = groupSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGroups(groupList);
      } catch (err) {
        console.error("Error fetching groups:", err);
      }
      setLoading(false);
    };

    fetchGroups();
  }, []);

  return (
    <Screen>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#d60124"
          style={{ marginTop: 40 }}
        />
      ) : groups.length === 0 ? (
        <Text style={styles.empty}>No groups available to manage.</Text>
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.flatListContent}
          renderItem={({ item }) => (
            <View style={styles.groupCard}>
              <TouchableOpacity
                onPress={() => router.push(`/staff/admin/group/${item.id}`)} // Navigate to the group editing page
                style={styles.cardContent}
              >
                <Text style={styles.groupName}>{item.name}</Text>
                {item.branch && (
                  <Text style={styles.groupMeta}>{item.branch}</Text>
                )}
              </TouchableOpacity>

              {/* Buttons to Edit and Add Members */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => router.push(`/staff/admin/group/${item.id}`)}
                  style={styles.editButton}
                >
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    router.push(`/staff/admin/group/${item.id}/addMembers`)
                  }
                  style={styles.addButton}
                >
                  <Text style={styles.buttonText}>Add Members</Text>
                </TouchableOpacity>
              </View>
            </View>
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
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Poppins-Regular",
  },
  flatListContent: {
    paddingBottom: 20,
  },
  groupCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  cardContent: {
    marginBottom: 12,
  },
  groupName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
    fontFamily: "Poppins-Bold",
    marginBottom: 6,
  },
  groupMeta: {
    fontSize: 14,
    color: "#777",
    fontFamily: "Poppins-Regular",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  editButton: {
    backgroundColor: "#d60124", // Red branding color
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: "#27AE60", // Green for Add Members
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
});
