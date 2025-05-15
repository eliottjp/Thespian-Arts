import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { useEventAttendance } from "../context/useEventAttendance";

export default function AttendingButton({
  eventId,
  eventName,
}: {
  eventId: string;
  eventName: string;
}) {
  const { attending, toggleAttendance, loading } = useEventAttendance(eventId);

  if (loading) {
    return <ActivityIndicator size="small" color="#d60124" />;
  }

  return (
    <Pressable
      style={[styles.button, attending && styles.active]}
      onPress={() => toggleAttendance(eventName)}
    >
      <Text style={[styles.text, attending && styles.activeText]}>
        {attending ? "✓ Attending" : "I'm Attending"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#d60124",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  active: {
    backgroundColor: "green",
    borderColor: "green",
  },
  text: {
    color: "#d60124",
    fontWeight: "600",
  },
  activeText: {
    color: "#fff",
  },
});
