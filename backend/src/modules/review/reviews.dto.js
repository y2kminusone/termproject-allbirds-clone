export function parseCreateReviewDto(body) {
    const { orderItemId, rating, content } = body;

    if(!orderItemId) {
        const err = new Error("orderItemId는 필수입니다.");
        err.status = 400;
        throw err;
    }

    if (typeof rating !== "number" || rating < 1 || rating > 5) {
        const err = new Error("rating은 1~5 사이의 숫자여야 합니다.");
        err.status = 400;
        return err;
    }

    if (!content || typeof content !== "string") {
        const err = new Error("content는 필수 문자열입니다.");
        err.status = 400;
        throw err;
    }

    return {
        orderItemId: Number(orderItemId),
        rating,
        content,
    };
}

export function reviewResponseDto(review) {
    return {
        reviewId: review.id,
        rating: review.rating,
        content: review.content,
        createdAt: review.createdAt,
        userId: review.userId,
    };
}

export function reviewListResponseDto(reviews) {
    return reviews.map((review) => ({
        reviewId: review.id,
        rating: review.rating,
        content: review.content,
        createdAt: review.createdAt,
        userId: review.userId,
    }));
}