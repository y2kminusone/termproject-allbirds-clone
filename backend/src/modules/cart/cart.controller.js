import {
    cartResponseDto,
    parseAddToCartDto,
    parseUpdateCartItemDto,
    parseRemoveCartItemDto,
} from "./cart.dto.js";

import {
    getCartByUserId,
    addToCartService,
    updateCartItemService,
    removeCartItemService,
    clearCartService,
} from "./cart.service.js";

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

export async function getCart(req, res) {
    try {
        const userId = getUserIdFromRequest(req);

        const cartItems = await getCartByUserId(userId);
        const response = cartResponseDto(cartItems);

        return res.status(200).json(response);
    } catch (err) {
        console.error(err);
        return res.status(err.status || 500).json({ message: err.message});
    }
}

export async function addToCart(req, res) {
    try {
        const userId = getUserIdFromRequest(req);
        const dto = parseAddToCartDto(req.body);

        const cartItems = await addToCartService(userId, dto);
        const response = cartResponseDto(cartItems);

        return res.status(201).json(response);
    } catch (err) {
        console.error(err);
        return res.status(err.status || 500).json({ message: err.message });
    }
}

export async function updateCartItem(req, res) {
    try {
        const userId = getUserIdFromRequest(req);
        const dto = parseUpdateCartItemDto(req.params, req.body);

        const cartItems = await updateCartItemService(userId, dto);
        const response = cartResponseDto(cartItems);

        return res.status(200).json(response);
    } catch (err) {
        console.error(err);
        return res.status(err.status || 500).json({ message: err.message });
    }
}

export async function removeCartItem(req, res) {
    try {
        const userId = getUserIdFromRequest(req);
        const dto = parseRemoveCartItemDto(req.params);

        const cartItems = await removeCartItemService(userId, dto);
        const response = cartResponseDto(cartItems);

        return res.status(200).json(response);
    } catch (err) {
        console.error(err);
        return res.status(err.status || 500).json({ message: err.message });
    }
}

export async function clearCart(req, res) {
    try {
        const userId = getUserIdFromRequest(req);

        const cartItems = await clearCartService(userId);
        const response = cartResponseDto(cartItems);

        return res.status(200).json(response);
    } catch (err) {
        console.error(err);
        return res.status(err.status || 500).json({ message: err.message });
    }
}