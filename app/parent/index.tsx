import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { db, auth } from "../../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Card from "../../components/Card";
import { Image } from "expo-image";
import RecentNotifications from "@/components/RecentNotifications";

export default function ParentDashboard() {
  const router = useRouter();
  const [children, setChildren] = useState([]);
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // ✅ new state

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    if (!auth.currentUser?.uid) return;

    const memberSnap = await getDocs(
      query(
        collection(db, "members"),
        where("parentUids", "array-contains", auth.currentUser.uid)
      )
    );

    const eventSnap = await getDocs(collection(db, "events"));
    const userSnap = await getDocs(
      query(collection(db, "users"), where("uid", "==", auth.currentUser.uid))
    );

    setChildren(memberSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    setEvents(eventSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    setUser(userSnap.docs[0]?.data() ?? null);
    setLoading(false);
    setRefreshing(false); // ✅ stop refreshing
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAll(); // ✅ run the same fetchAll logic
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#d60124" />
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.card}>
        <View style={styles.profile}>
          <Image
            cachePolicy="memory-disk"
            source={{
              uri: user?.photoURL || "https://via.placeholder.com/80",
            }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.name}>{user?.name}</Text>
            <Text style={styles.subtext}>Logged in as Parent</Text>
          </View>
        </View>
      </View>

      <Card
        title="Important Notification"
        description="No sessions this week due to holidays."
        variant="notification"
        visible={false}
      />

      {/* 🎠 Linked Children */}
      <Card>
        <Text style={styles.sectionTitle}>My Children</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {children.map((child) => (
            <Pressable
              key={child.id}
              onPress={() => router.push(`/parent/members/${child.id}`)}
              style={styles.childCard}
            >
              <Image
                source={{
                  uri: child.photoURL || "https://via.placeholder.com/60",
                }}
                style={styles.childAvatar}
              />
              <Text style={styles.childName}>{child.name}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </Card>

      {/* 💳 Payment Status */}
      <Card>
        <Text style={styles.sectionTitle}>Payment Status</Text>
        <Text style={styles.subtext}>Your last payment was successful ✅</Text>
      </Card>

      {/* 📢 Notifications */}
      <RecentNotifications />

      {/* 📈 Progress */}
      <Card>
        <Text style={styles.sectionTitle}>Progress</Text>
        <Text style={styles.progressItem}>Lessons Completed: 8/10</Text>
        <Text style={styles.progressItem}>Badges Earned: 3</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#ccc",
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
  },
  subtext: {
    fontSize: 14,
    color: "#777",
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  childCard: {
    width: 80,
    marginRight: 14,
    alignItems: "center",
  },
  childAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 4,
  },
  childName: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  notification: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  progressItem: {
    fontSize: 14,
    color: "#444",
    marginBottom: 4,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
