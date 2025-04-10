import { useState } from "react";
import { Text, TextInput } from "react-native";
import { db, auth } from "../../lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import Screen from "../../components/Screen";
import Title from "../../components/Title";
import MyButton from "../../components/Button";

export default function LinkChildScreen() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLink = async () => {
    const cleanedCode = code.trim().toUpperCase();

    if (!cleanedCode || cleanedCode.length < 4) {
      Toast.show({
        type: "error",
        text1: "Invalid Code",
        text2: "Please enter a valid 6-digit code.",
      });
      return;
    }

    if (!auth.currentUser?.uid) {
      Toast.show({
        type: "error",
        text1: "Not signed in",
        text2: "Please log in as a parent first.",
      });
      return;
    }

    try {
      setLoading(true);

      // Query members collection to find member with the provided link code
      const membersRef = collection(db, "members"); // Query the 'members' collection
      const q = query(
        membersRef,
        where("linkCode", "==", cleanedCode), // Match the link code
        where("role", "==", "member") // Ensure we are fetching a member
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        Toast.show({
          type: "error",
          text1: "Invalid Code",
          text2: "No member found with that code.",
        });
        return;
      }

      const memberDoc = snapshot.docs[0];
      const memberId = memberDoc.id;
      const memberData = memberDoc.data();

      // Check if the parent is already linked
      const existingParents: string[] = memberData?.parentUids ?? [];

      if (existingParents.includes(auth.currentUser.uid)) {
        Toast.show({
          type: "info",
          text1: "Already Linked",
          text2: "You're already linked to this child.",
        });
        return;
      }

      // Update the member document to link the parent
      await updateDoc(doc(db, "members", memberId), {
        parentUids: arrayUnion(auth.currentUser.uid), // Add parent UID to the member's parentUids array
      });

      Toast.show({
        type: "success",
        text1: "Child linked!",
        text2: `You're now linked to ${memberData.name}.`,
      });

      setTimeout(() => {
        router.push("/"); // Redirect to a different page (e.g., parent dashboard)
      }, 1500);
    } catch (error) {
      console.error("Linking error:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Title>Link Your Child</Title>
      <Text style={{ marginBottom: 6 }}>
        Enter the 6-digit code your child received to connect your account.
      </Text>
      <TextInput
        placeholder="e.g. ABC123"
        value={code}
        onChangeText={setCode}
        autoCapitalize="characters"
        autoCorrect={false}
        maxLength={8}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 6,
          padding: 12,
          marginTop: 12,
          marginBottom: 20,
          fontSize: 16,
        }}
      />
      <MyButton
        label={loading ? "Linking..." : "Link Child"}
        onPress={handleLink}
      />
    </Screen>
  );
}
