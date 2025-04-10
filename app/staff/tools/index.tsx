import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const tools = [
  {
    label: "Send Message",
    icon: <Ionicons name="send" size={26} color="#d60124" />,
    path: "/staff/members",
  },
  {
    label: "Send Notification",
    icon: <Ionicons name="notifications" size={26} color="#d60124" />,
    path: "/staff/registers/select-group",
  },
  {
    label: "Reward Collection",
    icon: <Ionicons name="gift" size={26} color="#d60124" />,
    path: "/staff/reward/collect",
  },
  {
    label: "Record Child Progress",
    icon: <Ionicons name="bar-chart" size={26} color="#d60124" />,
    path: "/staff/reports",
  },
];

export default function StaffToolsPage() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.grid}>
        {tools.map((tool, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => router.push(tool.path)}
          >
            <View style={styles.cardContent}>
              {tool.icon}
              <Text style={styles.label}>{tool.label}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  card: {
    backgroundColor: "#f9f9f9",
    width: "48%",
    aspectRatio: 1,
    borderRadius: 14,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
});
