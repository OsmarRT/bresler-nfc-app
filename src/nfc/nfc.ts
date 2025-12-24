import NfcManager, { Ndef, NfcTech } from "react-native-nfc-manager";

export async function nfcStart() {
  const supported = await NfcManager.isSupported();
  if (!supported) throw new Error("Este teléfono no soporta NFC");

  await NfcManager.start();

  const enabled = await NfcManager.isEnabled();
  if (!enabled) throw new Error("NFC está desactivado. Actívalo en Ajustes.");
}


export async function writeMachineIdToNfc(machineId: string) {
  await nfcStart();

  try {
    await NfcManager.requestTechnology(NfcTech.Ndef);

    const bytes = Ndef.encodeMessage([Ndef.textRecord(machineId)]);
    if (!bytes) throw new Error("No se pudo codificar NDEF");

    await NfcManager.ndefHandler.writeNdefMessage(bytes);
  } finally {
    NfcManager.cancelTechnologyRequest().catch(() => null);
  }
}

export async function readMachineIdFromNfc(): Promise<string> {
  await nfcStart();

  try {
    await NfcManager.requestTechnology(NfcTech.Ndef);
    const tag = await NfcManager.getTag();

    const ndefMessage = (tag as any)?.ndefMessage;
    if (!ndefMessage?.length) throw new Error("El tag no contiene NDEF");

    // Primer record como texto
    const record = ndefMessage[0];
    const payload = record?.payload;
    if (!payload) throw new Error("NDEF inválido");

    const decoded = Ndef.text.decodePayload(payload);
    return decoded;
  } finally {
    NfcManager.cancelTechnologyRequest().catch(() => null);
  }
}
