import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuth } from "../../src/auth/useAuth";

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onLogin() {
    setError(null);
    setLoading(true);
    try {
      const session = await signIn(email.trim().toLowerCase(), password);

      // Redirección por rol
      if (session.user.role === "admin") {
        router.replace("/(app)/admin");
      } else {
        router.replace("/(app)/user");
      }
    } catch (e: any) {
      setError(e?.message ?? "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>

      <TextInput
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
      />

      {!!error && <Text style={styles.error}>{error}</Text>}

      <Pressable style={styles.button} onPress={onLogin} disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? "Ingresando..." : "Entrar"}
        </Text>
      </Pressable>

      <Text style={styles.hint}>
        Nota: este login usa SQLite local. Para producción, conviene backend + token.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#111827",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "white", fontWeight: "700" },
  error: { color: "#b91c1c", marginBottom: 8 },
  hint: { marginTop: 16, color: "#6b7280", fontSize: 12 },
});
