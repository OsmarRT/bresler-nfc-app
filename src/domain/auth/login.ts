import type { Session } from "./types";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL!;


export async function loginUseCase(input: { email: string; password: string }): Promise<Session> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: input.email.trim().toLowerCase(),
      password: input.password,
    }),
  });

  const text = await res.text();
  if (!res.ok) throw new Error(`Credenciales inválidas (${res.status}): ${text}`);

  const data = JSON.parse(text);

  return {
    user: {
      id: String(data.user.id),
      email: String(data.user.email),
      role: data.user.role, // "admin" | "user"
    },
  };
}
