// components/QuickActionsBar.tsx
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  onAwardPoints: () => void;
  onMessage: () => void;
  onReport: () => void;
};

export default function QuickActionsBar({
  onAwardPoints,
  onMessage,
  onReport,
}: Props) {
  return (
    <View style={styles.container}>
      <Pressable onPress={onAwardPoints} style={styles.action}>
        <Ionicons name="medal-outline" size={24} color="#d60124" />
        <Text style={styles.label}>Award Points</Text>
      </Pressable>

      <Pressable onPress={onReport} style={styles.action}>
        <Ionicons name="document-text-outline" size={24} color="#d60124" />
        <Text style={styles.label}>Report Form</Text>
      </Pressable>

      <Pressable onPress={onMessage} style={styles.action}>
        <Ionicons
          name="chatbubble-ellipses-outline"
          size={24}
          color="#d60124"
        />
        <Text style={styles.label}>Message</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    gap: 10,
  },
  action: {
    flex: 1, // ensures equal width
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  label: {
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
    textAlign: "center", // centers multiline text
    flexWrap: "wrap",
  },
});
