import { useEffect, useState } from "react";
import "./Review.css";

function Review({ productId }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (!productId) return;

    fetch(`/api/products/${productId}/reviews`)
      .then((res) => res.json())
      .then(setReviews)
      .catch(console.error);
  }, [productId]);

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

      <div className="review-list">
        {reviews.length === 0 && (
          <p className="empty-text">아직 리뷰가 없습니다.</p>
        )}

        {reviews.map((r) => (
          <div key={r.id} className="review-item">
            <div className="review-header">
              <span className="review-name">{r.user?.name ?? "익명"}</span>
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
