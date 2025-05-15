import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../../../lib/firebase";
import Screen from "../../../../components/Screen";
import EmojiSelector from "react-native-emoji-selector";

export default function ManageRewards() {
  const [items, setItems] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [emoji, setEmoji] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploading, setUploading] = useState(false);

  const rewardsRef = collection(db, "rewards", "config", "items");

  const fetchItems = async () => {
    const snap = await getDocs(rewardsRef);
    setItems(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const clearForm = () => {
    setName("");
    setCost("");
    setEmoji("");
    setImageURL("");
    setEditingId(null);
    setShowEmojiPicker(false);
  };

  const handleImageUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.[0]) {
      const file = result.assets[0];
      const response = await fetch(file.uri);
      const blob = await response.blob();

      setUploading(true);
      const storageRef = ref(
        storage,
        `rewards/${Date.now()}-${file.fileName || "image"}`
      );
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      setImageURL(downloadURL);
      setUploading(false);
    }
  };

  const saveItem = async () => {
    const data = {
      name,
      cost: parseInt(cost),
      emoji,
      imageURL: imageURL || null,
    };

    if (editingId) {
      await updateDoc(doc(rewardsRef, editingId), data);
    } else {
      await addDoc(rewardsRef, data);
    }

    await fetchItems();
    clearForm();
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setName(item.name);
    setCost(item.cost.toString());
    setEmoji(item.emoji);
    setImageURL(item.imageURL || "");
  };

  const confirmDelete = (id: string) => {
    Alert.alert("Delete Item", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteDoc(doc(rewardsRef, id));
          await fetchItems();
        },
      },
    ]);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.header}>
          {editingId ? "Edit Reward Item" : "Add Reward Item"}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Cost (points)"
          value={cost}
          onChangeText={setCost}
          keyboardType="number-pad"
        />

        <TouchableOpacity onPress={() => setShowEmojiPicker(!showEmojiPicker)}>
          <Text style={styles.emojiToggle}>
            {emoji ? `Selected: ${emoji}` : "Pick an Emoji"}
          </Text>
        </TouchableOpacity>
        {showEmojiPicker && (
          <EmojiSelector
            onEmojiSelected={(e) => {
              setEmoji(e);
              setShowEmojiPicker(false);
            }}
            showSearchBar={false}
            showTabs={true}
            columns={8}
          />
        )}

        <Button
          title={uploading ? "Uploading..." : "Upload Image"}
          onPress={handleImageUpload}
          disabled={uploading}
        />
        {imageURL ? (
          <Image source={{ uri: imageURL }} style={styles.previewImage} />
        ) : null}

        <Button
          title={editingId ? "Update Item" : "Add Item"}
          onPress={saveItem}
        />
        {editingId && (
          <Button title="Cancel Edit" onPress={clearForm} color="#999" />
        )}

        <Text style={styles.header}>Existing Items</Text>
        {items.map((item) => (
          <View key={item.id} style={styles.card}>
            {item.imageURL ? (
              <Image source={{ uri: item.imageURL }} style={styles.image} />
            ) : (
              <Text style={styles.emoji}>{item.emoji}</Text>
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>
                {item.name} ({item.cost} pts)
              </Text>
            </View>
            <TouchableOpacity onPress={() => startEdit(item)}>
              <Text style={styles.action}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => confirmDelete(item.id)}>
              <Text style={styles.action}>🗑️</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
  },
  emojiToggle: {
    fontSize: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
    textAlign: "center",
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginVertical: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
    elevation: 1,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  emoji: {
    fontSize: 32,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  action: {
    fontSize: 18,
    marginHorizontal: 4,
  },
});
