import { Router } from "express";
import {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
} from "./cart.controller.js";

const router = Router();

router.get("/", getCart);
router.post("/", addToCart);
router.patch("/:cartItemId", updateCartItem);
router.delete("/:cartItemId", removeCartItem);
router.delete("/", clearCart);

export default router;