import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { db, storage } from "../../../../lib/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function GroupEditorPage() {
  const { groupId } = useLocalSearchParams();
  const router = useRouter();

  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newPhotoURL, setNewPhotoURL] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newBranch, setNewBranch] = useState("");
  const [newId, setNewId] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newSchedule, setNewSchedule] = useState<
    { day: string; time: string; location: string }[]
  >([]);

  useEffect(() => {
    const fetchGroupData = async () => {
      if (!groupId) return;

      try {
        const groupRef = doc(db, "groups", groupId);
        const groupSnap = await getDoc(groupRef);

        if (groupSnap.exists()) {
          const groupData = groupSnap.data();
          setGroup(groupData);
          setNewName(groupData.name || "");
          setNewBranch(groupData.branch || "");
          setNewId(groupData.id || "");
          setNewPrice(groupData.price || "");
          setNewSchedule(groupData.schedule || []);
        } else {
          console.log("Group not found!");
        }
      } catch (err) {
        console.error("Error fetching group data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupData();
  }, [groupId]);

  const handleSaveGroup = async () => {
    if (!groupId || !newName || !newBranch || !newId || !newPrice) return;

    setLoading(true);
    try {
      let photoURL = group?.photoURL;
      if (newPhotoURL) {
        // Upload new image if selected
        const response = await fetch(newPhotoURL);
        const blob = await response.blob();
        const filename = `group-photos/${groupId}-${new Date().getTime()}.jpg`;
        const storageRef = ref(storage, filename);
        await uploadBytes(storageRef, blob);
        photoURL = await getDownloadURL(storageRef);
      }

      // Update group details in Firestore
      await updateDoc(doc(db, "groups", groupId), {
        name: newName,
        branch: newBranch,
        id: newId,
        photoURL,
        price: newPrice,
        schedule: newSchedule,
      });

      alert("Group updated successfully!");
      router.push(`/staff/admin/group/${groupId}`); // Navigate to the group details page
    } catch (err) {
      console.error("Error updating group:", err);
      alert("Failed to update group.");
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setNewPhotoURL(result.assets[0].uri);
    }
  };

  const addNewScheduleDay = () => {
    setNewSchedule([...newSchedule, { day: "", time: "", location: "" }]);
  };

  const updateScheduleDay = (index: number, field: string, value: string) => {
    const updatedSchedule = [...newSchedule];
    updatedSchedule[index][field] = value;
    setNewSchedule(updatedSchedule);
  };

  const removeScheduleDay = (index: number) => {
    const updatedSchedule = newSchedule.filter((_, i) => i !== index);
    setNewSchedule(updatedSchedule);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#d60124" />
      </View>
    );
  }

  if (!group) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: "#888" }}>Group not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {/* Editable Group Info */}
      <TextInput
        style={styles.input}
        value={newName}
        onChangeText={setNewName}
        placeholder="Group Name"
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        value={newBranch}
        onChangeText={setNewBranch}
        placeholder="Branch"
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        value={newId}
        onChangeText={setNewId}
        placeholder="Group ID"
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        value={newPrice}
        onChangeText={setNewPrice}
        placeholder="Price"
        keyboardType="numeric"
        placeholderTextColor="#888"
      />

      {/* Editable Group Image */}
      <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
        <Text style={styles.uploadText}>Upload New Image</Text>
      </TouchableOpacity>

      {newPhotoURL && (
        <Image source={{ uri: newPhotoURL }} style={styles.imagePreview} />
      )}

      {/* Editable Schedule */}
      <Text style={styles.sectionTitle}>Schedule</Text>
      {newSchedule.map((day, index) => (
        <View key={index} style={styles.scheduleCard}>
          <TextInput
            style={styles.scheduleInput}
            placeholder="Day"
            value={day.day}
            onChangeText={(text) => updateScheduleDay(index, "day", text)}
          />
          <TextInput
            style={styles.scheduleInput}
            placeholder="Time"
            value={day.time}
            onChangeText={(text) => updateScheduleDay(index, "time", text)}
          />
          <TextInput
            style={styles.scheduleInput}
            placeholder="Location"
            value={day.location}
            onChangeText={(text) => updateScheduleDay(index, "location", text)}
          />
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeScheduleDay(index)}
          >
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity onPress={addNewScheduleDay} style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Add Day</Text>
      </TouchableOpacity>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveGroup}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    backgroundColor: "#f1f1f1",
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    fontSize: 16,
    color: "#333",
  },
  uploadButton: {
    marginTop: 10,
    padding: 12,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  uploadText: {
    color: "#d60124",
    fontSize: 16,
    fontWeight: "600",
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  scheduleCard: {
    marginBottom: 12,
  },
  scheduleInput: {
    backgroundColor: "#f1f1f1",
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    fontSize: 16,
    color: "#333",
  },
  removeButton: {
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  removeButtonText: {
    color: "#d60124",
    fontWeight: "600",
  },
  addButton: {
    color: "#007bff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
  },
  saveButton: {
    marginTop: 20,
    padding: 14,
    backgroundColor: "#d60124",
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  addButtonText: {
    color: "#007bff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
  },
});
