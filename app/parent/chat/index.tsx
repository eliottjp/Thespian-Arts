import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";

// Dummy data for chat rooms
const dummyChatRooms = [
  {
    id: "chatRoom1",
    title: "Chat with Tutor A",
    lastMessage: "Hi there! How's your child doing?",
  },
  {
    id: "chatRoom2",
    title: "Chat with Tutor B",
    lastMessage: "Don't forget about the parent-teacher meeting!",
  },
  {
    id: "chatRoom3",
    title: "Chat with Admin",
    lastMessage: "Your child's attendance is below 80%.",
  },
];

export default function ChatListScreen() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Mimic fetching data from Firestore
    setLoading(false);
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#d60124" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Messages</Text>
      <FlatList
        data={dummyChatRooms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/chat/${item.id}`)}
            style={styles.chatCard}
          >
            <Text style={styles.chatTitle}>{item.title}</Text>
            <Text style={styles.chatPreview}>{item.lastMessage}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  chatCard: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  chatTitle: { fontSize: 18, fontWeight: "bold" },
  chatPreview: { fontSize: 14, color: "#888", marginTop: 8 },
});
