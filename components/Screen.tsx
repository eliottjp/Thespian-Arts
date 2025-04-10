import { View } from "react-native";

export default function Screen({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        padding: 16,
        gap: 16,
        backgroundColor: "#f5f5f5",
      }}
    >
      {children}
    </View>
  );
}
