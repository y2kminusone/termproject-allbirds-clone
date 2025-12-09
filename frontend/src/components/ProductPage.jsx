import { useState } from "react";
import { useParams } from "react-router-dom";
import DetailPage from "./detailPage/detailPage.jsx";
import CartPage from "./cartPage/CartPage.jsx";

function ProductPage() {
  const { productId } = useParams();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (item) => {
    setCartItems((prev) => [...prev, item]);
    setIsCartOpen(true);
  };

  return (
    <>
      {/* 상품 상세 페이지 */}
      <DetailPage productId={productId} onAddToCart={handleAddToCart} />

      {/* 오른쪽 슬라이드 CartPage */}
      <CartPage
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
      />
    </>
  );
}

export default ProductPage;
