import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../src/auth/useAuth";

export default function AppLayout() {
  const { session, isReady } = useAuth();

  if (!isReady) return null;

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }


  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="admin/index" />
      <Stack.Screen name="user/index" />
    </Stack>
  );
}
