import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../../lib/firebase";
import Card from "../../../components/Card";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import { Ionicons } from "@expo/vector-icons";
import BadgeSummary from "../../../components/BadgeSummary";
import QuickActionsBar from "../../../components/QuickActionsBar";

// ✅ Helper to calculate age from Timestamp
const calculateAge = (dob: Timestamp) => {
  const birthDate = dob.toDate();
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export default function MemberProfilePage() {
  const { childId } = useLocalSearchParams();
  const [member, setMember] = useState<any>(null);
  const [groupNames, setGroupNames] = useState<string[]>([]);
  const [parents, setParents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (childId && typeof childId === "string") {
      fetchMember(childId);
    }
  }, [childId]);

  const fetchMember = async (id: string) => {
    try {
      const snap = await getDoc(doc(db, "members", id));
      if (!snap.exists()) return;

      const data = snap.data();
      setMember(data);

      // Fetch group names
      const groupSnap = await getDocs(collection(db, "groups"));
      const map: Record<string, string> = {};
      groupSnap.forEach((doc) => {
        map[doc.id] = doc.data().name;
      });

      const names = data.groups?.map((id: string) => map[id] || id) || [];
      setGroupNames(names);

      // Fetch linked parents
      let parentProfiles: any[] = [];
      if (data.parentUids?.length > 0) {
        const parentDocs = await Promise.all(
          data.parentUids.map((uid: string) => getDoc(doc(db, "users", uid)))
        );
        parentProfiles = parentDocs
          .filter((docSnap) => docSnap.exists())
          .map((docSnap) => docSnap.data());
      }
      setParents(parentProfiles);
    } catch (err) {
      console.warn("Failed to load member:", err);
    }

    setLoading(false);
  };

  if (loading || !member) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#d60124" />
      </View>
    );
  }

  const initials = member.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  const age = member.dob ? calculateAge(member.dob) : null;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* 🖼️ Profile Picture */}
      <View style={styles.avatarSection}>
        {member.photoURL ? (
          <Image
            cachePolicy="memory-disk"
            source={{ uri: member.photoURL }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.placeholderAvatar}>
            <Text style={styles.initials}>{initials}</Text>
          </View>
        )}
        <Text style={styles.name}>
          {member.name} {age !== null && `(${age})`}
        </Text>
        <Text style={styles.branch}>📍 {member.branch}</Text>
      </View>

      {/* 🏅 Quick Actions Bar */}
      <QuickActionsBar
        onReport={() => router.push(`/staff/reports/?childId=${childId}`)}
        onAwardPoints={() => router.push(`/staff/award/${childId}`)}
        onMessage={() => router.push(`/staff/message/${childId}`)}
      />
      {/* 🆘 Emergency Contacts */}
      <Card title="Emergency Contacts">
        {member.emergencyContacts?.length ? (
          member.emergencyContacts.map((contact: any, index: number) => {
            const firstName = contact.name.split(" ")[0].toLowerCase();
            const matchedParent = parents.find((p) =>
              p.name.toLowerCase().startsWith(firstName)
            );

            return (
              <View key={index} style={styles.contactRow}>
                <Image
                  source={{
                    uri:
                      matchedParent?.photoURL ||
                      "https://via.placeholder.com/60",
                  }}
                  style={styles.contactAvatar}
                  cachePolicy="memory-disk"
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.text}> {contact.name}</Text>
                  <Text style={styles.text}> {contact.number}</Text>
                </View>
                <Pressable
                  onPress={() => Linking.openURL(`tel:${contact.number}`)}
                  style={styles.callButton}
                >
                  <Ionicons name="call-outline" size={18} color="#fff" />
                </Pressable>
              </View>
            );
          })
        ) : (
          <Text style={styles.text}>No contacts provided.</Text>
        )}
      </Card>

      {/* 📅 Joined & DOB */}
      <Card title="Details">
        <Text style={styles.text}>
          📅 Date Joined:{" "}
          {member.dateJoined?.toDate
            ? member.dateJoined.toDate().toLocaleDateString("en-GB")
            : "N/A"}
        </Text>
        <Text style={styles.text}>
          🎂 Date of Birth:{" "}
          {member.dob?.toDate
            ? member.dob.toDate().toLocaleDateString("en-GB")
            : "N/A"}
        </Text>
      </Card>

      {/* 🏠 Address Info */}
      <Card title="Address">
        <Text style={styles.text}>🏠 {member.address || "N/A"}</Text>
        <Text style={styles.text}>📮 {member.postCode || "N/A"}</Text>
      </Card>

      {/* 📧 Email for Marketing */}
      <Card title="Marketing Email">
        <Text style={styles.text}>{member.email || "No email provided"}</Text>
      </Card>

      {/* 📚 Groups */}
      <Card title="Groups">
        <Text style={styles.text}>
          {groupNames.length > 0 ? groupNames.join(", ") : "No groups assigned"}
        </Text>
      </Card>

      {/* 🩺 Medical Info */}
      <Card title="Medical Info">
        <Text style={styles.text}>
          {member.medicalInfo || "No medical information provided."}
        </Text>
      </Card>

      {/* 📸 Photo Permission */}
      <Card title="Photo Permissions">
        <Text style={styles.text}>
          {member.allowPhotos ? "✅ Allowed" : "❌ Not Allowed"}
        </Text>
      </Card>

      {/* 🏅 Summary */}
      <BadgeSummary />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    gap: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 8,
  },
  placeholderAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#d60124",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  initials: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
    textAlign: "center",
  },
  branch: {
    color: "#666",
    fontSize: 14,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#ccc",
  },
  callButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#d60124",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
});
