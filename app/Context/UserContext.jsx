import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { UserEntity } from "../Entities/UserEntity";

const STORAGE_KEY = "tokusatsu-chronicle.user-session";
const UserContext = createContext(null);
const DEFAULT_ADMIN_USER = new UserEntity({
  id: "seed-admin-user",
  username: "adm",
  password: "adm123",
  createdAt: "2026-04-29T00:00:00.000Z",
  updatedAt: "2026-04-29T00:00:00.000Z"
});

function normalizeUsername(username) {
  return typeof username === "string" ? username.trim().toLowerCase() : "";
}

function sanitizeUser(user) {
  if (!user || typeof user.username !== "string" || typeof user.password !== "string") {
    return null;
  }

  const trimmedUsername = user.username.trim();

  if (!trimmedUsername || !user.password) {
    return null;
  }

  return new UserEntity({
    id: user.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    username: trimmedUsername,
    password: user.password,
    createdAt: user.createdAt || new Date().toISOString(),
    updatedAt: user.updatedAt || new Date().toISOString()
  });
}

function ensureAdminUser(users) {
  const normalizedUsers = users.map(sanitizeUser).filter(Boolean).map((user) => {
    if (normalizeUsername(user.username) !== "adm") {
      return user;
    }

    return new UserEntity({
      id: DEFAULT_ADMIN_USER.id,
      username: DEFAULT_ADMIN_USER.username,
      password: DEFAULT_ADMIN_USER.password,
      createdAt: user.createdAt ?? DEFAULT_ADMIN_USER.createdAt,
      updatedAt: DEFAULT_ADMIN_USER.updatedAt
    });
  });

  const hasAdmin = normalizedUsers.some((user) => normalizeUsername(user.username) === "adm");

  if (hasAdmin) {
    return normalizedUsers;
  }

  return [...normalizedUsers, DEFAULT_ADMIN_USER];
}

export function UserProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    async function hydrateSession() {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);

        if (!raw) {
          setUsers([DEFAULT_ADMIN_USER]);
          setCurrentUserId(null);
          return;
        }

        const parsed = JSON.parse(raw);
        const nextUsers = ensureAdminUser(Array.isArray(parsed?.users) ? parsed.users : []);
        const nextCurrentUserId = nextUsers.some((user) => user.id === parsed?.currentUserId)
          ? parsed.currentUserId
          : null;

        setUsers(nextUsers);
        setCurrentUserId(nextCurrentUserId);
      } catch {
        setUsers([DEFAULT_ADMIN_USER]);
        setCurrentUserId(null);
      } finally {
        setHydrated(true);
      }
    }

    hydrateSession();
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          users: ensureAdminUser(users),
          currentUserId
        })
    ).catch(() => {});
  }, [hydrated, users, currentUserId]);

  const currentUser = useMemo(() => {
    return users.find((user) => user.id === currentUserId) ?? null;
  }, [currentUserId, users]);

  const registerUser = (username, password) => {
    const trimmedUsername = username?.trim();

    if (!trimmedUsername || !password) {
      return { ok: false, message: "Preencha usuario e senha." };
    }

    const normalizedUsername = normalizeUsername(trimmedUsername);
    const alreadyExists = users.some((user) => normalizeUsername(user.username) === normalizedUsername);

    if (alreadyExists) {
      return { ok: false, message: "Este usuario ja existe." };
    }

    const timestamp = new Date().toISOString();
    const nextUser = new UserEntity({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      username: trimmedUsername,
      password,
      createdAt: timestamp,
      updatedAt: timestamp
    });

    setUsers((current) => [...current, nextUser]);
    setCurrentUserId(nextUser.id);

    return { ok: true, user: nextUser };
  };

  const loginUser = (username, password) => {
    const normalizedUsername = normalizeUsername(username);
    const matchedUser = users.find(
        (user) => normalizeUsername(user.username) === normalizedUsername && user.password === password
    );

    if (!matchedUser) {
      return { ok: false, message: "Usuario ou senha invalidos." };
    }

    setCurrentUserId(matchedUser.id);
    return { ok: true, user: matchedUser };
  };

  const logoutUser = () => {
    setCurrentUserId(null);
  };

  return (
      <UserContext.Provider
          value={{
            hydrated,
            users,
            currentUser,
            isAuthenticated: Boolean(currentUser),
            registerUser,
            loginUser,
            logoutUser
          }}
      >
        {children}
      </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used inside UserProvider.");
  }

  return context;
}
