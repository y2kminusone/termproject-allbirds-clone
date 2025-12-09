import { createContext, useContext, useMemo, useState } from "react";

const AdminDataContext = createContext(null);

const placeholderImage =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='90' viewBox='0 0 140 90'><rect width='140' height='90' fill='%23e6e6e6'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-size='12' font-family='Arial'>Allbirds</text></svg>";

const initialProducts = [
  {
    id: "p1",
    name: "Breeze Runner",
    summary: "가볍고 통기성 좋은 러닝화",
    category: "라이프스타일",
    price: 129000,
    discountRate: 0.1,
    sizes: ["245", "250", "255", "260"],
    thumbnail: placeholderImage,
  },
  {
    id: "p2",
    name: "Wool Lounger",
    summary: "부드럽고 따뜻한 슬립온",
    category: "슬립온",
    price: 119000,
    discountRate: 0.05,
    sizes: ["250", "255", "265"],
    thumbnail: placeholderImage,
  },
  {
    id: "p3",
    name: "Trail Mizzle",
    summary: "방수 기능 트레일 슈즈",
    category: "라이프스타일",
    price: 159000,
    discountRate: 0,
    sizes: ["255", "260", "270"],
    thumbnail: placeholderImage,
  },
];

const initialOrders = [
  { id: "o1", productId: "p1", quantity: 3, unitPrice: 129000, discountRate: 0.1, date: "2025-10-20" },
  { id: "o2", productId: "p2", quantity: 2, unitPrice: 119000, discountRate: 0.05, date: "2025-10-21" },
  { id: "o3", productId: "p3", quantity: 4, unitPrice: 159000, discountRate: 0.15, date: "2025-10-25" },
  { id: "o4", productId: "p1", quantity: 1, unitPrice: 129000, discountRate: 0.1, date: "2025-11-01" },
];

export function AdminDataProvider({ children }) {
  const [products, setProducts] = useState(initialProducts);
  const [orders] = useState(initialOrders);

  const addProduct = (payload) => {
    const id = `p-${Date.now()}`;
    const newProduct = {
      id,
      thumbnail: payload.thumbnail || placeholderImage,
      discountRate: Number(payload.discountRate) || 0,
      ...payload,
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (productId, updates) => {
    setProducts((prev) =>
      prev.map((product) => (product.id === productId ? { ...product, ...updates } : product)),
    );
  };

  const getStatistics = (range = {}) => {
    const { startDate, endDate } = range;
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const statsMap = new Map();
    products.forEach((product) => {
      statsMap.set(product.id, {
        product,
        units: 0,
        revenue: 0,
      });
    });

    orders.forEach((order) => {
      const orderDate = new Date(order.date);
      if (start && orderDate < start) return;
      if (end && orderDate > end) return;

      const entry = statsMap.get(order.productId);
      if (!entry) return;
      const discountedPrice = order.unitPrice * (1 - order.discountRate);
      entry.units += order.quantity;
      entry.revenue += Math.round(order.quantity * discountedPrice);
    });

    return Array.from(statsMap.values());
  };

  const value = useMemo(
    () => ({ products, addProduct, updateProduct, getStatistics }),
    [products],
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
