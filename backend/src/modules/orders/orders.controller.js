import {
    parseCreateOrderDto,
    orderResponseDto,
    orderListResponseDto,
} from "./orders.dto.js";

import {
    createOrderService,
    getOrdersByUserId,
    getOrderById,
} from "./orders.service.js";

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

export async function createOrder(req, res) {
    try {
        const userId = getUserIdFromRequest(req);
        const dto = parseCreateOrderDto(req.body);

        const order = await createOrderService(userId, dto);
        const response = orderResponseDto(order);

        return res.status(201).json(response);
    } catch (err) {
        console.error(err);
        return res.status(err.status || 500).json({ message: err.message });
    }
}

export async function getMyOrders(req, res) {
    try {
        const userId = getUserIdFromRequest(req);

        const orders = await getOrdersByUserId(userId);
        const response = orderListResponseDto(orders);

        return res.status(200).json(response);
    } catch (err) {
        console.error(err);
        return res.status(err.status || 500).json({ message: err.message });
    }
}

export async function getOrderDetail(req, res) {
    try {
        const userId = getUserIdFromRequest(req);
        const orderId = Number(req.params.orderId);

        if(Number.isNaN(orderId)) {
            const err = new Error("orderId는 숫자여야 합니다.");
            err.status = 400;
            throw err;
        }

        const order = await getOrderById(userId, orderId);
        const response = orderResponseDto(order);

        return res.status(200).json(response);
    } catch (err) {
        console.error(err);
        return res.status(err.status || 500).json({ message: err.message });
    }
}