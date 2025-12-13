import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductPage from "./pages/ProductPage";
import MyPage from "./pages/MyPage";
import ReviewWrite from "./pages/ReviewWrite";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/products/:productId" element={<ProductPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/review/write" element={<ReviewWrite />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
