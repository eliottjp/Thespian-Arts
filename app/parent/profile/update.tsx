import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db, storage, auth } from "../../../lib/firebase";
import { useAuth } from "../../../context/AuthContext";
import Screen from "../../../components/Screen";
import Title from "../../../components/Title";
import MyButton from "../../../components/Button";
import { useRouter } from "expo-router";

export default function UpdateProfilePage() {
  const { userData, user } = useAuth();
  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.uid) return;
      const docRef = doc(db, "users", user.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        setName(data.name || "");
        setPhotoURL(data.photoURL || null);
      }
      setLoading(false);
    };

    loadProfile();
  }, [user?.uid]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      const response = await fetch(asset.uri);
      const blob = await response.blob();

      const filename = `profilePhotos/${user?.uid}.jpg`;
      const storageRef = ref(storage, filename);

      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      setPhotoURL(downloadURL);
    }
  };

  const handleSave = async () => {
    if (!user?.uid) return;
    setSaving(true);

    try {
      await updateDoc(doc(db, "users", user.uid), {
        name,
        photoURL,
      });

      Alert.alert("Success", "Profile updated successfully.");
      router.push("/parent/profile");
    } catch (error) {
      console.error("Update failed:", error);
      Alert.alert("Error", "Failed to update profile.");
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator size="large" color="#d60124" />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.card}>
        <Text style={styles.label}>Profile Photo</Text>
        <Image
          source={{
            uri: photoURL || "https://via.placeholder.com/100",
          }}
          style={styles.avatar}
        />
        <Pressable onPress={pickImage}>
          <Text style={styles.link}>📷 Change Photo</Text>
        </Pressable>

        <Text style={styles.label}>Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholder="Enter your name"
        />

        {/* You can optionally add email here, but Firebase Auth manages it */}
        {/* <Text style={styles.label}>Email</Text>
        <Text style={styles.emailText}>{user?.email}</Text> */}

        <MyButton
          label={saving ? "Saving..." : "Save Changes"}
          onPress={handleSave}
          disabled={saving}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    gap: 12,
    elevation: 2,
    marginTop: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: "center",
    marginBottom: 8,
  },
  link: {
    color: "#d60124",
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "600",
  },
  emailText: {
    fontSize: 15,
    color: "#666",
    marginBottom: 12,
  },
});
