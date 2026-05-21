import { UserEntity } from "../Entities/UserEntity";
import { executeSql, getAll, getFirst, runTransaction } from "../DataBase";

function mapUser(row) {
  if (!row) {
    return null;
  }

  return new UserEntity({
    id: row.id,
    username: row.username,
    password: row.password,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  });
}

export const UserRepository = {
  async getUsers() {
    const rows = await getAll("SELECT * FROM users ORDER BY username COLLATE NOCASE ASC");
    return rows.map(mapUser);
  },

  async findByUsername(username) {
    const row = await getFirst(
      "SELECT * FROM users WHERE username = ? COLLATE NOCASE LIMIT 1",
      [username?.trim() ?? ""]
    );
    return mapUser(row);
  },

  async createUser({ id, username, password, createdAt, updatedAt }) {
    await executeSql(
      `INSERT INTO users (id, username, password, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?)`,
      [id, username, password, createdAt, updatedAt]
    );

    return mapUser({ id, username, password, createdAt, updatedAt });
  },

  async upsertUser(user) {
    await executeSql(
      `INSERT INTO users (id, username, password, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
        username = excluded.username,
        password = excluded.password,
        updatedAt = excluded.updatedAt`,
      [user.id, user.username, user.password, user.createdAt, user.updatedAt]
    );
  },

  async getCurrentUserId() {
    const row = await getFirst("SELECT currentUserId FROM sessions WHERE id = ?", ["default"]);
    return row?.currentUserId ?? null;
  },

  async setCurrentUserId(currentUserId) {
    const timestamp = new Date().toISOString();
    await executeSql(
      `INSERT INTO sessions (id, currentUserId, createdAt, updatedAt)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
        currentUserId = excluded.currentUserId,
        updatedAt = excluded.updatedAt`,
      ["default", currentUserId, timestamp, timestamp]
    );
  },

  async importUsers(users = [], currentUserId = null) {
    await runTransaction(async (db) => {
      for (const user of users) {
        await db.runAsync(
          `INSERT OR IGNORE INTO users (id, username, password, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?)`,
          [user.id, user.username, user.password, user.createdAt, user.updatedAt]
        );
      }

      if (currentUserId && users.some((user) => user.id === currentUserId)) {
        const timestamp = new Date().toISOString();
        await db.runAsync(
          `INSERT INTO sessions (id, currentUserId, createdAt, updatedAt)
           VALUES (?, ?, ?, ?)
           ON CONFLICT(id) DO UPDATE SET
            currentUserId = excluded.currentUserId,
            updatedAt = excluded.updatedAt`,
          ["default", currentUserId, timestamp, timestamp]
        );
      }
    });
  }
};
