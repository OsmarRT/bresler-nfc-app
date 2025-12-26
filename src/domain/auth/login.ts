import type { Session } from "./types";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL!;

function normalizeRut(input: string) {
  return input.trim().replace(/\./g, "").toUpperCase();
}

export async function loginUseCase(input: { rut: string; password: string }): Promise<Session> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      rut: normalizeRut(input.rut),
      password: input.password,
    }),
  });

  const text = await res.text();
  if (!res.ok) throw new Error(`Credenciales inválidas (${res.status}): ${text}`);

  const data = JSON.parse(text);

  return {
    user: {
      id: String(data.user.id),
      rut: String(data.user.rut),
      email: String(data.user.email), // opcional si el backend lo devuelve
      role: data.user.role, // "admin" | "user"
    },
  };
}
