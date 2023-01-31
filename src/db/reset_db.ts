import sqlite3 from "sqlite3";
import {Database} from "sqlite";
import path from "path";
import fs from "fs";
import {getMode} from "@/lib/get_mode";

/**
 * Initialize database (development/test environment only)
 * */
export const resetDB = async (
  db: Database<sqlite3.Database, sqlite3.Statement>
): Promise<void> => {
  db.getDatabaseInstance().serialize(() => {
    deleteAllTable(db);
    createAllTable(db);
    insertInitialRecords(db);
  });
};

const deleteAllTable = (
  db: Database<sqlite3.Database, sqlite3.Statement>
): void => {
  const ENTITY_TYPES = ["users", "posts", "likes"] as const;
  for (const entityType of ENTITY_TYPES) {
    db.exec(`DROP TABLE IF EXISTS ${entityType}`);
    console.log(`successfully dropped ${entityType} table`);
  }
};

const createAllTable = (
  db: Database<sqlite3.Database, sqlite3.Statement>
): void => {
  executeSqlFile(db, path.join(path.resolve(), `src/db/.schema.sql`));
  console.log(`successfully created tables`);
};

const insertInitialRecords = (
  db: Database<sqlite3.Database, sqlite3.Statement>
): void => {
  executeSqlFile(db, path.join(path.resolve(), `src/db/.${getMode()}.sql`));
  console.log(`successfully inserted records`);
};

const executeSqlFile = (
  db: Database<sqlite3.Database, sqlite3.Statement>,
  filepath: string
): void => {
  const sqlFile = fs.readFileSync(filepath, "utf8");
  const statements = sqlFile.split("\n");
  for (const statement of statements) {
    db.exec(statement);
  }
};
