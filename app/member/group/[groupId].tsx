import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { db } from "../../../lib/firebase";
import {
  doc,
  collection,
  getDoc,
  getDocs,
  DocumentData,
} from "firebase/firestore";

export default function GroupDetailsPage() {
  const { groupId } = useLocalSearchParams();
  const router = useRouter();

  const [group, setGroup] = useState<any>(null);
  const [resources, setResources] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroupAndResources = async () => {
      if (!groupId || typeof groupId !== "string") return;

      try {
        const groupRef = doc(db, "groups", groupId);
        const groupSnap = await getDoc(groupRef);

        if (groupSnap.exists()) {
          const groupData = groupSnap.data();
          setGroup(groupData);

          const resRef = collection(db, "groups", groupId, "resources");
          const resSnap = await getDocs(resRef);
          const resList = resSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setResources(resList);
        } else {
          setGroup(null);
        }
      } catch (err) {
        console.error("Failed to fetch group or resources", err);
        setGroup(null);
      }

      setLoading(false);
    };

    fetchGroupAndResources();
  }, [groupId]);

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

      {/* Resources */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎓 Resources</Text>

        {resources.length === 0 ? (
          <Text style={styles.emptyText}>No resources uploaded yet.</Text>
        ) : (
          resources.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() =>
                router.push({
                  pathname: "/member/group/resources/view",
                  params: {
                    name: item.name,
                    type: item.type,
                    url: item.url,
                    thumbnail: item.thumbnail || "",
                  },
                })
              }
              style={styles.resourceCard}
            >
              {item.thumbnail && (
                <Image
                  source={{ uri: item.thumbnail }}
                  style={styles.thumbnail}
                  resizeMode="cover"
                />
              )}
              <Text style={styles.resourceTitle}>{item.name}</Text>
              <Text style={styles.resourceMeta}>
                {item.type?.toUpperCase() || "FILE"}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerImage: {
    width: "100%",
    height: 200,
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
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  resourceCard: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  thumbnail: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  resourceMeta: {
    fontSize: 13,
    color: "#999",
    marginTop: 4,
  },
  emptyText: {
    color: "#888",
    fontSize: 14,
    fontStyle: "italic",
  },
});
