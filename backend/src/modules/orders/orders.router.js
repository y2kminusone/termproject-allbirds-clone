import { Router } from "express";
import {
    createOrder,
    getMyOrders,
    getOrderDetail,
} from "./orders.controller.js";

const router = Router();

router.post("/",createOrder);
router.get("/me", getMyOrders);
router.get("/:orderId", getOrderDetail);

export default router;