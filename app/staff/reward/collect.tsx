import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { db } from "../../../lib/firebase";
import {
  doc,
  getDoc,
  query,
  where,
  getDocs,
  collectionGroup,
  updateDoc,
} from "firebase/firestore";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";

export default function RewardCollectPage() {
  const [codeInput, setCodeInput] = useState("");
  const [reward, setReward] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const { rewardData } = useLocalSearchParams();

  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    try {
      const parsed = JSON.parse(data);
      fetchByQR(parsed);
    } catch {
      Alert.alert("Invalid QR Code");
      setScanned(false);
    }
  };

  // 🔁 Automatically load reward if passed via QR scanner
  useEffect(() => {
    if (rewardData) {
      try {
        const parsed = JSON.parse(rewardData as string);
        fetchByQR(parsed);
      } catch {
        Alert.alert("Invalid QR Code");
      }
    }
  }, [rewardData]);

  const fetchByQR = async ({
    memberId,
    rewardId,
    redeemCode,
  }: {
    memberId: string;
    rewardId: string;
    redeemCode: string;
  }) => {
    setLoading(true);
    try {
      const ref = doc(db, "members", memberId, "rewards", rewardId);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        Alert.alert("Not found", "This reward doesn't exist.");
        return;
      }

      const data = snap.data();
      if (data.collected) {
        Alert.alert("Already collected");
        return;
      }

      if (data.redeemCode !== redeemCode) {
        Alert.alert("QR Code mismatch.");
        return;
      }

      setReward({ ...data, ref });
    } catch (err) {
      console.error(err);
      Alert.alert("Error loading reward");
    } finally {
      setLoading(false);
    }
  };

  const fetchByCode = async () => {
    if (codeInput.length !== 4) {
      Alert.alert("Enter a 4-digit code.");
      return;
    }

    setLoading(true);

    const q = query(
      collectionGroup(db, "rewards"),
      where("redeemCode", "==", codeInput),
      where("collected", "==", false)
    );

    const snap = await getDocs(q);

    if (snap.empty) {
      Alert.alert("Not found", "No uncollected reward matches that code.");
      setReward(null);
    } else {
      const docSnap = snap.docs[0];
      setReward({
        id: docSnap.id,
        ref: docSnap.ref,
        ...docSnap.data(),
      });
    }

    setLoading(false);
  };

  const markCollected = async () => {
    if (!reward) return;

    try {
      await updateDoc(reward.ref, { collected: true });
      Alert.alert("✅ Collected", `${reward.item} marked as collected.`);
      setReward(null);
      setCodeInput("");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not mark as collected.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎯 Staff Reward Collection</Text>
      {permission?.granted ? (
        <View
          style={{
            height: 280,
            marginBottom: 20,
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <CameraView
            style={{ flex: 1 }}
            facing="back"
            onBarcodeScanned={handleBarCodeScanned}
            barCodeScannerSettings={{ barCodeTypes: ["qr"] }}
          />
        </View>
      ) : (
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>📷 Enable QR Scanner</Text>
        </TouchableOpacity>
      )}

      <TextInput
        style={styles.input}
        placeholder="Enter 4-digit code"
        keyboardType="numeric"
        maxLength={4}
        value={codeInput}
        onChangeText={setCodeInput}
      />

      <TouchableOpacity style={styles.button} onPress={fetchByCode}>
        <Text style={styles.buttonText}>🔍 Find Reward</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#d60124" />}

      {reward && (
        <View style={styles.resultCard}>
          <Text style={styles.emoji}>{reward.emoji}</Text>
          <Text style={styles.item}>{reward.item}</Text>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={markCollected}
          >
            <Text style={styles.confirmText}>✅ Mark as Collected</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    backgroundColor: "#fefefe",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 18,
    marginBottom: 14,
  },
  button: {
    backgroundColor: "#d60124",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  resultCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  emoji: {
    fontSize: 42,
    marginBottom: 10,
  },
  item: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  confirmButton: {
    backgroundColor: "#24b300",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  confirmText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
