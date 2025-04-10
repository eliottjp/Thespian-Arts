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

export default function MemberListPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [groupFilter, setGroupFilter] = useState("");
  const [groupOptions, setGroupOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMembers = async () => {
      const snap = await getDocs(collection(db, "members"));
      const results = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMembers(results);
      setFiltered(results);
      setLoading(false);
    };

    const fetchGroups = async () => {
      const snap = await getDocs(collection(db, "groups"));
      const allGroups = snap.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        branch: doc.data().branch,
      }));

      setGroupOptions(allGroups);
    };

    fetchMembers();
    fetchGroups();
  }, []);

  useEffect(() => {
    let filteredList = [...members];

    if (search.trim() !== "") {
      filteredList = filteredList.filter((m) =>
        m.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (branchFilter) {
      filteredList = filteredList.filter((m) => m.branch === branchFilter);
    }

    if (groupFilter) {
      filteredList = filteredList.filter((m) =>
        m.groups?.includes(groupFilter)
      );
    }

    setFiltered(filteredList);
  }, [search, members, branchFilter, groupFilter]);

  return (
    <Screen>
      <TextInput
        style={styles.input}
        placeholder="Search by name..."
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

        <View style={styles.filterBox}>
          <Dropdown
            style={[
              styles.dropdownStyle,
              branchFilter ? {} : styles.disabledDropdown,
            ]}
            data={
              branchFilter
                ? groupOptions
                    .filter((g) => g.branch === branchFilter)
                    .map((g) => ({ label: g.name, value: g.id }))
                : []
            }
            labelField="label"
            valueField="value"
            placeholder="Group"
            value={groupFilter}
            onChange={(item) => setGroupFilter(item.value)}
            placeholderStyle={
              !branchFilter ? styles.placeholderDisabled : undefined
            }
            editable={!!branchFilter}
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
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: "/staff/search/[childId]",
                  params: { childId: item.id },
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
  disabledDropdown: {
    backgroundColor: "#eee",
  },
  placeholderDisabled: {
    color: "#aaa",
  },
});
