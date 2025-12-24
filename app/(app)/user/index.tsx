import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { logDelivery } from "../../../src/api/machines";
import { useAuth } from "../../../src/auth/useAuth";
import { readMachineIdFromNfc } from "../../../src/nfc/nfc";

export default function ScanNfcScreen() {
  const { session } = useAuth();
  const [msg, setMsg] = useState("Acérquese al sticker NFC");
  const [lastMachineId, setLastMachineId] = useState<string | null>(null);

  async function onScan() {
    setMsg("Escaneando... acerca el sticker");
    try {
      const machineId = await readMachineIdFromNfc();
      setLastMachineId(machineId);
      setMsg("Escaneado de forma correcta");

      await logDelivery({
        userId: session!.user.id,
        machineId,
        happenedAt: new Date().toISOString(),
      });
    } catch (e: any) {
      setMsg(e?.message ?? "No se pudo leer el NFC");
    }
  }

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>{msg}</Text>
      {!!lastMachineId && <Text style={{ marginTop: 8 }}>MachineId: {lastMachineId}</Text>}

      <Pressable onPress={onScan} style={{ marginTop: 16 }}>
        <Text style={{ color: "blue" }}>Escanear NFC</Text>
      </Pressable>
    </View>
  );
}
