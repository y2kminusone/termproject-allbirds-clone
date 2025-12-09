import "./CartPage.css";
import { useState } from "react";

function CartPage({ isOpen, onClose, cartItems = [], onUpdateQty, onRemove }) {
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <>
      <div
        className={`cart-overlay ${isOpen ? "show" : ""}`}
        onClick={onClose}
      ></div>

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
            cartItems.map((item, i) => (
              <div key={i} className="cart-item">
                <img src={item.image} alt="" className="cart-thumb" />

                <div className="cart-info">
                  <p className="cart-name">{item.name}</p>
                  <p className="cart-option">
                    {item.color ?? "내추럴 블랙"} · {item.size}
                  </p>
                  <p className="cart-price">₩{item.price.toLocaleString()}</p>

                  <div className="qty-box">
                    <button onClick={() => onUpdateQty(item, item.qty - 1)}>
                      -
                    </button>
                    <span>{item.qty}</span>
                    <button onClick={() => onUpdateQty(item, item.qty + 1)}>
                      +
                    </button>
                  </div>
                </div>

                <button className="delete-btn" onClick={() => onRemove(item)}>
                  <img className="trash" src="./img/trash.png" />
                </button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="total-row">
              <span>총액</span>
              <span className="total-price">
                ₩{totalPrice.toLocaleString()}
              </span>
            </div>

            <button className="payment-btn">결제</button>
          </div>
        )}
      </div>
    </>
  );
}

export default CartPage;
