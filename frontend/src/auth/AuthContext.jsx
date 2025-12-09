import { createContext, useContext, useEffect, useMemo, useState } from "react";
import apiClient from "../lib/apiClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await apiClient.get("/api/admin/session");
        if (res.data?.authenticated) {
          setUser(res.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await apiClient.post("/api/admin/login", { email, password });
      setUser(res.data.user);
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || "아이디 또는 비밀번호가 올바르지 않습니다.";
      setUser(null);
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await apiClient.post("/api/admin/logout");
    } catch (error) {
      // ignore logout errors
    }
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,
      login,
      logout,
    }),
    [user, loading],
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
