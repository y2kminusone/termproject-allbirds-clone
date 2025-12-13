import { useEffect, useState } from "react";
import "./Review.css";

function Review({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productId) return;

    fetch(`/api/products/${productId}/reviews`)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch(console.error);
  }, [productId]);

  const submitReview = async () => {
    if (!content.trim()) {
      alert("리뷰 내용을 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          rating,
          content,
        }),
      });

      const res = await fetch(`/api/products/${productId}/reviews`);
      const data = await res.json();
      setReviews(data);

      setContent("");
      setRating(5);
    } catch (err) {
      console.error(err);
      alert("리뷰 작성 실패");
    } finally {
      setLoading(false);
    }
  };

  const average =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="review-wrapper">
      <div className="review-summary">
        <div className="score">{average.toFixed(1)}</div>
        <div className="stars">
          {"★".repeat(Math.round(average))}
          <span className="count">({reviews.length})</span>
        </div>
      </div>

      <div className="review-form">
        <h3>리뷰 작성</h3>

        <select value={rating} onChange={(e) => setRating(+e.target.value)}>
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n}점
            </option>
          ))}
        </select>

        <textarea
          placeholder="리뷰를 작성해주세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button onClick={submitReview} disabled={loading}>
          {loading ? "등록 중..." : "등록"}
        </button>
      </div>

      <div className="review-list">
        {reviews.length === 0 && (
          <p className="empty-text">아직 작성된 리뷰가 없습니다.</p>
        )}

        {reviews.map((r) => (
          <div key={r.id} className="review-item">
            <div className="review-header">
              <span className="review-name">{r.writerName ?? "익명"}</span>
              <span className="review-date">{r.createdAt?.slice(0, 10)}</span>
            </div>

            <div className="review-stars">{"★".repeat(r.rating)}</div>

            <p className="review-content">{r.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Review;
