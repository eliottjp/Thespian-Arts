import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import Screen from "../../../components/Screen";
import Title from "../../../components/Title";
import { Dropdown } from "react-native-element-dropdown";
import { Ionicons } from "@expo/vector-icons";

const BRANCHES = [
  "Brownhills",
  "Rugeley",
  "Great Barr",
  "Ashmore Park",
  "Pelsall",
];

export default function GroupListPage() {
  const [groups, setGroups] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchGroups = async () => {
      const snap = await getDocs(collection(db, "groups"));
      const results = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setGroups(results);
      setFiltered(results);
      setLoading(false);
    };

    fetchGroups();
  }, []);

  useEffect(() => {
    let filteredList = [...groups];

    if (search.trim() !== "") {
      filteredList = filteredList.filter((group) =>
        group.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (branchFilter) {
      filteredList = filteredList.filter(
        (group) => group.branch === branchFilter
      );
    }

    setFiltered(filteredList);
  }, [search, groups, branchFilter]);

  return (
    <Screen>
      <TextInput
        style={styles.input}
        placeholder="Search by group name..."
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.filtersRow}>
        <View style={styles.filterBox}>
          <Dropdown
            style={styles.dropdownStyle}
            containerStyle={styles.dropdownContainer}
            data={BRANCHES.map((branch) => ({ label: branch, value: branch }))}
            labelField="label"
            valueField="value"
            placeholder="Branch"
            value={branchFilter}
            onChange={(item) => setBranchFilter(item.value)}
            renderRightIcon={() =>
              branchFilter ? (
                <TouchableOpacity onPress={() => setBranchFilter("")}>
                  <Ionicons name="close-circle" size={18} color="#888" />
                </TouchableOpacity>
              ) : (
                <Ionicons name="chevron-down" size={18} color="#888" />
              )
            }
          />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#d60124"
          style={{ marginTop: 40 }}
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 150 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: "/staff/group/[groupId]",
                  params: { groupId: item.id },
                })
              }
            >
              <Image
                source={{
                  uri: item.photoURL || "https://via.placeholder.com/100",
                }}
                style={styles.avatar}
              />
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.branch}>{item.branch}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  filtersRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  filterBox: {
    flex: 1,
  },
  dropdownStyle: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 38,
    justifyContent: "center",
  },
  dropdownContainer: {
    borderRadius: 10,
    padding: 6,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#ccc",
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  branch: {
    fontSize: 14,
    color: "#888",
  },
  disabledDropdown: {
    backgroundColor: "#eee",
  },
  placeholderDisabled: {
    color: "#aaa",
  },
});
