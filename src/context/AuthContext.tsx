// context/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

export interface User {
  id: string;
  nombre: string;
  email: string;
  password: string;
  rol: "administrador" | "turista";
}

interface AuthContextType {
  user?: User;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  registerUser: (user: Omit<User, "id">) => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [users, setUsers] = useState<User[]>([]);

  const login = async (email: string, password: string) => {
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      setUser(found);
      return found;
    }
    return null;
  };

  const logout = () => setUser(undefined);

  const registerUser = async (newUser: Omit<User, "id">) => {
    if (users.find(u => u.email === newUser.email)) return null;
    const userWithId: User = { ...newUser, id: Date.now().toString() };
    setUsers(prev => [...prev, userWithId]);
    setUser(userWithId);
    return userWithId;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, registerUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};
