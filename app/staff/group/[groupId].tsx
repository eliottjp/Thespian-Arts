import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { db } from "../../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function GroupDetailsPage() {
  const { groupId } = useLocalSearchParams(); // Get groupId from URL parameters
  const router = useRouter();

  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      if (!groupId) return; // Ensure groupId exists before fetching data

      try {
        const groupRef = doc(db, "groups", groupId);
        const groupSnap = await getDoc(groupRef);
        if (groupSnap.exists()) {
          setGroup(groupSnap.data());
        } else {
          setGroup(null); // Group not found
        }
      } catch (err) {
        console.error("Error fetching group details:", err);
        setGroup(null); // If error occurs, set group to null
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  const handleViewResources = () => {
    router.push(`/staff/group/resources/${groupId}`); // Navigate to resources page
  };

  const handleAddResources = () => {
    router.push(`/staff/group/resources/add/${groupId}`); // Navigate to add resources page
  };

  const handleTakeRegister = () => {
    router.push({
      pathname: "/staff/group/[groupId]/register",
      params: { groupId },
    });
    // Navigate to take register page
  };

  const handleViewGroupMembers = () => {
    router.push(`/staff/group/${groupId}/members`); // Navigate to view group members page
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#d60124" />
      </View>
    );
  }

  if (!group) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: "#888" }}>Group not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {/* Header Image */}
      <Image
        source={{
          uri:
            group?.photoURL ||
            "https://images.unsplash.com/photo-1606761568499-6b54fe711b5a?auto=format&fit=crop&w=800&q=60",
        }}
        style={styles.headerImage}
        resizeMode="cover"
      />

      {/* Group Info */}
      <View style={styles.headerContent}>
        <Text style={styles.groupName}>{group.name}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>📍 {group.branch || "TBA"}</Text>
          <Text style={styles.infoText}>🕒 {group.times || "TBA"}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleViewResources}
        >
          <Text style={styles.actionButtonText}>View Resources</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleAddResources}
        >
          <Text style={styles.actionButtonText}>Add Resources</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleTakeRegister}
        >
          <Text style={styles.actionButtonText}>Take Register</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleViewGroupMembers}
        >
          <Text style={styles.actionButtonText}>View Group Members</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: "#ccc",
  },
  headerContent: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  groupName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  infoText: {
    fontSize: 15,
    color: "#666",
  },
  actionContainer: {
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: "#d60124", // Red button for actions
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
