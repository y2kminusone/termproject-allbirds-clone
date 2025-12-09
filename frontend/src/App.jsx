import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import { AuthProvider } from "./auth/AuthContext";
import { AdminDataProvider } from "./data/AdminDataContext";
import ProductsPage from "./pages/admin/ProductsPage";
import NewProductPage from "./pages/admin/NewProductPage";
import StatisticsPage from "./pages/admin/StatisticsPage";
import LoginPage from "./pages/admin/LoginPage";

function App() {
  return (
    <AuthProvider>
      <AdminDataProvider>
        <Routes>
          <Route path="/admin/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/products" element={<ProductsPage />} />
              <Route path="/admin/products/new" element={<NewProductPage />} />
              <Route path="/admin/statistics" element={<StatisticsPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/admin/products" replace />} />
        </Routes>
      </AdminDataProvider>
    </AuthProvider>
  );
}

export default App;
