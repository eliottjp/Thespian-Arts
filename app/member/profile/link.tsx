import { View, Text, StyleSheet, Share, TouchableOpacity } from "react-native";
import { useAuth } from "../../../context/AuthContext";
import QRCode from "react-native-qrcode-svg";
import { Ionicons } from "@expo/vector-icons";

export default function LinkCodeScreen() {
  const { userData } = useAuth();

  if (!userData?.linkCode) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "#666" }}>No link code found.</Text>
      </View>
    );
  }

  const qrPayload = JSON.stringify({
    memberId: userData.uid,
    linkCode: userData.linkCode,
  });

  const handleShare = async () => {
    try {
      const message = `👋 Hey! Use this code to link to me in the Thespian Arts app: ${userData.linkCode}\n\nOpen the app as a parent and enter this code on the profile page to connect.`;
      await Share.share({ message });
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>🔗 Your Link Code</Text>

        <View style={styles.qrBox}>
          <QRCode value={qrPayload} size={180} />
        </View>

        <Text style={styles.codeLabel}>Share This Code:</Text>
        <View style={styles.codePill}>
          <Text style={styles.codeText}>{userData.linkCode}</Text>
        </View>

        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={18} color="#fff" />
          <Text style={styles.shareText}>Send to Parent / Carer</Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          Ask your parent or carer to enter this code in their app to link to
          your account.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fefefe",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#fff",
    padding: 28,
    borderRadius: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    width: "100%",
    maxWidth: 380,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: "#222",
    textAlign: "center",
  },
  qrBox: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 24,
  },
  codeLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 6,
  },
  codePill: {
    backgroundColor: "#d60124",
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 999,
    marginBottom: 20,
  },
  codeText: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "800",
    letterSpacing: 6,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#d60124",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 999,
    marginBottom: 16,
  },
  shareText: {
    color: "#fff",
    fontWeight: "600",
  },
  note: {
    textAlign: "center",
    fontSize: 14,
    color: "#666",
    marginTop: 10,
  },
});
