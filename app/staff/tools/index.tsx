import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../context/AuthContext";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const tools = [
  {
    label: "Send Message",
    icon: <Ionicons name="send" size={26} color="#d60124" />,
    path: "/staff/members",
    disabled: true,
  },
  {
    label: "Reward Collection",
    icon: <Ionicons name="gift" size={26} color="#d60124" />,
    path: "/staff/reward/collect",
  },
  {
    label: "Award Points",
    icon: <Ionicons name="cash" size={26} color="#d60124" />,
    path: "/staff/reward/award-points",
  },
  {
    label: "Award Badges",
    icon: <Ionicons name="shield" size={26} color="#d60124" />,
    path: "/staff/reward/award-points",
    disabled: true,
  },
];

const adminTools = [
  {
    label: "Manage Reports",
    icon: <Ionicons name="document" size={26} color="#d60124" />,
    path: "/staff/admin/reports",
  },
  {
    label: "Send Announcements",
    icon: <Ionicons name="megaphone" size={26} color="#d60124" />,
    path: "/staff/admin/notifications",
  },
];

const adminToolGroups = [
  {
    label: "Event Tools",
    icon: <Ionicons name="calendar" size={26} color="#d60124" />,
    tools: [
      {
        label: "Add Events",
        path: "/staff/admin/events",
        icon: <Ionicons name="add-circle" size={26} color="#d60124" />,
      },
      {
        label: "View / Edit Events",
        path: "/staff/admin/events",
        icon: <Ionicons name="settings" size={22} color="#d60124" />,
      },
    ],
  },
  {
    label: "Group Management",
    icon: <Ionicons name="people" size={26} color="#d60124" />,
    tools: [
      {
        label: "New Group",
        path: "/staff/admin/group/create-group",
        icon: <Ionicons name="add-circle" size={26} color="#d60124" />,
        disabled: false,
      },
      {
        label: "Edit Groups",
        path: "/staff/admin/group",
        icon: <Ionicons name="settings" size={22} color="#d60124" />,
      },
    ],
  },
  {
    label: "User Management",
    icon: <Ionicons name="person" size={26} color="#d60124" />,
    tools: [
      {
        label: "Manage Users",
        path: "/staff/admin/users",
        icon: <Ionicons name="people" size={22} color="#d60124" />,
      },
      {
        label: "Add Member",
        path: "/staff/admin/users/create-member",
        icon: <Ionicons name="person-add" size={22} color="#d60124" />,
      },
      {
        label: "Member Reg Form",
        path: "/staff/admin/user/create-reg-form",
        icon: <Ionicons name="create" size={22} color="#d60124" />,
      },
    ],
  },
  {
    label: "Shop / Reward Management",
    icon: <Ionicons name="gift" size={26} color="#d60124" />,
    tools: [
      {
        label: "Manage Rewards",
        path: "/staff/admin/rewards/manageRewards",
        icon: <Ionicons name="gift" size={22} color="#d60124" />,
      },
      {
        label: "Manage Items",
        path: "/staff/admin/rewards/manageItems",
        icon: <Ionicons name="cart" size={22} color="#d60124" />,
      },
      {
        label: "Set Member Points",
        path: "/staff/admin/announcements",
        icon: <Ionicons name="cash" size={22} color="#d60124" />,
      },
    ],
  },
];

export default function StaffToolsPage() {
  const router = useRouter();
  const { userData } = useAuth();
  const isAdmin = userData?.admin === true;
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  const toggleGroup = (label: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenGroup((prev) => (prev === label ? null : label));
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  const handlePress = (tool: any) => {
    if (tool.disabled) {
      Alert.alert("Coming Soon", "This feature isn't available yet.");
    } else if (tool.path) {
      router.push(tool.path);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} ref={scrollRef}>
      <Text style={styles.staffToolsHeader}>Staff Tools</Text>
      <View style={styles.grid}>
        {tools.map((tool, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, tool.disabled && styles.disabled]}
            onPress={() => handlePress(tool)}
            disabled={tool.disabled}
          >
            <View style={styles.cardContent}>
              <View style={{ opacity: tool.disabled ? 0.4 : 1 }}>
                {tool.icon}
              </View>
              <Text style={styles.label}>{tool.label}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {isAdmin && (
        <>
          <Text style={styles.sectionTitle}>Admin Tools</Text>
          <View style={styles.grid}>
            {[
              ...adminTools,
              ...adminToolGroups.flatMap((group) => [
                {
                  label: group.label,
                  icon: (
                    <View style={styles.cardIconContainer}>{group.icon}</View>
                  ),
                  isGroup: true,
                },
                ...(openGroup === group.label
                  ? group.tools.map((tool) => ({ ...tool, sub: true }))
                  : []),
              ]),
            ].map((tool, index) => (
              <TouchableOpacity
                key={`admin-tool-${index}`}
                style={[
                  styles.card,
                  tool.sub && styles.subCard,
                  tool.isGroup && styles.groupCard,
                  tool.isGroup &&
                    openGroup === tool.label &&
                    styles.groupCardOpen,
                  tool.disabled && styles.disabled,
                ]}
                onPress={() => {
                  if (tool.isGroup) {
                    toggleGroup(tool.label);
                  } else {
                    handlePress(tool);
                  }
                }}
                disabled={tool.disabled}
              >
                <View style={styles.cardContent}>
                  <View style={{ opacity: tool.disabled ? 0.4 : 1 }}>
                    {tool.icon}
                  </View>
                  <Text style={styles.label}>{tool.label}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
  },
  staffToolsHeader: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 24,
    paddingHorizontal: 4,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  card: {
    backgroundColor: "#fff",
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
  subCard: {
    backgroundColor: "#f0f0f0",
  },
  groupCard: {
    borderWidth: 1,
    borderColor: "#d60124",
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
  cardIconContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
  },
  groupCardOpen: {
    backgroundColor: "#fff4f4", // light red tint
    borderColor: "#b8001b", // deeper red for contrast
    borderWidth: 2,
  },
  disabled: {
    opacity: 0.6,
  },
});
