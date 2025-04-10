import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
} from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import { useAuth } from "../../../context/AuthContext";
import CustomModal from "../../../components/CustomModal";
import MyButton from "../../../components/Button";
import Card from "../../../components/Card";
import MenuButton from "../../../components/MenuButton";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image } from "expo-image";

export default function ProfileScreen() {
  const { user, userData, logout } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [refreshing, setRefreshing] = useState(false); // ✅ new state
  const router = useRouter();

  const openModal = (title: string, message: string) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
  };

  const handleSignOut = async () => {
    await logout(); // ✅ ensures proper flow
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAll(); // ✅ run the same fetchAll logic
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* 👤 User Profile */}
      <View style={[styles.card, { marginBottom: 24 }]}>
        <View style={styles.profileRow}>
          <View style={styles.profile}>
            <Image
              cachePolicy="memory-disk"
              source={{
                uri: userData?.photoURL || "https://via.placeholder.com/100",
              }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.name}>{userData?.name || "Name"}</Text>
              <Text style={styles.subtext}>
                Logged in as{" "}
                {userData?.role
                  ? userData.role.charAt(0).toUpperCase() +
                    userData.role.slice(1)
                  : ""}
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() => router.push("/parent/profile/update")}
            style={styles.editIcon}
          >
            <Ionicons name="create-outline" size={20} color="#d60124" />
          </Pressable>
        </View>
      </View>

      {/* 📧 Info Card */}
      <Card style={{ marginBottom: 24 }}>
        <Text style={styles.label}>📧 Email</Text>
        <Text style={styles.value}>{user?.email || "Not available"}</Text>

        <Text style={{ marginTop: 12 }}>🆔 UID</Text>
        <Text style={styles.value}>{user?.uid || "Unknown"}</Text>
      </Card>

      {/* 👶 Add Child */}
      <View style={{ marginBottom: 24 }}>
        <Text style={styles.sectionHeading}>Add A Child</Text>
        <MenuButton
          icon={
            <Ionicons name="person-add-outline" size={20} color="#d60124" />
          }
          label="Link Your Child"
          onPress={() => {
            router.push("/parent/link-child");
          }}
        />
      </View>

      {/* 🛠 Support & Info */}
      <View style={{ marginBottom: 24 }}>
        <Text style={styles.sectionHeading}>Support & Info</Text>

        <MenuButton
          icon={
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={20}
              color="#d60124"
            />
          }
          label="Contact Support"
          onPress={() =>
            openModal(
              "Contact Support",
              "Email us at \n\nsupport@thepian-arts.co.uk"
            )
          }
        />

        <MenuButton
          icon={
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#d60124"
            />
          }
          label="App Info"
          onPress={() =>
            openModal(
              "App Info",
              "Version 1.0.0\nBuilt with ❤️\nBy Eliott @ EJP Designs"
            )
          }
        />

        <MenuButton
          icon={<Ionicons name="construct-outline" size={20} color="#d60124" />}
          label="More"
          onPress={() =>
            openModal("Coming Soon", "More features are on the way!")
          }
        />
      </View>

      {/* 🚪 Sign Out */}
      <View style={{ marginBottom: 32 }}>
        <MyButton label="Sign Out" onPress={handleSignOut} />
      </View>

      {/* 📌 Credits */}
      <Text style={styles.credits}>
        © 2025 Thespian Arts App · Built By Eliott Pike
      </Text>

      {/* 🧊 Modal */}
      <CustomModal
        visible={modalVisible}
        title={modalTitle}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 48,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  editIcon: {
    padding: 8,
    borderRadius: 20,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#ccc",
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
  },
  subtext: {
    fontSize: 14,
    color: "#777",
    marginTop: 2,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  credits: {
    textAlign: "center",
    fontSize: 12,
    color: "#888",
    marginTop: 8,
    marginBottom: 12,
  },
});
