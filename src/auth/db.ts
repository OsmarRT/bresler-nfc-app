import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

export function getDb() {
  if (!db) db = SQLite.openDatabaseSync("app.db");
  return db;
}
