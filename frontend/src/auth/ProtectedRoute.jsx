import { Navigate, Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "./AuthContext";

const Loading = styled.div`
  width: 100%;
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
`;

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading>세션 확인 중...</Loading>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}
