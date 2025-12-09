import prisma from "../src/lib/prisma.js";

async function main() {
    // 1) 기본 관리자 계정
    await prisma.user.upsert({
        where: { email: "admin@allbirds.com" },
        update: {
            password: "admin123",
            role: "ADMIN",
            nickname: "Allbirds Admin",
            isActive: true,
        },
        create: {
            email: "admin@allbirds.com",
            password: "admin123",
            nickname: "Allbirds Admin",
            role: "ADMIN",
        },
    });

    // 2) 카테고리 보정
    const categories = [
        { code: "LIFESTYLE", name: "라이프스타일" },
        { code: "SLEEPON", name: "슬립온" },
    ];
    for (const category of categories) {
        const existing = await prisma.category.findFirst({ where: { code: category.code } });
        if (!existing) {
            await prisma.category.create({ data: category });
        }
    }

    // 3) 샘플 상품 생성 (필요 시만)
    const sampleProducts = [
        {
            name: "남성 라이저 내추럴 화이트",
            description: "가볍고 쿠셔닝 좋은 라이저 러닝화",
            price: 159000,
            material: "TREE",
            categoryCode: "LIFESTYLE",
            imageUrls: [
                "source_image/남성 라이저 - 내추럴 화이트 (블리자드) – 올버즈 _ Allbirds/남성 라이저 - 내추럴 화이트 (블리자드).jpg",
            ],
            sizes: [245, 250, 255, 260, 265],
            discountRate: 10,
        },
        {
            name: "남성 러너 NZ 코듀로이",
            description: "코듀로이 텍스처의 클래식 러너",
            price: 149000,
            material: "WOOL",
            categoryCode: "LIFESTYLE",
            imageUrls: [
                "source_image/남성 러너 NZ 코듀로이 - 스토니 크림 (스토니 크림) – 올버즈 _ Allbirds/남성 러너 NZ 코듀로이 - 스토니 크림 (스토니 크림).avif",
            ],
            sizes: [250, 255, 260, 265],
            discountRate: 5,
        },
        {
            name: "남성 울 러너 내추럴 그레이",
            description: "울 소재의 데일리 러너",
            price: 139000,
            material: "WOOL",
            categoryCode: "SLEEPON",
            imageUrls: [
                "source_image/남성 울 러너 - 내추럴 그레이 (라이트 그레이) – 올버즈 _ Allbirds/남성 울 러너 - 내추럴 그레이 (라이트 그레이).jpg",
            ],
            sizes: [250, 255, 260, 270],
            discountRate: 0,
        },
        {
            name: "남성 트리 러너 미스트",
            description: "통기성이 뛰어난 트리 러너",
            price: 129000,
            material: "TREE",
            categoryCode: "LIFESTYLE",
            imageUrls: [
                "source_image/남성 트리 러너 - 미스트 (화이트) – 올버즈 _ Allbirds/남성 트리 러너 - 미스트 (화이트).jpg",
            ],
            sizes: [250, 255, 260, 265, 270],
            discountRate: 15,
        },
    ];

    const ensureProduct = async (entry) => {
        const existing = await prisma.product.findFirst({ where: { name: entry.name } });
        if (existing) return existing;
        const category = await prisma.category.findFirst({
            where: { code: entry.categoryCode },
        });
        return prisma.product.create({
            data: {
                name: entry.name,
                description: entry.description,
                price: entry.price,
                material: entry.material,
                categories: category
                    ? {
                          create: [{ categoryId: category.id }],
                      }
                    : undefined,
                images: {
                    create: entry.imageUrls.map((url) => ({
                        imageUrl: url,
                        isActive: true,
                    })),
                },
                sizes: {
                    create: entry.sizes.map((size) => ({
                        size,
                        isActive: true,
                    })),
                },
                discounts:
                    entry.discountRate > 0
                        ? {
                              create: {
                                  discountRate: entry.discountRate,
                                  startDate: new Date(),
                                  endDate: new Date("9999-12-31"),
                                  isActive: true,
                              },
                          }
                        : undefined,
            },
        });
    };

    const products = [];
    for (const entry of sampleProducts) {
        const product = await ensureProduct(entry);
        products.push(product);
    }

    // 4) 샘플 주문 데이터 (주문이 없을 때만 삽입)
    const orderCount = await prisma.order.count();
    if (orderCount === 0) {
        const admin = await prisma.user.findUnique({ where: { email: "admin@allbirds.com" } });
        if (admin && products.length) {
            const order1 = await prisma.order.create({
                data: {
                    userId: admin.id,
                    totalPrice: 362400,
                    status: "PAID",
                    createdAt: new Date("2025-01-10"),
                    items: {
                        create: [
                            {
                                productId: products[0].id,
                                productName: products[0].name,
                                size: 260,
                                quantity: 1,
                                unitPrice: 159000,
                                lineTotal: 143100,
                            },
                            {
                                productId: products[3].id,
                                productName: products[3].name,
                                size: 265,
                                quantity: 2,
                                unitPrice: 129000,
                                lineTotal: 219300,
                            },
                        ],
                    },
                },
            });

            await prisma.order.create({
                data: {
                    userId: admin.id,
                    totalPrice: 141550,
                    status: "PAID",
                    createdAt: new Date("2025-02-02"),
                    items: {
                        create: [
                            {
                                productId: products[1].id,
                                productName: products[1].name,
                                size: 255,
                                quantity: 1,
                                unitPrice: 149000,
                                lineTotal: 141550,
                            },
                        ],
                    },
                },
            });

            // 추가 판매 검증용 주문 데이터
            await prisma.order.create({
                data: {
                    userId: admin.id,
                    totalPrice: 300000,
                    status: "PAID",
                    createdAt: new Date("2025-03-15"),
                    items: {
                        create: [
                            {
                                productId: products[0].id,
                                productName: products[0].name,
                                size: 255,
                                quantity: 2,
                                unitPrice: 159000,
                                lineTotal: 286200, // 10% 할인
                            },
                            {
                                productId: products[2].id,
                                productName: products[2].name,
                                size: 260,
                                quantity: 1,
                                unitPrice: 139000,
                                lineTotal: 139000, // 할인 없음
                            },
                        ],
                    },
                },
            });

            await prisma.order.create({
                data: {
                    userId: admin.id,
                    totalPrice: 200000,
                    status: "PAID",
                    createdAt: new Date("2025-04-05"),
                    items: {
                        create: [
                            {
                                productId: products[3].id,
                                productName: products[3].name,
                                size: 260,
                                quantity: 1,
                                unitPrice: 129000,
                                lineTotal: 109650, // 15% 할인
                            },
                            {
                                productId: products[1].id,
                                productName: products[1].name,
                                size: 265,
                                quantity: 1,
                                unitPrice: 149000,
                                lineTotal: 141550, // 5% 할인
                            },
                        ],
                    },
                },
            });

            await prisma.order.create({
                data: {
                    userId: admin.id,
                    totalPrice: 159000,
                    status: "PAID",
                    createdAt: new Date("2025-05-01"),
                    items: {
                        create: [
                            {
                                productId: products[0].id,
                                productName: products[0].name,
                                size: 245,
                                quantity: 1,
                                unitPrice: 159000,
                                lineTotal: 143100, // 10% 할인
                            },
                        ],
                    },
                },
            });

            console.log("샘플 주문 데이터 생성 완료", order1.id);
        }
    }
}

main()
    .then(() => {
        console.log("Seeded admin account (admin@allbirds.com / admin123) 및 샘플 데이터");
    })
    .catch((error) => {
        console.error("Seeding failed", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
