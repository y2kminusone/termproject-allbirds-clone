import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DetailPage from "../components/detailPage/DetailPage";
import CartPage from "../components/cartPage/CartPage";
import Review from "../components/review/Review";

function ProductPage() {
  const { productId } = useParams();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetch("/api/cart", { credentials: "include" })
      .then((res) => res.json())
      .then(setCartItems)
      .catch(console.error);
  }, []);

  const handleAddToCart = async (item) => {
    const exist = cartItems.find(
      (c) => c.productId === item.productId && c.size === item.size
    );

    if (exist) {
      handleUpdateQty(exist, 1);
      return;
    }

    const res = await fetch("/api/cart", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });

    const saved = await res.json();
    setCartItems((prev) => [...prev, saved]);
    setIsCartOpen(true);
  };

  const handleUpdateQty = async (item, diff) => {
    const nextQty = item.qty + diff;

    if (nextQty < 1) {
      handleRemove(item);
      return;
    }
    if (nextQty > item.stock) return;

    await fetch(`/api/cart/${item.productId}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ diff }),
    });

    setCartItems((prev) =>
      prev.map((c) =>
        c.productId === item.productId && c.size === item.size
          ? { ...c, qty: nextQty }
          : c
      )
    );
  };

  const handleRemove = async (item) => {
    await fetch(`/api/cart/${item.productId}`, {
      method: "DELETE",
      credentials: "include",
    });

    setCartItems((prev) =>
      prev.filter(
        (c) => !(c.productId === item.productId && c.size === item.size)
      )
    );
  };

  const handlePayment = async () => {
    await fetch("/api/cart", {
      method: "DELETE",
      credentials: "include",
    });

    setCartItems([]);
    setIsCartOpen(false);
  };

  return (
    <>
      <DetailPage
        productId={productId}
        cartItems={cartItems}
        onAddToCart={handleAddToCart}
      />

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
