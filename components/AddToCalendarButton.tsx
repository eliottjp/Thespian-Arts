// components/AddToCalendarButton.tsx
import { Pressable, Text, StyleSheet, Linking, Platform } from "react-native";
import * as Calendar from "expo-calendar";
import * as AddCalendarEvent from "react-native-add-calendar-event";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  title: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  notes?: string;
};

export default function AddToCalendarButton({
  title,
  startDate,
  endDate,
  location,
  notes,
}: Props) {
  const handleAdd = async () => {
    const formattedStart = format(startDate, "yyyyMMdd'T'HHmmss");
    const formattedEnd = format(endDate, "yyyyMMdd'T'HHmmss");

    const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title + " — Thespian Arts"
    )}&dates=${formattedStart}/${formattedEnd}&location=${encodeURIComponent(
      location || ""
    )}&details=${encodeURIComponent(
      (notes || "") + "\n\nAdded via the Thespian Arts App 🎭"
    )}`;

    if (Platform.OS === "web") {
      Linking.openURL(calendarUrl);
      return;
    }

    try {
      const eventConfig = {
        title: `${title} — Thespian Arts`,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        location,
        notes: (notes || "") + "\nAdded via the Thespian Arts App 🎭",
      };

      await AddCalendarEvent.presentEventCreatingDialog(eventConfig);
    } catch (err) {
      console.warn("Failed to add to calendar:", err);
    }
  };

  return (
    <Pressable onPress={handleAdd} style={styles.button}>
      <Ionicons name="calendar-outline" size={18} color="#fff" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#d60124",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
