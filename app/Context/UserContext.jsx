import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { initDatabase } from "../DataBase";
import { UserEntity } from "../Entities/UserEntity";
import { importLegacyPersistence } from "../Repositories/LegacyStorageImporter";
import { UserRepository } from "../Repositories/UserRepository";

const UserContext = createContext(null);

function normalizeUsername(username) {
  return typeof username === "string" ? username.trim().toLowerCase() : "";
}

function createUserId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function UserProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  const reloadUsers = async () => {
    const nextUsers = await UserRepository.getUsers();
    const nextCurrentUserId = await UserRepository.getCurrentUserId();
    const validCurrentUserId = nextUsers.some((user) => user.id === nextCurrentUserId)
      ? nextCurrentUserId
      : null;

    setUsers(nextUsers);
    setCurrentUserId(validCurrentUserId);
    return { users: nextUsers, currentUserId: validCurrentUserId };
  };

  useEffect(() => {
    let cancelled = false;

    async function hydrateSession() {
      try {
        await initDatabase();
        await importLegacyPersistence();

        if (!cancelled) {
          await reloadUsers();
        }
      } catch {
        if (!cancelled) {
          setUsers([]);
          setCurrentUserId(null);
        }
      } finally {
        if (!cancelled) {
          setHydrated(true);
        }
      }
    }

    hydrateSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const currentUser = useMemo(() => {
    return users.find((user) => user.id === currentUserId) ?? null;
  }, [currentUserId, users]);

  const registerUser = async (username, password) => {
    const trimmedUsername = username?.trim();

    if (!trimmedUsername || !password) {
      return { ok: false, message: "Preencha usuario e senha." };
    }

    const normalizedUsername = normalizeUsername(trimmedUsername);
    const alreadyExists = users.some((user) => normalizeUsername(user.username) === normalizedUsername)
      || Boolean(await UserRepository.findByUsername(trimmedUsername));

    if (alreadyExists) {
      return { ok: false, message: "Este usuario ja existe." };
    }

    const timestamp = new Date().toISOString();
    const nextUser = new UserEntity({
      id: createUserId(),
      username: trimmedUsername,
      password,
      createdAt: timestamp,
      updatedAt: timestamp
    });

    await UserRepository.createUser(nextUser);
    await UserRepository.setCurrentUserId(nextUser.id);
    setUsers((current) => [...current, nextUser].sort((left, right) => left.username.localeCompare(right.username)));
    setCurrentUserId(nextUser.id);

    return { ok: true, user: nextUser };
  };

  const loginUser = async (username, password) => {
    const normalizedUsername = normalizeUsername(username);
    const matchedUser = users.find(
      (user) => normalizeUsername(user.username) === normalizedUsername && user.password === password
    ) ?? await UserRepository.findByUsername(username);

    if (!matchedUser || matchedUser.password !== password) {
      return { ok: false, message: "Usuario ou senha invalidos." };
    }

    await UserRepository.setCurrentUserId(matchedUser.id);
    setCurrentUserId(matchedUser.id);
    return { ok: true, user: matchedUser };
  };

  const logoutUser = async () => {
    await UserRepository.setCurrentUserId(null);
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
        logoutUser,
        reloadUsers
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
