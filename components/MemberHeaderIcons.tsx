import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type MemberHeaderIconsProps = {
  showBack?: boolean;
  showProfile?: boolean;
  showNotification?: boolean;
  onBackPress?: () => void;
  onProfilePress?: () => void;
  customIcon?: React.ReactNode;
  onCustomPress?: () => void;
};

export default function MemberHeaderIcons({
  showBack = false,
  showProfile = false,
  showNotification = false,
  onBackPress,
  onProfilePress,
  customIcon,
  onCustomPress,
}: MemberHeaderIconsProps) {
  const router = useRouter();

  return (
    <View style={styles.wrapper}>
      {showBack && (
        <TouchableOpacity
          style={styles.icon}
          onPress={onBackPress || (() => router.back())}
        >
          <Ionicons name="chevron-back" size={24} color="#222" />
        </TouchableOpacity>
      )}

      {customIcon && (
        <TouchableOpacity style={styles.icon} onPress={onCustomPress}>
          {customIcon}
        </TouchableOpacity>
      )}
      {showNotification && (
        <TouchableOpacity
          style={styles.icon}
          onPress={
            onProfilePress || (() => router.push("/member/noifications"))
          }
        >
          <Ionicons name="notifications-outline" size={22} color="#222" />
        </TouchableOpacity>
      )}

      {showProfile && (
        <TouchableOpacity
          style={styles.icon}
          onPress={onProfilePress || (() => router.push("/member/profile"))}
        >
          <Ionicons name="person-circle-outline" size={26} color="#222" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16, // adds spacing from the screen edge
    gap: 12, // spacing between icons
  },
  icon: {
    padding: 6,
  },
});
