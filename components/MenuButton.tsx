import { Pressable, StyleSheet, Text, View } from "react-native";
import { ReactNode } from "react";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  icon: ReactNode;
  label: string;
  onPress: () => void;
};

export default function MenuButton({ icon, label, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.8 }]}
    >
      <View style={styles.inner}>
        <View style={styles.icon}>{icon}</View>
        <Text style={styles.label}>{label}</Text>
        <Ionicons name="chevron-forward" size={20} color="#888" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 12,
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});
