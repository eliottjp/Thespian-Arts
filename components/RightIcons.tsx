import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // For navigation

interface RightIconsProps {
  unreadCount: number;
}

const RightIcons: React.FC<RightIconsProps> = ({ unreadCount }) => {
  const router = useRouter(); // Initialize useRouter for navigation

  return (
    <View style={{ flexDirection: "row" }}>
      <TouchableOpacity
        onPress={() => router.push("../member/ComingSoon")} // Navigate to the Coming Soon screen
        style={{ marginRight: 20 }}
      >
        <Ionicons name="notifications-outline" size={24} color="#d60124" />
        {unreadCount > 0 && (
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>{unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/member/profile")}
        style={{ marginRight: 10 }}
      >
        <FontAwesome5 name="user-circle" size={22} color="#d60124" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  notificationBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "red",
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default RightIcons;
