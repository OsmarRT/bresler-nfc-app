import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { registerMachine } from "../../../src/api/machines";
import { writeMachineIdToNfc } from "../../../src/nfc/nfc";

const COMUNAS = ["Puente Alto", "Santiago", "La Florida", "Maipú", "Ñuñoa"]; // luego lo completas

export default function AdminHome() {
  const [machineId, setMachineId] = useState("");
  const [cliente, setCliente] = useState("");
  const [comuna, setComuna] = useState(COMUNAS[0]);
  const [ciudad, setCiudad] = useState("Santiago");
  const [status, setStatus] = useState<string | null>(null);

  async function onWrite() {
    setStatus("Acerca el NFC para grabar...");
    // 1) grabar tag (solo ID)
    await writeMachineIdToNfc(machineId.trim());
    setStatus("NFC grabado. Guardando en servidor...");

    // 2) guardar metadata en backend
    await registerMachine({
      machineId: machineId.trim(),
      cliente: cliente.trim(),
      comuna: comuna.trim(),
      ciudad: ciudad.trim(),
    });

    setStatus("Listo: máquina registrada.");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin: Registrar máquina</Text>

      <TextInput style={styles.input} placeholder="ID de la máquina" value={machineId} onChangeText={setMachineId} />
      <TextInput style={styles.input} placeholder="Cliente" value={cliente} onChangeText={setCliente} />
      <TextInput style={styles.input} placeholder="Comuna (ej: Puente Alto)" value={comuna} onChangeText={setComuna} />
      <TextInput style={styles.input} placeholder="Ciudad" value={ciudad} onChangeText={setCiudad} />

      <Pressable style={styles.button} onPress={onWrite} disabled={!machineId || !cliente || !comuna || !ciudad}>
        <Text style={styles.buttonText}>Grabar NFC + Guardar</Text>
      </Pressable>

      {!!status && <Text style={{ marginTop: 12 }}>{status}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 12, marginBottom: 10 },
  button: { backgroundColor: "#111827", padding: 14, borderRadius: 10, alignItems: "center" },
  buttonText: { color: "white", fontWeight: "700" },
});
