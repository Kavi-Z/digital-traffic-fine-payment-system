// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authApi, saveAuthData, getStoredUser, logout as doLogout } from "@/lib/api";

interface UserInfo {
  userId: string;
  username: string;
  fullName: string;
  role: "ADMIN" | "SUPER_ADMIN" | "OFFICER";
  district?: string;
}

interface AuthContextType {
  user: UserInfo | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<UserInfo>;
  logout: () => void;
  isAdmin: () => boolean;
  isOfficer: () => boolean;
  isSuperAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage
    const storedToken = localStorage.getItem("jwt_token");
    const storedUser = getStoredUser();
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<UserInfo> => {
    const response = await authApi.login(username, password);
    saveAuthData(response);
    const userInfo: UserInfo = {
      userId: response.userId,
      username: response.username,
      fullName: response.fullName,
      role: response.role,
      district: response.district,
    };
    setToken(response.token);
    setUser(userInfo);
    return userInfo;
  };

  const logout = () => {
    doLogout();
    setUser(null);
    setToken(null);
  };

  const isAdmin = () => user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
  const isSuperAdmin = () => user?.role === "SUPER_ADMIN";
  const isOfficer = () => user?.role === "OFFICER";

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin, isOfficer, isSuperAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};