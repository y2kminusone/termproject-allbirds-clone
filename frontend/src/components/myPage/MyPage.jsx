import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyPage.css";

function MyPage() {
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/users/me/orders", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("주문내역 조회 실패");
        return res.json();
      })
      .then((data) => setOrderHistory(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mypage-container">
      {/* 좌측 메뉴 */}
      <aside className="mypage-menu">
        <h3>마이페이지</h3>
        <ul>
          <li>회원 정보</li>
          <li className="active">지난 주문 내역</li>
          <li>주문 정보 등록</li>
          <li>올멤버스 혜택</li>
          <li className="logout">로그아웃</li>
        </ul>
      </aside>

      {/* 본문 */}
      <section className="mypage-content">
        <h2>지난 주문 내역</h2>

        {loading && <p>불러오는 중...</p>}
        {!loading && orderHistory.length === 0 && (
          <p className="empty-text">주문 내역이 없습니다.</p>
        )}

        {orderHistory.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-info">
              <p>
                <strong>제품명:</strong> {order.productName}
              </p>
              <p>
                <strong>결제금액:</strong> {order.price.toLocaleString()}원
              </p>
              <p>
                <strong>수량:</strong> {order.quantity}개
              </p>
              <p>
                <strong>결제일:</strong> {order.orderDate}
              </p>
            </div>

            <button
              className={`review-btn ${order.reviewed ? "done" : ""}`}
              disabled={order.reviewed}
              onClick={() =>
                navigate("/review/write", {
                  state: {
                    orderItemId: order.orderItemId,
                    productId: order.productId,
                  },
                })
              }
            >
              {order.reviewed ? "작성완료" : "후기작성"}
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}

export default MyPage;
