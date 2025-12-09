export function parseAddToCartDto(body) {
    const { productId, size, quantity } = body;

    if (productId === undefined || productId === null) {
        const err = new Error("productId는 필수입니다.");
        err.status = 400;
        throw err;
    }
    if (typeof productId !== "number") {
        const err = new Error("productId는 숫자여야 합니다.");
        err.status = 400;
        throw err;
    }
    if (typeof size !== "number" ) {
        const err = new Error("size는 숫자여야 합니다.");
        err.status = 400;
        throw err;
    }

    const qty = quantity ?? 1;
    if (typeof qty !== "number" || qty <= 0) {
        const err = new Error("quantity는 1 이상의 숫자여야 합니다.");
        err.status = 400;
        throw err;
    }

    return {
        productId,
        size,
        quantity: qty,
    };
}

export function parseUpdateCartItemDto(params, body) {
    const { cartItemId } = params;
    const { quantity } = body;

    if (!cartItemId) {
        const err = new Error("cartItemId는 필수입니다.");
        err.status = 400;
        throw err;
    }

    const parsedId = Number(cartItemId);
    if (Number.isNaN(parsedId)) {
       const err = new Error("cartItemId는 숫자여야 합니다.");
       err.status = 400;
       throw err; 
    }

    if (quantity === undefined || quantity === null) {
        const err = new Error("quantity는 필수입니다.");
        err.status = 400;
        throw err;
    }

    if (typeof quantity != "number" || quantity <= 0) {
        const err = new Error("quantity는 1 이상의 숫자여야 합니다.");
        err.status = 400;
        throw err;
    }

    return {
        cartItemId: parsedId,
        quantity,
    };
}

export function parseRemoveCartItemDto(params) {
    const { cartItemId } = params;

    if (!cartItemId) {
        const err = new Error("cartItemId는 필수입니다.");
        err.status = 400;
        throw err;
    }

    const parsedId = Number(cartItemId);
    if (Number.isNaN(parsedId)) {
        const err = new Error("cartItemId는 숫자여야 합니다.");
        err.status = 400;
        throw err;
    }

    return {
        cartItemId: parsedId,
    }
}

export function cartItemToDto(cartItem) {
    const { id, quantity, product, productSize } = cartItem;

    const basePrice = product.price;

    const now = new Date();
    const activeDiscount = (product.discount || []).find(
        (d) =>
            d.isActive &&
            d.startDate <= now &&
            d.endDate >= now
    );

    const originalPrice = basePrice;
    const unitPrice = activeDiscount
        ? Math.floor(basePrice * (100 - activeDiscount.discountRate) / 100)
        : basePrice;
    
    const lineTotal = unitPrice * quntity;

    const firstImage = (product.images && product.images[0]) || null;

    return {
        cartItemId: id,
        productId: product.id,
        name: product.name,
        material: product.material,
        size: productSize.size,
        quntity,
        originalPrice,
        unitPrice,
        lineTotal,
        hasDiscount: !!activeDiscount,
        discountRate: activeDiscount ? activeDiscount.discountRate : null,
        imageUrl: firstImage ? firstImage.imageUrl : null,
    };
}

export function cartResponseDto(cartItems) {
    const items = cartItems.map(cartItemToDto);
    const totalPrice = items.reduce((sum, item) => sum + item.lineTotal, 0);

    return {
        count: items.length,
        totalPrice,
        items,
    }
}