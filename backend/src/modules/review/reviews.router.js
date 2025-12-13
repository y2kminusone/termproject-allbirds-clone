import { Router } from "express";
import {
    creatReview,
    getProductReviews,
} from "./reviews.controller.js";

const router = Router();

router.post("/:productId/reviews", creatReview);
router.get("/:productId/reviews", getProductReviews);

export default router;