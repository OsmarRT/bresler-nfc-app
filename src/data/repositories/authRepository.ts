import { getDb } from "../db";

export type DbUser = {
  id: number;
  email: string;
  password_hash: string;
  role: "admin" | "user";
};

export function findAuthUserByEmail(email: string): DbUser | null {
  const db = getDb();
  const row = db.getFirstSync<any>(
    `
    SELECT au.id, au.email, au.password_hash, r.name as role
    FROM auth_users au
    JOIN roles r ON r.id = au.role_id
    WHERE au.email = ?
    LIMIT 1
    `,
    [email]
  );

  if (!row) return null;

  return {
    id: row.id,
    email: row.email,
    password_hash: row.password_hash,
    role: row.role,
  };
}
