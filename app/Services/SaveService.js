export class SaveService {
  static serialize(payload) {
    return JSON.stringify(payload);
  }

  static deserialize(raw, fallback = null) {
    try {
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  static exportSnapshot(payload) {
    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      payload
    };
  }

  static importSnapshot(raw, fallback = null) {
    const parsed = typeof raw === "string" ? this.deserialize(raw, fallback) : raw;
    return parsed?.payload ?? fallback;
  }
}
