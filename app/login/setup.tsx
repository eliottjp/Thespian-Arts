import { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { db } from "../../lib/firebase";
import {
  getDocs,
  collection,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import * as Clipboard from "expo-clipboard";
import * as MediaLibrary from "expo-media-library";
import { captureRef } from "react-native-view-shot";
import Toast from "react-native-toast-message";
import * as Haptics from "expo-haptics";
import * as Crypto from "expo-crypto";
import { useAuth } from "../../context/AuthContext";

export default function MemberSetup() {
  const { code: urlCode } = useLocalSearchParams();
  const router = useRouter();
  const { loginMember } = useAuth();

  const [setupCode, setSetupCode] = useState(
    typeof urlCode === "string" ? urlCode : ""
  );
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [accountCreated, setAccountCreated] = useState(false);
  const [username, setUsername] = useState("");
  const [imageSaved, setImageSaved] = useState(false);
  const [savingImage, setSavingImage] = useState(false);
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [pendingUserData, setPendingUserData] = useState<any>(null);

  const cardRef = useRef(null);

  const handleSetup = async () => {
    if (!setupCode || !password) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        "Missing fields",
        "Please enter your setup code and password."
      );
      return;
    }

    if (password.length < 6) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Weak Password", "Password should be at least 6 characters.");
      return;
    }

    setSubmitting(true);

    try {
      const q = query(
        collection(db, "members"),
        where("setupCode", "==", setupCode)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert("Invalid Code", "No member found with that setup code.");
        setSubmitting(false);
        return;
      }

      const docRef = snapshot.docs[0].ref;
      const docId = snapshot.docs[0].id;
      const data = snapshot.docs[0].data();

      const nameParts = data.name.toLowerCase().split(" ");
      const generatedUsername = `${nameParts[0]}.${
        nameParts[1]?.charAt(0) || ""
      }`.replace(/[^a-z]/g, "");

      const hashedPassword = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password
      );

      // Save to Firestore
      await updateDoc(docRef, {
        password: hashedPassword,
        username: generatedUsername,
        setupCode: null,
        role: "member",
        onboardingComplete: true,
      });

      // Update state
      setUsername(generatedUsername);
      setAccountCreated(true);
      setTimeout(() => {
        setShowContinueButton(true);
      }, 5000); // ⏳ 5 seconds
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      Toast.show({
        type: "success",
        position: "bottom",
        text1: "This is your username",
        text2: `Please remember it: ${generatedUsername}`,
        visibilityTime: 10000,
        autoHide: true,
      });

      // Auto-login
      const enrichedData = {
        ...data,
        uid: docId,
        password: hashedPassword,
        username: generatedUsername,
        role: "member",
        onboardingComplete: true,
      };

      setPendingUserData(enrichedData);

      setTimeout(() => {
        setShowContinueButton(true);
      }, 5000); // show after 5s, no auto-login
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }

    setSubmitting(false);
  };

  const handleCopy = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Toast.show({
      type: "info",
      text1: `"${text}" copied to clipboard`,
    });
  };

  const handleSaveCard = async () => {
    const permission = await MediaLibrary.requestPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Denied", "Cannot save image without permission.");
      return;
    }

    setSavingImage(true);
    try {
      const uri = await captureRef(cardRef, {
        format: "png",
        quality: 1,
      });

      await MediaLibrary.saveToLibraryAsync(uri);
      setImageSaved(true);
      Toast.show({
        type: "success",
        text1: "Saved to Photos",
        text2: "Your account card has been saved.",
      });
    } catch (error) {
      console.error("Save failed", error);
      Alert.alert("Error", "Could not save image.");
    }
    setSavingImage(false);
  };

  const handleContinue = async () => {
    if (pendingUserData) {
      await loginMember(pendingUserData);
      router.replace("/member");
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <Text style={styles.title}>Member Setup</Text>

      {accountCreated ? (
        <>
          <Text style={styles.successText}>🎉 Your account is ready!</Text>

          <View collapsable={false} style={styles.card} ref={cardRef}>
            <Text style={styles.cardTitle}>Thespian Arts</Text>
            <Text style={styles.cardSubtitle}>Your Account Info</Text>

            <View style={styles.row}>
              <Text style={styles.label}>Username:</Text>
              <Text style={styles.value}>{username}</Text>
              <TouchableOpacity onPress={() => handleCopy(username)}>
                <Text style={styles.copy}>📋</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Password:</Text>
              <Text style={styles.value}>{password}</Text>
              <TouchableOpacity onPress={() => handleCopy(password)}>
                <Text style={styles.copy}>📋</Text>
              </TouchableOpacity>
            </View>
          </View>

          {!imageSaved && (
            <TouchableOpacity
              style={styles.button}
              onPress={handleSaveCard}
              disabled={savingImage}
            >
              <Text style={styles.buttonText}>
                {savingImage ? "Saving..." : "Save Card to Photos"}
              </Text>
            </TouchableOpacity>
          )}

          {imageSaved && showContinueButton && (
            <TouchableOpacity style={styles.button} onPress={handleContinue}>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <>
          <Text style={styles.description}>
            Enter your setup code and create a password to finish creating your
            account.
          </Text>

          <TextInput
            placeholder="Setup Code"
            value={setupCode}
            onChangeText={setSetupCode}
            autoCapitalize="characters"
            style={styles.input}
            placeholderTextColor="#999"
          />

          <TextInput
            placeholder="Create Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#999"
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleSetup}
            disabled={submitting}
          >
            <Text style={styles.buttonText}>
              {submitting ? "Saving..." : "Set Up Account"}
            </Text>
          </TouchableOpacity>
        </>
      )}
      <Toast />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#222",
  },
  description: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 24,
    color: "#555",
  },
  successText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
    color: "green",
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#f1f1f1",
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#d60124",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  cardTitle: {
    fontWeight: "bold",
    color: "#d60124",
    fontSize: 18,
    marginBottom: 4,
    textAlign: "center",
  },
  cardSubtitle: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 14,
    textAlign: "center",
    color: "#333",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontWeight: "600",
    fontSize: 16,
    width: 90,
  },
  value: {
    fontSize: 16,
    flex: 1,
    color: "#333",
  },
  copy: {
    fontSize: 18,
    marginLeft: 8,
    color: "#d60124",
  },
});
