export function parseCreateOrderDto(body) {
    const { paymentMethod } = body;

    if (!paymentMethod) {
        const err = new Error("결제 수단은 필수입니다.");
        err.status = 400;
        throw err;
    }

    return { paymentMethod };
}

export function orderResponseDto(order) {
    return {
        orderId: order.id,
        status: order.status,
        totalPrice: order.totalPrice,
        createdAt: order.createdAt,
        items: order.items.map((item) => ({
            orderItemId: item.id,
            productId: item.productId,
            productName: item.productName,
            size: item.size,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            lineTotal: item.lineTotal,
        })),
    };
}

export function orderListResponseDto(orders) {
    return orders.map((order) => ({
        orderId: order.id,
        status: order.status,
        totalPrice: order.totalPrice,
        createdAt: order.createdAt,
    }));
}