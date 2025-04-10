import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { db } from "../../../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Screen from "../../../../components/Screen";

export default function GroupResourcesPage() {
  const { groupId } = useLocalSearchParams();
  const router = useRouter();

  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      if (!groupId) return;

      try {
        const resourcesRef = collection(db, "groups", groupId, "resources");
        const resourcesSnap = await getDocs(resourcesRef);

        const resourcesList = resourcesSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setResources(resourcesList);
      } catch (err) {
        console.error("Error fetching resources:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [groupId]);

  const handleAddResource = () => {
    router.push({
      pathname: "/staff/group/resources/add/[groupId]",
      params: { groupId },
    });
  };

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator
          size="large"
          color="#d60124"
          style={{ marginTop: 40 }}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Resources for Group</Text>
      </View>

      <FlatList
        data={resources}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddResource}
          >
            <Text style={styles.addButtonText}>+ Add Resource</Text>
          </TouchableOpacity>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.resourceCard}
            onPress={() =>
              router.push({
                pathname: "/staff/group/resources/view/[resourceId]",
                params: {
                  resourceId: item.id,
                  groupId,
                },
              })
            }
          >
            {item.thumbnail && (
              <Image
                source={{ uri: item.thumbnail }}
                style={styles.thumbnail}
                resizeMode="cover"
              />
            )}
            <Text style={styles.resourceTitle}>{item.name}</Text>
            <Text style={styles.resourceType}>{item.type}</Text>
          </TouchableOpacity>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80, // to give space below last item
  },
  resourceCard: {
    backgroundColor: "#f9f9f9",
    padding: 16,
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
  resourceType: {
    fontSize: 14,
    color: "#999",
  },
  addButton: {
    backgroundColor: "#d60124",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
