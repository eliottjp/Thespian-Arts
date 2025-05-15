import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../../context/AuthContext";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  getFirestore,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { Image } from "expo-image";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function ManageUsersPage() {
  const { userData } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const db = getFirestore();
  const auth = getAuth();
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const snap = await getDocs(collection(db, "users"));
    const userList = snap.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
    setUsers(userList);
  };

  const promoteToAdmin = async (uid: string, currentStatus: boolean) => {
    const ref = doc(db, "users", uid);
    await updateDoc(ref, { admin: !currentStatus });
    fetchUsers();
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent to " + email);
    } catch (err) {
      alert("Failed to send reset: " + err.message);
    }
  };

  const deleteUser = async (uid: string) => {
    await deleteDoc(doc(db, "users", uid));
    fetchUsers();
  };

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "staff" && u.role === "staff") ||
      (filter == "parents" && u.role === "parent");
    return matchesSearch && matchesFilter;
  });

  return (
    <ScrollView contentContainerStyle={styles.container} ref={scrollRef}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search users..."
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.filterRow}>
        {["all", "staff", "parents"].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.activeFilter]}
            onPress={() => setFilter(f)}
          >
            <Text style={filter === f ? styles.activeText : styles.filterText}>
              {f.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filtered.map((user) => (
        <View key={user.id} style={styles.card}>
          <View style={styles.headerRow}>
            <Image
              source={{
                uri: user.photoURL || "https://via.placeholder.com/40",
              }}
              style={styles.avatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.role}>{user.role}</Text>
              {user.admin && <Text style={styles.adminTag}>Admin</Text>}
            </View>
          </View>

          <View style={styles.btnRow}>
            <TouchableOpacity
              onPress={() => promoteToAdmin(user.id, user.admin)}
            >
              <Text style={styles.btnText}>
                {user.admin ? "Remove Admin" : "Make Admin"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => resetPassword(user.email)}>
              <Text style={[styles.btnText, { color: "#007aff" }]}>
                Reset Password
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => deleteUser(user.id)}>
              <Text style={[styles.btnText, { color: "#d60124" }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 14,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  filterBtn: {
    backgroundColor: "#eee",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  activeFilter: {
    backgroundColor: "#d60124",
  },
  filterText: {
    color: "#444",
    fontSize: 12,
    fontWeight: "500",
  },
  activeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ccc",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  role: {
    fontSize: 13,
    color: "#777",
  },
  adminTag: {
    fontSize: 12,
    color: "#d60124",
    fontWeight: "600",
    marginTop: 2,
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    gap: 10,
  },
  btnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#222",
  },
});
