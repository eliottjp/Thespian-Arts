import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useAuth } from "../../../context/AuthContext";
import { db } from "../../../lib/firebase";
import {
  doc,
  updateDoc,
  increment,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import Title from "../../../components/Title";
import Screen from "../../../components/Screen";
import BadgeSummary from "../../../components/BadgeSummary";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";

const storeItems = [
  { id: "1", name: "Water Bottle", cost: 50, emoji: "🥤" },
  { id: "2", name: "T-Shirt", cost: 100, emoji: "👕" },
  { id: "3", name: "Sticker Pack", cost: 20, emoji: "📦" },
];

export default function RewardsPage() {
  const { userData } = useAuth();
  const router = useRouter();

  const [points, setPoints] = useState<number>(0);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const memberRef = userData?.uid ? doc(db, "members", userData.uid) : null;

  const redeem = async (item: any) => {
    if (points < item.cost) {
      Toast.show({
        type: "error",
        text1: "Not enough points",
        text2: `You need ${item.cost} points to redeem this.`,
      });
      return;
    }

    try {
      const rewardsRef = collection(db, "members", userData.uid, "rewards");
      const generateCode = () =>
        Math.floor(1000 + Math.random() * 9000).toString();

      await Promise.all([
        updateDoc(memberRef!, { points: increment(-item.cost) }),
        addDoc(rewardsRef, {
          item: item.name,
          cost: item.cost,
          emoji: item.emoji,
          timestamp: serverTimestamp(),
          collected: false,
          redeemCode: generateCode(),
        }),
      ]);

      Toast.show({
        type: "success",
        text1: "🎉 Reward redeemed!",
        text2: `${item.name} for ${item.cost} points`,
      });
    } catch (err) {
      console.error("Redemption failed", err);
      Toast.show({
        type: "error",
        text1: "Redemption failed",
        text2: "Please try again later.",
      });
    }
  };

  useEffect(() => {
    if (!userData?.uid) return;

    setLoading(true);

    // Listen to live updates for points
    const unsubPoints = onSnapshot(doc(db, "members", userData.uid), (snap) => {
      const data = snap.data();
      setPoints(data?.points || 0);
    });

    const rewardsRef = collection(db, "members", userData.uid, "rewards");
    const q = query(rewardsRef, orderBy("timestamp", "desc"));
    const unsubHistory = onSnapshot(q, (snap) => {
      const items = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHistory(items);
      setLoading(false);
    });

    return () => {
      unsubPoints();
      unsubHistory();
    };
  }, [userData?.uid]);

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator size="large" color="#d60124" />
      </Screen>
    );
  }

  return (
    <>
      <Screen>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <BadgeSummary />

          <Text style={styles.sectionTitle}>Available Items</Text>
          <View style={styles.storeList}>
            {storeItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.storeItem,
                  points < item.cost && { opacity: 0.4 },
                ]}
                disabled={points < item.cost}
                onPress={() => redeem(item)}
              >
                <Text style={styles.itemEmoji}>{item.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemCost}>{item.cost} points</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle2}>Redeemed History</Text>

          {history.length === 0 ? (
            <Text style={styles.emptyText}>No items redeemed yet.</Text>
          ) : (
            history.map((entry) => (
              <TouchableOpacity
                key={entry.id}
                disabled={entry.collected}
                onPress={() =>
                  router.push({
                    pathname: "member/rewards/redeem",
                    params: {
                      rewardId: entry.id,
                      rewardData: JSON.stringify({
                        ...entry,
                        memberId: userData.uid,
                      }),
                    },
                  })
                }
              >
                <View
                  style={[
                    styles.historyCard,
                    entry.collected && {
                      backgroundColor: "#e5e5e5",
                      opacity: 0.6,
                    },
                  ]}
                >
                  <Text style={styles.historyEmoji}>
                    {entry.collected ? "📦" : "✅"}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.historyText}>
                      {entry.item} - {entry.cost} pts
                    </Text>
                    <Text style={styles.historyDate}>
                      {entry.timestamp?.toDate
                        ? entry.timestamp.toDate().toLocaleDateString()
                        : "Just now"}
                    </Text>
                    {entry.collected && (
                      <Text style={styles.collectedLabel}>Collected</Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </Screen>

      <Toast />
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 12,
  },
  sectionTitle2: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 12,
  },
  storeList: {
    gap: 12,
  },
  storeItem: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    marginBottom: 12,
    gap: 12,
  },
  itemEmoji: {
    fontSize: 34,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
  },
  itemCost: {
    fontSize: 13,
    color: "#888",
  },
  historyCard: {
    backgroundColor: "#f9f9f9",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    gap: 10,
  },
  historyEmoji: {
    fontSize: 22,
  },
  historyText: {
    fontSize: 15,
    fontWeight: "500",
  },
  historyDate: {
    fontSize: 13,
    color: "#666",
  },
  emptyText: {
    fontSize: 14,
    color: "#777",
    marginBottom: 20,
  },
  collectedLabel: {
    fontSize: 12,
    color: "#444",
    fontStyle: "italic",
    marginTop: 4,
  },
});
