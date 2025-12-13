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

export async function createReviewService(userId, productId, dto) {
    const { orderItemId, rating, content } = dto;

    const orderItem = await prisma.orderItem.findFirst({
        where: {
            id: orderItemId,
            productId,
            order: {
                userId,
            },
        },
    });

    if(!orderItem) {
        throw notFound("리뷰를 작성할 수 있는 주문 항목이 아닙니다.");
    }

    const existing = await prisma.review.findUnique({
        where: { orderItemId },
    });

    if (existing) {
        throw badRequest("이미 리뷰를 작성한 주문 항목입니다.");
    }

    const review = await prisma.review.create({
        data: {
            orderItemId,
            userId,
            productId,
            rating,
            content,
        },
    });

    return review;
}

export async function getReViewsByProductId(productId) {
    return prisma.review.findMany ({
        where: {
            productId,
            isActive: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}