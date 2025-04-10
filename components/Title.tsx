import { Text } from "react-native";

export default function Title({ children }: { children: string }) {
  return (
    <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
      {children}
    </Text>
  );
}
