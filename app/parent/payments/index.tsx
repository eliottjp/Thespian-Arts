import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Button,
} from "react-native";
import { db, auth } from "../../../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "expo-router";
import Dropdown from "react-native-input-select";
import Screen from "../../../components/Screen"; // Assuming the Screen component is correctly imported

export default function SubscribePage() {
  const router = useRouter();

  // State for children, groups, and selected options
  const [children, setChildren] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([
    "Brownhills",
    "Rugeley",
    "Pelsall",
    "Great Barr",
    "Ashmore Park",
  ]);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!auth.currentUser?.uid) return;

      // Fetch linked children
      const childQuery = query(
        collection(db, "members"),
        where("role", "==", "member"),
        where("parentUids", "array-contains", auth.currentUser.uid)
      );

      const childSnap = await getDocs(childQuery);
      const childList = childSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChildren(childList);

      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedBranch) {
      // Fetch classes based on selected branch
      const fetchClasses = async () => {
        const groupQuery = query(
          collection(db, "groups"),
          where("branch", "==", selectedBranch)
        );
        const groupSnap = await getDocs(groupQuery);
        const groupList = groupSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGroups(groupList);
      };

      fetchClasses();
    }
  }, [selectedBranch]);

  const handleProceedToPayment = () => {
    // Ensure no null values are passed
    const safeChild = selectedChild ?? "";
    const safeClass = selectedClass ?? "";
    const safeBranch = selectedBranch ?? "";

    if (!safeChild || !safeClass || !safeBranch) {
      alert("Please select a child, class, and branch.");
      return;
    }

    // Proceed to payment, passing the validated values
    router.push(
      `/parent/payments/checkout?childId=${safeChild}&classId=${safeClass}&branch=${safeBranch}`
    );
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
      <Text style={styles.title}>Subscribe to a Class</Text>

      {/* Branch selection */}
      <Text style={styles.label}>Select Branch</Text>
      <Dropdown
        label="Select Branch"
        placeholder="Select an option..."
        options={branches.map((branch) => ({
          label: branch,
          value: branch,
        }))}
        selectedValue={selectedBranch}
        onValueChange={(value) => setSelectedBranch(value)}
        primaryColor="green"
        style={styles.picker}
      />

      {/* Child selection */}
      <Text style={styles.label}>Select Child</Text>
      <Dropdown
        label="Select Child"
        placeholder="Select an option..."
        options={children.map((child) => ({
          label: child.name,
          value: child.id,
        }))}
        selectedValue={selectedChild}
        onValueChange={(value) => setSelectedChild(value)}
        primaryColor="green"
        style={styles.picker}
      />

      {/* Class selection */}
      <Text style={styles.label}>Select Class</Text>
      <Dropdown
        label="Select Class"
        placeholder="Select an option..."
        options={groups.map((group) => ({
          label: `${group.name} - ${group.schedule[0]?.day} ${group.schedule[0]?.time}`,
          value: group.id,
        }))}
        selectedValue={selectedClass}
        onValueChange={(value) => setSelectedClass(value)}
        primaryColor="green"
        style={styles.picker}
      />

      {/* Proceed to Payment */}
      <Button
        title="Proceed to Payment"
        onPress={handleProceedToPayment}
        color="#d60124"
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#f9f9f9", // Adding a soft background color
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#d60124", // Matching the theme color
    textAlign: "center",
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#555", // Subtle label color
  },
  picker: {
    height: 50,
    marginBottom: 16,
    width: "100%",
    zIndex: 1000, // Ensure it stays above other content
    backgroundColor: "#fff", // White background for dropdowns
    borderRadius: 10, // Rounded borders for dropdowns
    borderWidth: 1,
    borderColor: "#ddd", // Light border for dropdowns
  },
});
