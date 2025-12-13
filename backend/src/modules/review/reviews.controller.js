import {
    parseCreateReviewDto,
    reviewResponseDto,
    reviewListResponseDto,
} from "./reviews.dto.js";

import {
    createReviewService,
    getReViewsByProductId,
} from "./reviews.service.js";

function getUserIdFromRequest(req) {
    const { userId } = req.query;
    const parsed = Number(userId);

    if (!userId || Number.isNaN(parsed)) {
        const err = new Error("userId가 유효한 숫자가 아닙니다.");
        err.status = 400;
        throw err;
    }
    return parsed;
}

export async function creatReview(req, res) {
    try {
        const userId = getUserIdFromRequest(req);
        const productId = Number(req.params.productId);
        const dto = parseCreateReviewDto(req.body);

        if (Number.isNaN(productId)) {
            const err = new Error("productId는 숫자여야 합니닫.");
            err.status = 400;
            throw err;
        }

        const review = await createReviewService(userId, productId, dto);
        const response = reviewListResponseDto(review);

        return res.status(201).json(response);
    } catch (err) {
        return res.status(err.status || 500).json({ message: err.message });
    }
}

export async function getProductReviews(req, res) {
    try {
        const productId = Number(req.params.productId);

        if (Number.isNaN(productId)) {
            const err = new Error("productId는 숫자여야 합니다.");
            err.status = 400;
            throw err;
        }

        const reviews = await getReViewsByProductId(productId);
        console.log("reviews type:", typeof reviews, "isArray:", Array.isArray(reviews), reviews);
        const response = reviewListResponseDto(reviews);

        return res.status(200).json(response);
    } catch (err) {
        console.error(err);
        return res.status(err.status || 500).json({ message: err.message });
    }
}