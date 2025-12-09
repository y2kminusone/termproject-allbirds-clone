import { prisma } from "../../prismaClient.js";

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
async function getCartWithRelations(userId) {
    return prisma.cartItem.findMany({
        where: { userId },
        orderBy: { createdAt: "asc" },
        include: {
            product: {
                include: {
                    images: true,
                    discounts: true,
                },
            },
            productSize: true,
        },
    });
}

export async function getCartByUserId(userId) {
    return getCartWithRelations(userId);
}

export async function addToCartService(userId, input) {
    const { productId, size, quantity } = input;

    const productSize = await prisma.productSize.findUnique ({
        where: {
            productId_size: {
                productId,
                size,
            },
        },
        include: {
            product: true,
        },
    });

    if (!productSize) {
        throw notFound("해당 상품 또는 사이즈를 찾을 수 없습니다.");
    }
    if (!productSize.product.isActive) {
        throw badRequest("비활성화된 상품입니다.");
    }

    const existing = await prisma.cartItem.findUnique({
        where: {
            userId_productId_productSizeId: {
                userId,
                productId,
                productSizeId: productSize.id,
            },
        },
    });

    if (existing) {
        await prisma.cartItem.update({
            where: { id: existing.id },
            data: {
                quantity: existing.quantity + quantity,
            },
        });
    } else {
        await prisma.cartItem.create({
            data: {
                userId,
                productId,
                productSizeId: productSize.id,
                quantity,
            },
        });
    }

    return getCartWithRelations(userId);
}

export async function updateCartItemService(userId, dto) {
    const { cartItemId, quantity } = dto;

    const item = await prisma.cartItem.findFirst({
        where: {
            id: cartItemId,
            userId,
        },
    });

    if (!item) {
        throw notFound ("장바구니 항목을 찾을 수 없습니다.");
    }
    await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity },
    });
    return getCartWithRelations(userId);
}

export async function removeCartItemService(userId, dto) {
    const { cartItemId } = dto;
    const item = await prisma.cartItem.findFirst({
        where: {
            id: cartItemId,
            userId,
        },
    });

    if (!item) {
        throw notFound("장바구니 항목을 찾을 수 없습니다.");
    }
    await prisma.cartItem.delete({
        where: { id: cartItemId },
    });

    return getCartWithRelations(userId);
}

export async function clearCartService(userId) {
    await prisma.cartItem.deleteMany({
        where: { userId },
    });
    return getCartWithRelations(userId);
}
