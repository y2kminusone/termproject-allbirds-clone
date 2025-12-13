import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import apiClient from "../lib/apiClient";

const AdminDataContext = createContext(null);

export function AdminDataProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    if (!isAuthenticated) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.get("/api/admin/products");
      setProducts(res.data.products || []);
      setError(null);
    } catch (err) {
      const message = err.response?.data?.message || "상품을 불러오지 못했습니다.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = useCallback(
    async (payload) => {
      const res = await apiClient.post("/api/admin/products", payload);
      await fetchProducts();
      return res.data.product;
    },
    [fetchProducts],
  );

  const updateProduct = useCallback(
    async (productId, updates) => {
      const res = await apiClient.put(`/api/admin/products/${productId}`, updates);
      await fetchProducts();
      return res.data.product;
    },
    [fetchProducts],
  );

  const getStatistics = useCallback(async (range = {}) => {
    const params = new URLSearchParams();
    if (range.startDate) params.set("from", range.startDate);
    if (range.endDate) params.set("to", range.endDate);
    const query = params.toString() ? `?${params.toString()}` : "";
    const res = await apiClient.get(`/api/admin/sales${query}`);
    return res.data.sales || [];
  }, []);

  const value = useMemo(
    () => ({
      products,
      loading,
      error,
      refresh: fetchProducts,
      addProduct,
      updateProduct,
      getStatistics,
    }),
    [products, loading, error, fetchProducts, addProduct, updateProduct, getStatistics],
  );

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx) {
    throw new Error("useAdminData must be used within AdminDataProvider");
  }
  return ctx;
}
