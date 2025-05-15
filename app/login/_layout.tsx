import { Stack, useRouter } from "expo-router";
import { TouchableOpacity, Text } from "react-native";

export default function LoginLayout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="parent"
        options={{
          title: "Sign In",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ paddingHorizontal: 10 }}
            >
              <Text style={{ fontSize: 16 }}>← Back</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="member"
        options={{
          title: "Sign In",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ paddingHorizontal: 10 }}
            >
              <Text style={{ fontSize: 16 }}>← Back</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="setup"
        options={{
          title: "Setup Login",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ paddingHorizontal: 10 }}
            >
              <Text style={{ fontSize: 16 }}>← Back</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="create-account"
        options={{ title: "Create Account" }}
      />
      <Stack.Screen
        name="index"
        options={{
          title: "Login",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
