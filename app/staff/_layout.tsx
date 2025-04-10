import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import StaffHeaderIcons from "../../components/StaffHeaderIcons";

export default function StaffLayout() {
  return (
    <Tabs
      screenOptions={{
        headerTitleAlign: "center",
        headerTintColor: "#d60124",
        tabBarActiveTintColor: "#d60124",
        tabBarLabelStyle: { fontSize: 12 },
        headerRight: () => (
          <StaffHeaderIcons
            showProfile
            showNotification
            onCustomPress={() => console.log("Notifications tapped")}
          />
        ),
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
          title: "Groups",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="search/index"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="tools/index"
        options={{
          title: "Tools",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="hammer-outline" size={size} color={color} />
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
            <StaffHeaderIcons
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
        options={{ href: null, title: "Resource Viewer" }}
      />
      <Tabs.Screen
        name="reward/award-points"
        options={{ href: null, title: "Award Points" }}
      />
      <Tabs.Screen
        name="reward/collect"
        options={{ href: null, title: "Reward Collect" }}
      />
      <Tabs.Screen
        name="search/[childId]"
        options={{ href: null, title: "Member Details" }}
      />
      <Tabs.Screen
        name="create-member"
        options={{ href: null, title: "Create Member" }}
      />
      <Tabs.Screen
        name="reports/index"
        options={{ href: null, title: "Create Report" }}
      />
      <Tabs.Screen
        name="reports/AccidentReportForm"
        options={{ href: null, title: "Accident Report Form" }}
      />
      <Tabs.Screen
        name="reports/SafeguardingForm"
        options={{ href: null, title: "Safeguarding Form" }}
      />
      <Tabs.Screen
        name="group/resources/add/[groupId]"
        options={{ href: null, title: "Add Resources" }}
      />
      <Tabs.Screen
        name="group/resources/view/[resourceId]"
        options={{ href: null, title: "Add Resources" }}
      />
      <Tabs.Screen
        name="group/[groupId]/register"
        options={{ href: null, title: "Register Form" }}
      />
      <Tabs.Screen
        name="group/resources/[groupId]"
        options={{ href: null, title: "Register Form" }}
      />

      {/* Admins Pages */}

      <Tabs.Screen
        name="admin/reports/index"
        options={{ href: null, title: "Reports List" }}
      />
      <Tabs.Screen
        name="admin/reports/[reportId]"
        options={{ href: null, title: "Report" }}
      />
      <Tabs.Screen
        name="admin/users/index"
        options={{ href: null, title: "Users" }}
      />
      <Tabs.Screen
        name="admin/users/create-member"
        options={{ href: null, title: "Create Member" }}
      />
      <Tabs.Screen
        name="admin/group/index"
        options={{ href: null, title: "Manage Groups" }}
      />
      <Tabs.Screen
        name="admin/group/[groupId]"
        options={{ href: null, title: "Manage Groups" }}
      />
      <Tabs.Screen
        name="admin/group/[groupId]/addMembers"
        options={{ href: null, title: "Manage Groups" }}
      />
    </Tabs>
  );
}
