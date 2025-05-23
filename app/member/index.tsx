import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { db } from "../../lib/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import Card from "../../components/Card";
import BadgeSummary from "../../components/BadgeSummary";
import { Image } from "expo-image";
import { useAuth } from "../../context/AuthContext"; // ✅ Import useAuth
import RecentNotifications from "../../components/RecentNotifications";

export default function MemberDashboard() {
  const router = useRouter();
  const { userData } = useAuth(); // ✅ Get userData from context
  const [member, setMember] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    if (!userData?.uid) return;

    try {
      const memberSnap = await getDoc(doc(db, "members", userData.uid));
      const eventsSnap = await getDocs(collection(db, "events"));

      setMember(memberSnap.data());
      setEvents(eventsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("Failed to fetch member dashboard data", err);
    }

    setLoading(false);
    setRefreshing(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAll();
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
              uri: member?.photoURL || "https://via.placeholder.com/80",
            }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.name}>{member?.name || "Member"}</Text>
            <Text style={styles.subtext}>Logged in as Member</Text>
          </View>
        </View>
      </View>

      <Card variant="notification" />

      {/* 📢 Notifications */}
      <RecentNotifications />

      {/* 📅 Upcoming Events */}
      <Card>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>

        {events.length === 0 ? (
          <Text style={{ color: "#888" }}>No events found.</Text>
        ) : (
          events.slice(0, 2).map((event, index) => (
            <View key={index} style={styles.eventRow}>
              <Text style={styles.eventName}>{event.name}</Text>
              <Text style={styles.eventDate}>
                {event.date?.toDate().toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                }) || "TBA"}
              </Text>
            </View>
          ))
        )}
      </Card>

      {/* 📈 Progress */}
      <Card>
        <Text style={styles.sectionTitle}>Your Progress</Text>
        <Text style={styles.progressItem}>
          Lessons Attended: {member?.sessionsAttended || 0}
        </Text>
        <Text style={styles.progressItem}>
          Badges Earned: {member?.badges || 0}
        </Text>
      </Card>

      <BadgeSummary />
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
  badgeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 10,
  },
  badge: {
    backgroundColor: "#fff",
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  badgeIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  badgeLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
    textAlign: "center",
  },
  eventRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },

  eventName: {
    fontSize: 14,
    color: "#333",
    flexShrink: 1,
    fontWeight: "500",
  },

  eventDate: {
    fontSize: 13,
    color: "#999",
    marginLeft: 8,
    textAlign: "right",
  },
});
