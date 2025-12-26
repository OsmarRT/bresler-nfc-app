import { getDb } from "../db";

export type DbUser = {
  id: number;
  rut: string;
  email: string;          // opcional mantenerlo
  password_hash: string;
  role: "admin" | "user";
};

export function findAuthUserByRut(rut: string): DbUser | null {
  const db = getDb();
  const rutNorm = rut.trim().replace(/\./g, "").toUpperCase();

  const row = db.getFirstSync<any>(
    `
    SELECT au.id, au.rut, au.email, au.password_hash, r.name as role
    FROM auth_users au
    JOIN roles r ON r.id = au.role_id
    WHERE au.rut = ?
    LIMIT 1
    `,
    [rutNorm]
  );

  if (!row) return null;

  return {
    id: row.id,
    rut: row.rut,
    email: row.email,
    password_hash: row.password_hash,
    role: row.role,
  };
}
