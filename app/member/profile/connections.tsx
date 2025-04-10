import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useAuth } from "../../../context/AuthContext";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import Title from "../../../components/Title";
import Screen from "../../../components/Screen";

export default function MemberConnectionsPage() {
  const { userData } = useAuth();
  const router = useRouter();
  const [parents, setParents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userData?.uid) return;

    const memberRef = doc(db, "members", userData.uid);

    const unsubscribe = onSnapshot(memberRef, async (snap) => {
      const data = snap.data();
      const parentUids = data?.parentUids || [];

      if (parentUids.length === 0) {
        setParents([]);
        setLoading(false);
        return;
      }

      const parentDocs = await Promise.all(
        parentUids.map(async (uid: string) => {
          const snap = await getDoc(doc(db, "users", uid));
          return snap.exists() ? { id: uid, ...snap.data() } : null;
        })
      );

      setParents(parentDocs.filter(Boolean));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userData?.uid]);

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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Title>👨‍👩‍👧 Your Connections</Title>

        {parents.length === 0 ? (
          <Text style={styles.text}>No parents linked yet.</Text>
        ) : (
          parents.map((parent, index) => (
            <View key={index} style={styles.card}>
              <Image
                source={{
                  uri: parent.photoURL || "https://via.placeholder.com/100",
                }}
                style={styles.avatar}
                cachePolicy="memory-disk"
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{parent.name}</Text>
                <Text style={styles.role}>👤 Parent</Text>
              </View>
            </View>
          ))
        )}

        {/* Show "Link Another" button if only one parent is linked */}
        {parents.length === 1 && (
          <TouchableOpacity
            onPress={() => router.push("/member/profile/link")}
            style={styles.linkButton}
          >
            <Text style={styles.linkText}>🔗 Link Another Parent</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#ccc",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  role: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  text: {
    fontSize: 14,
    color: "#666",
    marginTop: 16,
  },
  linkButton: {
    marginTop: 20,
    backgroundColor: "#d60124",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  linkText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
