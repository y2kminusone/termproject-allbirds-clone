// src/components/cartPage/CartPage.jsx
import "./CartPage.css";

function CartPage({
  isOpen,
  onClose,
  cartItems = [],
  onUpdateQty,
  onRemove,
  onPayment,
}) {
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <>
      <div
        className={`cart-overlay ${isOpen ? "show" : ""}`}
        onClick={onClose}
      />

      <div className={`cart-panel ${isOpen ? "open" : ""}`}>
        <div className="cart-header">
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="cart-content">
          {cartItems.length === 0 ? (
            <h3 className="empty">장바구니가 비어있습니다.</h3>
          ) : (
            cartItems.map((item) => (
              <div key={`${item.productId}-${item.size}`} className="cart-item">
                <img src={item.image} className="cart-thumb" />

                <div className="cart-info">
                  <p>{item.name}</p>
                  <p>{item.size}</p>
                  <p>₩{item.price.toLocaleString()}</p>

                  <div className="qty-box">
                    <button onClick={() => onUpdateQty(item, -1)}>-</button>
                    <span>{item.qty}</span>
                    <button
                      onClick={() => onUpdateQty(item, 1)}
                      disabled={item.qty >= item.stock}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button onClick={() => onRemove(item)}>삭제</button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div>
              <span>총액</span>
              <strong>₩{totalPrice.toLocaleString()}</strong>
            </div>
            <button className="payment-btn" onClick={onPayment}>
              결제
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default CartPage;
