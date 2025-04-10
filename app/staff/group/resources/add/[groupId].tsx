import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { Video } from "expo-av";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, storage } from "../../../../../lib/firebase";
import { useAuth } from "../../../../../context/AuthContext";
import { Dropdown } from "react-native-element-dropdown";

const RESOURCE_TYPES = [
  { label: "Image", value: "image" },
  { label: "Video", value: "video" },
  { label: "PDF", value: "pdf" },
  { label: "Audio", value: "audio" },
];

export default function AddResourcePage() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const { userData } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("image");
  const [file, setFile] = useState<any>(null);

  const pickFile = async () => {
    try {
      if (type === "image" || type === "video") {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes:
            type === "image"
              ? ImagePicker.MediaTypeOptions.Images
              : ImagePicker.MediaTypeOptions.Videos,
          quality: 0.8,
        });

        if (!result.canceled && result.assets.length > 0) {
          setFile(result.assets[0]);
        }
      } else {
        const result = await DocumentPicker.getDocumentAsync({
          type:
            type === "pdf"
              ? "application/pdf"
              : type === "audio"
              ? "audio/*"
              : "*/*",
          copyToCacheDirectory: true,
        });

        if (result.assets && result.assets.length > 0) {
          setFile(result.assets[0]);
        }
      }
    } catch (err) {
      console.error("Error picking file:", err);
      Alert.alert("Error", "Failed to select file.");
    }
  };

  const handleUpload = async () => {
    if (!file || !name || !groupId) {
      Alert.alert("Missing info", "Please complete all fields.");
      return;
    }

    setLoading(true);
    try {
      const fileName = `${groupId}-${Date.now()}-${file.name || "upload"}`;
      const fileRef = ref(storage, `resources/${groupId}/${fileName}`);
      const fileBlob = await fetch(file.uri).then((r) => r.blob());

      await uploadBytes(fileRef, fileBlob);
      const url = await getDownloadURL(fileRef);

      await addDoc(collection(db, "groups", groupId, "resources"), {
        name,
        type,
        url,
        uploadedBy: userData?.uid || "unknown",
        thumbnail: type === "image" || type === "video" ? file.uri : null,
        timestamp: serverTimestamp(),
      });

      Alert.alert("✅ Upload Successful", "Your resource has been uploaded.");

      // Clear form
      setName("");
      setType("image");
      setFile(null);
    } catch (err) {
      console.error("Upload error:", err);
      Alert.alert("Upload failed", "Something went wrong during upload.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Resource</Text>

      <TextInput
        style={styles.input}
        placeholder="Title"
        value={name}
        onChangeText={setName}
      />

      <Dropdown
        data={RESOURCE_TYPES}
        labelField="label"
        valueField="value"
        value={type}
        onChange={(item) => setType(item.value)}
        style={styles.dropdown}
        placeholder="Select type"
      />

      <TouchableOpacity onPress={pickFile} style={styles.selectButton}>
        <Text style={styles.selectButtonText}>Select {type}</Text>
      </TouchableOpacity>

      {/* Previews */}
      {file && type === "image" && (
        <Image
          source={{ uri: file.uri }}
          style={styles.previewImage}
          resizeMode="contain"
        />
      )}
      {file && type === "video" && (
        <Video
          source={{ uri: file.uri }}
          useNativeControls
          resizeMode="contain"
          style={styles.previewVideo}
        />
      )}
      {file && type === "pdf" && (
        <Text style={styles.previewText}>📄 PDF Selected: {file.name}</Text>
      )}
      {file && type === "audio" && (
        <Text style={styles.previewText}>🎧 Audio Selected: {file.name}</Text>
      )}

      <TouchableOpacity
        onPress={handleUpload}
        style={styles.uploadButton}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.uploadButtonText}>Upload</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1, backgroundColor: "#fff" },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    color: "#d60124",
    textAlign: "center",
  },
  input: {
    backgroundColor: "#f1f1f1",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 12,
  },
  dropdown: {
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  selectButton: {
    backgroundColor: "#d60124",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  selectButtonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
  previewImage: {
    width: "100%",
    height: 220,
    borderRadius: 8,
    marginBottom: 16,
  },
  previewVideo: {
    width: "100%",
    height: 220,
    borderRadius: 8,
    marginBottom: 16,
  },
  previewText: {
    textAlign: "center",
    marginBottom: 12,
    color: "#333",
    fontSize: 15,
  },
  uploadButton: {
    backgroundColor: "#d60124",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  uploadButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
