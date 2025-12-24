import { postJson } from "./http";

export function registerMachine(input: {
  machineId: string;
  cliente: string;
  comuna: string;
  ciudad: string;
}) {
  return postJson("/machines", input);
}

export function logDelivery(input: {
  userId: string;
  machineId: string;
  happenedAt: string; // ISO
}) {
  return postJson("/deliveries", input);
}
