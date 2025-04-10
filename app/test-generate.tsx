import { useEffect } from "react";
import { View, Text } from "react-native";
import { generateTestResources } from "../scripts/generateTestResources";
import { createTestTimetableData } from "../scripts/CreateTestTimetableData";
import { createAllGroups } from "../scripts/createAllGroups";
import { createTestEvents } from "../scripts/createTestEvents";

export default function TestGenerateResourcesPage() {
  useEffect(() => {
    //insert test resources
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text>Generating test resource data...</Text>
    </View>
  );
}
