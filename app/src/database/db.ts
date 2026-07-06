import Database from "@tauri-apps/plugin-sql";

class DbService {
  private instance: Database | null = null;
  private readonly dbName = "sqlite:streaklab.db";

  /**
   * Returns the database connection singleton.
   * Lazily loads the database on the first request.
   */
  async getDb(): Promise<Database> {
    if (!this.instance) {
      this.instance = await Database.load(this.dbName);
      await this.instance.execute("PRAGMA foreign_keys = ON;");
    }
    return this.instance;
  }

  /**
   * Executes a query that doesn't return rows (INSERT, UPDATE, DELETE).
   */
  async execute(query: string, values: any[] = []): Promise<any> {
    const db = await this.getDb();
    return db.execute(query, values);
  }

  /**
   * Executes a query that returns rows (SELECT).
   */
  async select<T>(query: string, values: any[] = []): Promise<T> {
    const db = await this.getDb();
    return db.select<T>(query, values);
  }
}

export const dbService = new DbService();
