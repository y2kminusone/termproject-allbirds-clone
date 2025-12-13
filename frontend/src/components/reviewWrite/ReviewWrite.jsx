import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./ReviewWrite.css";

function ReviewWrite() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const { orderItemId, productId } = state || {};

  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  if (!orderItemId || !productId) {
    return <p>잘못된 접근입니다.</p>;
  }

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert("리뷰 내용을 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          orderItemId,
          rating,
          content,
        }),
      });

      if (!res.ok) throw new Error("리뷰 작성 실패");

      alert("리뷰가 등록되었습니다.");
      navigate("/mypage");
    } catch (err) {
      console.error(err);
      alert("리뷰 등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-write-container">
      <h2>후기 작성</h2>

      {/* 별점 */}
      <div className="rating">
        {[1, 2, 3, 4, 5].map((num) => (
          <span
            key={num}
            className={num <= rating ? "star active" : "star"}
            onClick={() => setRating(num)}
          >
            ★
          </span>
        ))}
      </div>

      {/* 내용 */}
      <textarea
        placeholder="상품에 대한 후기를 작성해주세요."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={500}
      />

      <div className="actions">
        <button className="cancel" onClick={() => navigate(-1)}>
          취소
        </button>
        <button className="submit" onClick={handleSubmit} disabled={loading}>
          {loading ? "등록 중..." : "등록하기"}
        </button>
      </div>
    </div>
  );
}

export default ReviewWrite;
