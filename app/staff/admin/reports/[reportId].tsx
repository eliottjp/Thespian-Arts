import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import Screen from "../../../../components/Screen";
import Title from "../../../../components/Title";

export default function ReportDetailsPage() {
  const { reportId } = useLocalSearchParams();
  const router = useRouter();

  const [report, setReport] = useState<any>(null);
  const [childName, setChildName] = useState("Unknown");
  const [reportedByName, setReportedByName] = useState("");
  const [secondedByName, setSecondedByName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      if (!reportId || typeof reportId !== "string") return;

      const snap = await getDoc(doc(db, "reports", reportId));
      if (!snap.exists()) return;

      const data = snap.data();
      setReport(data);

      if (data.childId) {
        const childSnap = await getDoc(doc(db, "members", data.childId));
        if (childSnap.exists()) {
          setChildName(childSnap.data().name || "Unnamed");
        }
      }

      // Fetch reportedBy name
      if (data.reportedBy) {
        const staffSnap = await getDoc(doc(db, "users", data.reportedBy));
        if (staffSnap.exists()) {
          setReportedByName(staffSnap.data().name || data.reportedBy);
        }
      }

      // Fetch secondedBy name
      if (data.secondedBy) {
        const staffSnap = await getDoc(doc(db, "users", data.secondedBy));
        if (staffSnap.exists()) {
          setSecondedByName(staffSnap.data().name || data.secondedBy);
        }
      }

      setLoading(false);
    };

    fetchReport();
  }, [reportId]);

  const formatField = (label: string, value?: string | null) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || "—"}</Text>
    </View>
  );

  const formatLinkedField = (label: string, value: string, uid: string) => (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/staff/profile/[staffId]",
          params: { staffId: uid },
        })
      }
      style={styles.row}
    >
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, styles.link]}>{value}</Text>
    </Pressable>
  );

  if (loading || !report) {
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
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Title>
          {report.type === "accident"
            ? "🩹 Accident Report"
            : "🛡️ Safeguarding Report"}
        </Title>

        <Pressable
          onPress={() =>
            router.push({
              pathname: "/staff/search/[childId]",
              params: { childId: report.childId },
            })
          }
          style={styles.row}
        >
          <Text style={styles.label}>👤 Child</Text>
          <Text style={[styles.value, styles.link]}>{childName}</Text>
        </Pressable>

        {formatField(
          "🕒 Submitted",
          report.timestamp?.toDate().toLocaleString()
        )}

        {formatLinkedField(
          "📝 Submitted By",
          reportedByName,
          report.reportedBy
        )}
        {formatLinkedField("✍️ Seconded By", secondedByName, report.secondedBy)}

        {report.type === "accident" ? (
          <>
            {formatField("⏰ Time of Accident", report.time)}
            {formatField("📘 Project", report.project)}
            {formatField("💥 Injury Type", report.injuryType)}
            {formatField("📍 Location", report.location)}
            {formatField("📄 What Happened", report.how)}
            {formatField("✅ Action Taken", report.actionTaken)}
            {formatField("💬 Additional Comments", report.comments)}
          </>
        ) : (
          <>
            {formatField("🚨 Concern", report.concern)}
            {formatField("👤 Reported To", report.reportedTo)}
            {formatField("📝 Additional Notes", report.additionalNotes)}
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    marginBottom: 12,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  label: {
    fontSize: 13,
    color: "#888",
    marginBottom: 4,
    fontWeight: "600",
  },
  value: {
    fontSize: 15,
    color: "#222",
  },
  link: {
    color: "#d60124",
    fontWeight: "600",
  },
});
``;
