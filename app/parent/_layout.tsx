import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
// import ParentRightIcons from "../../components/ParentRightIcons"; // Uncomment if needed later

export default function ParentLayout() {
  return (
    <Tabs
      screenOptions={{
        headerTitleAlign: "center",
        headerTintColor: "#d60124",
        tabBarActiveTintColor: "#d60124",
        tabBarLabelStyle: { fontSize: 12 },
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
        name="payments/index"
        options={{
          title: "Payments",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="card-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="members/index"
        options={{
          title: "Members",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat/index"
        options={{
          href: null,
          title: "Contact",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="at-circle-outline" size={size} color={color} />
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
        }}
      />

      {/* 🔒 Hidden from the tab bar */}
      <Tabs.Screen
        name="members/[childId]"
        options={{ href: null, title: "Member Details" }}
      />
      <Tabs.Screen
        name="events"
        options={{ href: null, title: "Upcoming Events" }}
      />
      <Tabs.Screen
        name="events/[eventId]"
        options={{ href: null, title: "Event Details" }}
      />
      <Tabs.Screen
        name="link-child"
        options={{ href: null, title: "Link Child" }}
      />
      <Tabs.Screen
        name="payments/cancel"
        options={{ href: null, title: "Payment Cancelled" }}
      />
      <Tabs.Screen
        name="payments/success"
        options={{ href: null, title: "Payment Success" }}
      />
      <Tabs.Screen
        name="payments/checkout"
        options={{ href: null, title: "Payment Checkout" }}
      />
      <Tabs.Screen
        name="resources/view"
        options={{ href: null, title: "Resource Viewer" }}
      />
      <Tabs.Screen
        name="resources/[childId]"
        options={{ href: null, title: "Resources" }}
      />
      <Tabs.Screen
        name="edit-child/[childId]"
        options={{ href: null, title: "Edit Child Details" }}
      />
      <Tabs.Screen
        name="group/index"
        options={{ href: null, title: "Group" }}
      />
      <Tabs.Screen
        name="group/[groupId]"
        options={{ href: null, title: "Group" }}
      />
      <Tabs.Screen
        name="profile/update"
        options={{ href: null, title: "Update Profile" }}
      />
      <Tabs.Screen
        name="timetable/[childId]"
        options={{ href: null, title: "Timetable" }}
      />
    </Tabs>
  );
}
