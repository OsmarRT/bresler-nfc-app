import { getDb } from "./db";

// Migración simple (v1). Si ya tienes otro sistema de migraciones, intégralo ahí.
export async function ensureMigrations() {
  const db = getDb();

  db.execSync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS auth_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rut TEXT,                    -- NUEVO (puede ser NULL al inicio)
      email TEXT NOT NULL UNIQUE,  -- puedes dejarlo UNIQUE si quieres
      password_hash TEXT NOT NULL,
      role_id INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (role_id) REFERENCES roles(id)
    );
  `);

  // Si la tabla ya existía antes, añade la columna rut (si no existe).
  // SQLite no tiene "ADD COLUMN IF NOT EXISTS" en todas las versiones, así que usamos try/catch.
  try {
    db.execSync(`ALTER TABLE auth_users ADD COLUMN rut TEXT;`);
  } catch (e) {
    // Ignorar si ya existe
  }

  // Asegura unicidad de RUT (en SQLite se puede con un índice UNIQUE)
  db.execSync(`CREATE UNIQUE INDEX IF NOT EXISTS ux_auth_users_rut ON auth_users(rut);`);

  // Seed roles
  db.execSync(`
    INSERT OR IGNORE INTO roles (name) VALUES ('admin');
    INSERT OR IGNORE INTO roles (name) VALUES ('user');
  `);

  // Seed admin por defecto (ejemplo)
  // Password: admin123
  db.execSync(`
    INSERT OR IGNORE INTO auth_users (rut, email, password_hash, role_id)
    VALUES (
      '12345678-5',
      'admin@demo.cl',
      '$2a$10$uD/0bQWmEo4dO2EJ0x7Y..oO0u3lq6h7n9d9qgQm9p7j4v5v6mZq2',
      (SELECT id FROM roles WHERE name='admin')
    );
  `);
}
