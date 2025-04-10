import { useEffect, useState } from "react";
import { Text, FlatList, View, TouchableOpacity, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { db } from "../../../lib/firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  DocumentData,
} from "firebase/firestore";
import Screen from "../../../components/Screen";
import Title from "../../../components/Title";

const ICONS: Record<string, string> = {
  video: "🎥",
  pdf: "📄",
  audio: "🎵",
  image: "🖼️",
};

export default function ChildResourcesScreen() {
  const { childId } = useLocalSearchParams();
  const router = useRouter();

  const [resources, setResources] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [childName, setChildName] = useState("");

  useEffect(() => {
    const fetchResources = async () => {
      if (!childId || typeof childId !== "string") return;

      // 1. Get the child's groups
      const childSnap = await getDoc(doc(db, "members", childId));
      const childData = childSnap.data();
      if (!childData) return;

      setChildName(childData.name || "Child");
      const groupIds = childData.groups || [];

      let allResources: DocumentData[] = [];

      // 2. Loop through each group and fetch its resources
      for (const groupId of groupIds) {
        const groupResRef = collection(db, "groups", groupId, "resources");
        const snap = await getDocs(groupResRef);
        const res = snap.docs.map((doc) => ({
          id: doc.id,
          groupId,
          ...doc.data(),
        }));
        allResources = [...allResources, ...res];
      }

      setResources(allResources);
      setLoading(false);
    };

    fetchResources();
  }, [childId]);

  return (
    <Screen>
      <Title>{childName}'s Resources</Title>

      {loading ? (
        <Text>Loading resources...</Text>
      ) : resources.length === 0 ? (
        <Text>No resources available.</Text>
      ) : (
        <FlatList
          data={resources}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/parent/resources/view",
                  params: {
                    name: item.name,
                    type: item.type,
                    url: item.url,
                    thumbnail: item.thumbnail || "",
                  },
                })
              }
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 14,
                borderRadius: 8,
                marginBottom: 10,
              }}
            >
              {/* Optional thumbnail preview */}
              {item.thumbnail && (
                <Image
                  source={{ uri: item.thumbnail }}
                  style={{
                    width: "100%",
                    height: 160,
                    marginBottom: 8,
                    borderRadius: 6,
                    resizeMode: "cover",
                  }}
                />
              )}

              <Text style={{ fontSize: 16 }}>
                {ICONS[item.type] || "📁"} {item.name}
              </Text>
              <Text style={{ fontSize: 12, color: "#555" }}>
                Group: {item.groupId}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </Screen>
  );
}
