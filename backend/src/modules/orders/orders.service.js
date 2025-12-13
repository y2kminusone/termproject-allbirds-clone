import prisma from "../../lib/prisma.js";

function badRequest(message) {
    const err = new Error(message);
    err.status = 400;
    return err;
}

function notFound(message) {
    const err = new Error(message);
    err.status = 404;
    return err;
}

export async function createOrderService(userId) {
    const cartItems = await prisma.cartItem.findMany({
        where: { userId },
        include: {
            product: {
                include: { discounts: true },
            },
            productSize: true,
        },
    });

    if (cartItems.length === 0) {
        throw badRequest("장바구니가 비어 있습니다.")
    }

    const now = new Date();

    const orderItemsData = cartItems.map((item) => {
        const basePrice = item.product.price;

        const activeDiscount = (item.product.discounts || []).find(
            (d) =>
                d.isActive &&
            d.startDate <= now &&
            d.endDate >= now
        );

        const unitPrice = activeDiscount
          ? Math.floor(basePrice * (100 - activeDiscount.discountRate) / 100)
          : basePrice;
        
          return {
            productId: item.productId,
            productName: item.product.name,
            size: item.productSize.size,
            quantity: item.quantity,
            unitPrice,
            lineTotal: unitPrice * item.quantity,
          };
    });

    const totalPrice = orderItemsData.reduce (
        (sum, item) => sum + item.lineTotal,
        0
    );

    const order = await prisma.order.create({
        data: {
            userId,
            totalPrice,
            status: "PAID",
            items: {
                create: orderItemsData,
            },
        },
        include: {
                items: true,
        },
    });

    await prisma.cartItem.deleteMany({
        where: { userId },
    });

    return order;
}

export async function getOrdersByUserId(userId) {
    return prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
}

export async function getOrderById(userId, orderId) {
    const order = await prisma.order.findFirst({
        where: {
            id: orderId,
            userId,
        },
        include: {
            items: true,
        },
    });

    if (!order) {
        throw notFound("주문을 찾을 수 없습니다.");
    }

    return order;
}