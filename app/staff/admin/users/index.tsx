// app/staff/index.tsx
import { View, Text, StyleSheet } from "react-native";

export default function StaffDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Users</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 12,
    fontWeight: "bold",
  },
});
