import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const ADMIN_ACCOUNT = {
  username: "admin",
  password: "admin123",
};

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("admin-authenticated") === "true";
  });

  const login = (username, password) => {
    if (username === ADMIN_ACCOUNT.username && password === ADMIN_ACCOUNT.password) {
      localStorage.setItem("admin-authenticated", "true");
      setIsAuthenticated(true);
      return { success: true };
    }

    return { success: false, message: "아이디 또는 비밀번호가 올바르지 않습니다." };
  };

  const logout = () => {
    localStorage.removeItem("admin-authenticated");
    setIsAuthenticated(false);
  };

  const value = useMemo(
    () => ({ isAuthenticated, login, logout }),
    [isAuthenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
