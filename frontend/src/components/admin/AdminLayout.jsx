import { NavLink, Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../auth/AuthContext";
import allbirdsLogo from "../../assets/allbirds.png";

const Shell = styled.div`
  min-height: 100vh;
  background: #f6f7fb;
  color: #1f1f1f;
  font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 5;
`;

const Brand = styled.img`
  height: 28px;
  width: auto;
`;

const Menu = styled.nav`
  display: flex;
  align-items: center;
  gap: 16px;

  a {
    padding: 8px 12px;
    border-radius: 8px;
    color: #1f2937;
    text-decoration: none;
    font-weight: 600;
  }

  a.active {
    background: #111827;
    color: #ffffff;
  }
`;

const LogoutButton = styled.button`
  border: 1px solid #111827;
  background: transparent;
  color: #111827;
  padding: 8px 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: #111827;
    color: #ffffff;
  }
`;

const Page = styled.main`
  max-width: 1100px;
  padding: 32px;
  margin: 0 auto;
`;

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <Shell>
      <Header>
        <Brand src={allbirdsLogo} alt="Allbirds" />
        <Menu>
          <NavLink to="/admin/products" end>
            상품관리
          </NavLink>
          <NavLink to="/admin/products/new">상품등록</NavLink>
          <NavLink to="/admin/statistics">판매현황</NavLink>
          <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
        </Menu>
      </Header>

      <Page>
        <Outlet />
      </Page>
    </Shell>
  );
}
