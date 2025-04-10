import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { useRouter } from "expo-router";
import Screen from "../../../../components/Screen";
import Title from "../../../../components/Title";

export default function ReportsListPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchReports = async () => {
      const snap = await getDocs(collection(db, "reports"));
      const data = await Promise.all(
        snap.docs.map(async (docSnap) => {
          const report = { id: docSnap.id, ...docSnap.data() };

          // Get child name if exists
          let childName = "Unknown";
          if (report.childId) {
            const childDoc = await getDoc(doc(db, "members", report.childId));
            if (childDoc.exists()) {
              childName = childDoc.data().name || "Unnamed";
            }
          }

          return {
            ...report,
            childName,
            formattedDate: report.timestamp?.toDate().toLocaleString() || "N/A",
          };
        })
      );

      setReports(data);
      setLoading(false);
    };

    fetchReports();
  }, []);

  return (
    <Screen>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#d60124"
          style={{ marginTop: 40 }}
        />
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: "/staff/admin/reports/[reportId]",
                  params: { reportId: item.id },
                })
              }
            >
              <Text style={styles.title}>
                {item.type === "accident" ? "🩹 Accident" : "🛡️ Safeguarding"}
              </Text>
              <Text style={styles.meta}>👤 {item.childName}</Text>
              <Text style={styles.meta}>🕒 {item.formattedDate}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  title: {
    fontWeight: "700",
    fontSize: 16,
    color: "#d60124",
    marginBottom: 4,
  },
  meta: {
    fontSize: 13,
    color: "#444",
  },
});
