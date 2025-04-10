import { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useLocalSearchParams } from "expo-router";

import AccidentReportForm from "./AccidentReportForm";
import SafeguardingForm from "./SafeguardingForm";

export default function ReportFormPage() {
  const { childId } = useLocalSearchParams(); // Get UID from route
  const [type, setType] = useState("");

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>📝 Report Type?</Text>
        <Dropdown
          style={styles.dropdown}
          data={[
            { label: "Accident", value: "accident" },
            { label: "Safeguarding", value: "safeguarding" },
          ]}
          labelField="label"
          valueField="value"
          placeholder="Select Report Type"
          value={type}
          onChange={(item) => setType(item.value)}
        />

        {type === "accident" && (
          <AccidentReportForm childId={childId as string} />
        )}
        {type === "safeguarding" && (
          <SafeguardingForm childId={childId as string} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  dropdown: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  label: {
    fontWeight: "600",
    marginBottom: 6,
  },
});
