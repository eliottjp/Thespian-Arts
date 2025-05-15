import { TouchableOpacity, Text } from "react-native";

export default function MyButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: "#d60124",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 12,
      }}
    >
      <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
