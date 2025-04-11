import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import QRCode from "react-native-qrcode-svg";

export default function RewardDetail() {
  const { rewardId, rewardData } = useLocalSearchParams();
  const reward = JSON.parse(rewardData as string);

  const qrPayload = JSON.stringify({
    memberId: reward.memberId,
    rewardId,
    redeemCode: reward.redeemCode,
  });

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.emoji}>{reward.emoji}</Text>
        <Text style={styles.title}>{reward.item}</Text>

        <View style={styles.qrBox}>
          <QRCode value={qrPayload} size={180} />
        </View>

        <Text style={styles.codeLabel}>Show This Code:</Text>
        <View style={styles.codePill}>
          <Text style={styles.codeText}>{reward.redeemCode}</Text>
        </View>

        <Text style={styles.note}>
          Staff will scan this QR code or enter the 4-digit code to confirm
          collection.
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
  emoji: {
    fontSize: 48,
    marginBottom: 12,
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
  note: {
    textAlign: "center",
    fontSize: 14,
    color: "#666",
    marginTop: 10,
  },
});
