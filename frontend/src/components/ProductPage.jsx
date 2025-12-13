import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DetailPage from "../components/detailPage/DetailPage";
import CartPage from "../components/cartPage/CartPage";
import Review from "../components/review/Review";

const USER_ID = 1; // ⚠️ 로그인 붙으면 여기 제거

function ProductPage() {
  const { productId } = useParams();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetch(`/api/cart?userId=${USER_ID}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setCartItems(data.items))
      .catch(console.error);
  }, []);

  const handleAddToCart = async ({ productId, size }) => {
    const res = await fetch(`/api/cart?userId=${USER_ID}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        size,
        quantity: 1,
      }),
    });

    const data = await res.json();
    setCartItems(data.items);
    setIsCartOpen(true);
  };

  const handleUpdateQty = async (item, diff) => {
    const nextQty = item.quantity + diff;
    if (nextQty < 1) return;

    const res = await fetch(`/api/cart/${item.cartItemId}?userId=${USER_ID}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: nextQty }),
    });

    const data = await res.json();
    setCartItems(data.items);
  };

  const handleRemove = async (item) => {
    const res = await fetch(`/api/cart/${item.cartItemId}?userId=${USER_ID}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await res.json();
    setCartItems(data.items);
  };

  const handlePayment = async () => {
    await fetch(`/api/cart?userId=${USER_ID}`, {
      method: "DELETE",
      credentials: "include",
    });

    setCartItems([]);
    setIsCartOpen(false);
  };

  return (
    <>
      <DetailPage productId={productId} onAddToCart={handleAddToCart} />

      <Review productId={productId} />

      <CartPage
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemove}
        onPayment={handlePayment}
      />
    </>
  );
}

export default ProductPage;
