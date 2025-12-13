import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import MainPage from "./components/MainPage";
import ProductPage from "./components/ProductPage";
import MyPage from "./components/myPage/MyPage";
import ReviewWrite from "./components/reviewWrite/ReviewWrite";
import CartPage from "./components/cartPage/CartPage";
import Header from "./components/header/Header";

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <BrowserRouter>
      {/* ✅ Header에 열기 함수 전달 */}
      <Header onCartClick={() => setIsCartOpen(true)} />

      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route
          path="/products/:productId"
          element={<ProductPage onCartOpen={() => setIsCartOpen(true)} />}
        />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/review/write" element={<ReviewWrite />} />
      </Routes>

      {/* ✅ CartPage는 전역 */}
      <CartPage isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </BrowserRouter>
  );
}

export default App;
