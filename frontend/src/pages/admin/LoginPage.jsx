import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../auth/AuthContext";
import allbirdsLogo from "../../assets/allbirds.png";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 20% 20%, #f3f4f6, #e5e7eb 30%, #d1d5db 60%);
  color: #111827;
  padding: 24px;
`;

const Card = styled.div`
  background: #ffffff;
  color: #111827;
  padding: 32px 28px;
  border-radius: 18px;
  width: 380px;
  box-shadow: 0 26px 70px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.img`
  display: block;
  width: 160px;
  margin: 0 auto 20px;
`;

const Hint = styled.p`
  margin: 12px 0 0;
  color: #6b7280;
  font-size: 13px;
  line-height: 1.5;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
`;

const Label = styled.label`
  font-weight: 600;
`;

const Input = styled.input`
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 12px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #111827;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  background: #111827;
  color: #ffffff;
  border: none;
  font-weight: 700;
  cursor: pointer;
  margin-top: 8px;
`;

const Error = styled.div`
  color: #dc2626;
  margin-top: 12px;
  font-size: 14px;
`;

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = login(username.trim(), password.trim());
    if (result.success) {
      const next = location.state?.from || "/admin/products";
      navigate(next, { replace: true });
      return;
    }
    setError(result.message || "로그인에 실패했습니다.");
  };

  return (
    <Container>
      <Card>
        <Logo src={allbirdsLogo} alt="Allbirds" />
        <form onSubmit={handleSubmit}>
          <Field>
            <Label htmlFor="username">아이디</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="아이디를 입력하세요"
            />
          </Field>
          <Field>
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
            />
          </Field>
          <Button type="submit">로그인</Button>
          {error && <Error>{error}</Error>}
        </form>
        <Hint>관리자용 기본 계정: admin / admin123</Hint>
      </Card>
    </Container>
  );
}
