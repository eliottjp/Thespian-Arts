import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import MemberHeaderIcons from "../../components/MemberHeaderIcons";

// import ParentRightIcons from "../../components/ParentRightIcons"; // Uncomment if needed later

export default function MemberLayout() {
  return (
    <Tabs
      screenOptions={{
        headerTitleAlign: "center",
        headerTintColor: "#d60124",
        tabBarActiveTintColor: "#d60124",
        tabBarLabelStyle: { fontSize: 12 },
        headerRight: () => (
          <MemberHeaderIcons
            showProfile
            showNotification
            onCustomPress={() => console.log("Notifications tapped")}
          />
        ),

        // headerRight: () => <ParentRightIcons />, // Optional
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="group/index"
        options={{
          title: "Your Groups",
          tabBarLabel: "Groups",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="events/index"
        options={{
          title: "Events",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="rewards/index"
        options={{
          title: "Rewards",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="gift-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
          headerRight: () => (
            <MemberHeaderIcons
              showProfile={false}
              customIcon={
                <Ionicons name="notifications-outline" size={22} color="#222" />
              }
              onCustomPress={() => console.log("Notifications tapped")}
            />
          ),
        }}
      />

      {/* 🔒 Hidden from the tab bar */}
      <Tabs.Screen
        name="profile/update"
        options={{ href: null, title: "Update Profile" }}
      />
      <Tabs.Screen
        name="group/[groupId]"
        options={{ href: null, title: "Group Details" }}
      />
      <Tabs.Screen
        name="group/resources/view"
        options={{ href: null, title: "Group Details" }}
      />
      <Tabs.Screen
        name="rewards/detail"
        options={{ href: null, title: "Redeem Reward" }}
      />
      <Tabs.Screen
        name="profile/connections"
        options={{ href: null, title: "Redeem Reward" }}
      />
      <Tabs.Screen
        name="profile/link"
        options={{ href: null, title: "Redeem Reward" }}
      />
    </Tabs>
  );
}
