import { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import { UserService } from "../Service/UserService";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  // Hidratar usuários do banco de dados
  useEffect(() => {
    async function hydrateSession() {
      try {
        // Garantir que o admin existe
        await UserService.ensureAdminExists();
        
        // Carregar todos os usuários
        const allUsers = await UserService.getAll();
        setUsers(allUsers);
        
        // Se não houver usuário atual, usar o admin
        if (!currentUserId && allUsers.length > 0) {
          setCurrentUserId(allUsers[0].id);
        }
      } catch (error) {
        console.error("Erro ao hidratar sessão:", error);
      } finally {
        setHydrated(true);
      }
    }

    hydrateSession();
  }, []);

  const registerUser = async (username, password) => {
    try {
      const exists = await UserService.findByUsername(username);
      
      if (exists) {
        return { ok: false, message: "Usuário já existe." };
      }

      const user = await UserService.create(username, password);
      setUsers((prev) => [...prev, user]);
      setCurrentUserId(user.id);

      return { ok: true, user };
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
      return { ok: false, message: "Erro ao registrar usuário." };
    }
  };

  const loginUser = async (username, password) => {
    try {
      const user = await UserService.findByUsername(username);

      if (!user || user.password !== password) {
        return { ok: false, message: "Usuário ou senha inválidos." };
      }

      setCurrentUserId(user.id);
      return { ok: true, user };
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      return { ok: false, message: "Erro ao fazer login." };
    }
  };

  const logoutUser = () => {
    setCurrentUserId(null);
  };

  const getCurrentUser = () => {
    return users.find((u) => u.id === currentUserId) || null;
  };

  return (
    <UserContext.Provider
      value={{
        users,
        currentUserId,
        hydrated,
        registerUser,
        loginUser,
        logoutUser,
        getCurrentUser
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
