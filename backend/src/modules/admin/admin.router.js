import express from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import prisma from "../../lib/prisma.js";
import requireAdmin from "../../middleware/requireAdmin.js";

const adminRouter = express.Router();
const uploadBaseDir = path.resolve(process.cwd(), "../frontend/public/assets/uploads");
fs.mkdirSync(uploadBaseDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, _file, cb) => {
        if (!req.uploadSubdir) {
            req.uploadSubdir = `batch-${Date.now()}`;
        }
        const dir = path.join(uploadBaseDir, req.uploadSubdir);
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (_req, file, cb) => {
        const safeName = file.originalname.replace(/[^\w.\-]/g, "_");
        const unique = `${Date.now()}-${safeName}`;
        cb(null, unique);
    },
});
const upload = multer({ storage });

const productInclude = {
    images: true,
    sizes: true,
    discounts: {
        where: { isActive: true },
        orderBy: { startDate: "desc" },
    },
    categories: {
        include: { category: true },
    },
};

const koreanCategoryName = (code) => {
    if (code === "LIFESTYLE") return "라이프스타일";
    if (code === "SLEEPON") return "슬립온";
    return code;
};

const mapProduct = (product) => {
    const category = product.categories?.[0]?.category;
    const activeImages = (product.images || []).filter((img) => img.isActive);
    const discount = (product.discounts || []).find((d) => d.isActive) || null;
    const sizes = (product.sizes || [])
        .filter((size) => size.isActive)
        .map((size) => size.size);

    return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        material: product.material,
        categoryCode: category?.code ?? null,
        categoryName: category?.name ?? null,
        images: activeImages.map((img) => img.imageUrl),
        thumbnail: activeImages[0]?.imageUrl || null,
        discountRate: discount?.discountRate ?? 0,
        sizes,
        isActive: product.isActive,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
    };
};

const findOrCreateCategory = async (code, client = prisma) => {
    const existing = await client.category.findFirst({ where: { code } });
    if (existing) {
        return existing;
    }
    return client.category.create({
        data: { code, name: koreanCategoryName(code), isActive: true },
    });
};

adminRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "이메일과 비밀번호를 모두 입력하세요." });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        const isValid =
            user &&
            user.password === password &&
            user.role === "ADMIN" &&
            user.isActive;

        if (!isValid) {
            return res.status(401).json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });
        }

        req.session.user = {
            id: user.id,
            email: user.email,
            role: user.role,
        };

        return res.json({
            user: { id: user.id, email: user.email, role: user.role },
        });
    } catch (error) {
        console.error("Login error", error);
        return res.status(500).json({ message: "로그인 중 오류가 발생했습니다." });
    }
});

adminRouter.post("/logout", (req, res) => {
    if (!req.session) {
        return res.json({ ok: true });
    }

    req.session.destroy((err) => {
        if (err) {
            console.error("세션 종료 실패", err);
            return res.status(500).json({ message: "로그아웃 중 오류가 발생했습니다." });
        }

        res.clearCookie("connect.sid");
        return res.json({ ok: true });
    });
});

adminRouter.get("/session", (req, res) => {
    const sessionUser = req.session?.user;
    if (!sessionUser) {
        return res.status(401).json({ authenticated: false });
    }

    return res.json({ authenticated: true, user: sessionUser });
});

adminRouter.use(requireAdmin);

adminRouter.get("/ping", (req, res) => {
    return res.json({ ok: true, user: req.session.user });
});

adminRouter.post("/uploads", upload.array("files", 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "파일이 업로드되지 않았습니다." });
    }
    const subdir = req.uploadSubdir || "";
    const paths = req.files.map((file) => {
        const rel = path.relative(uploadBaseDir, file.path).replace(/\\/g, "/");
        return `assets/uploads/${rel}`;
    });
    const urls = paths.map((p) => `${req.protocol}://${req.get("host")}/${p}`);
    return res.status(201).json({ paths, urls, subdir });
});

adminRouter.get("/products", async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            where: { isActive: true },
            include: productInclude,
            orderBy: { createdAt: "desc" },
        });

        return res.json({ products: products.map(mapProduct) });
    } catch (error) {
        console.error("상품 목록 조회 실패", error);
        return res.status(500).json({ message: "상품 목록을 불러오지 못했습니다." });
    }
});

adminRouter.post("/products", async (req, res) => {
    const { name, description, price, material, categoryCode, imageUrls, sizes, discountRate } =
        req.body || {};

    const numericPrice = Number(price);
    const parsedDiscount = Math.round(Number(discountRate) || 0);
    if (!name || !Number.isFinite(numericPrice) || !material || !categoryCode) {
        return res.status(400).json({ message: "필수 필드를 모두 입력하세요." });
    }

    const filteredImages = Array.isArray(imageUrls) ? imageUrls.filter(Boolean) : [];
    const sizeValues = Array.isArray(sizes)
        ? Array.from(new Set(sizes.map((size) => Number(size)).filter(Number.isFinite)))
        : [];
    const discount = Math.max(0, Math.min(90, parsedDiscount));

    try {
        const dup = await prisma.product.findFirst({
            where: { name },
        });
        if (dup) {
            return res.status(409).json({ message: "이미 동일한 상품명이 존재합니다." });
        }

        const product = await prisma.$transaction(async (tx) => {
            const category = await findOrCreateCategory(categoryCode, tx);

            const created = await tx.product.create({
                data: {
                    name,
                    description: description || null,
                    price: numericPrice,
                    material,
                    isActive: true,
                    categories: {
                        create: [{ categoryId: category.id }],
                    },
                    images: filteredImages.length
                        ? {
                              create: filteredImages.map((url) => ({
                                  imageUrl: url,
                                  isActive: true,
                              })),
                          }
                        : undefined,
                    sizes: sizeValues.length
                        ? {
                              create: sizeValues.map((size) => ({
                                  size,
                                  isActive: true,
                              })),
                          }
                        : undefined,
                    discounts:
                        discount > 0
                            ? {
                                  create: {
                                      discountRate: discount,
                                      startDate: new Date(),
                                      endDate: new Date("9999-12-31"),
                                      isActive: true,
                                  },
                              }
                            : undefined,
                },
            });

            return tx.product.findUnique({
                where: { id: created.id },
                include: productInclude,
            });
        });

        return res.status(201).json({ product: mapProduct(product) });
    } catch (error) {
        console.error("상품 등록 실패", error);
        return res.status(500).json({ message: "상품 등록 중 오류가 발생했습니다." });
    }
});

adminRouter.put("/products/:id", async (req, res) => {
    const productId = Number(req.params.id);
    if (!Number.isInteger(productId)) {
        return res.status(400).json({ message: "유효한 상품 ID가 아닙니다." });
    }

    const { name, description, price, material, categoryCode, imageUrls, sizes, discountRate } =
        req.body || {};

    const numericPrice = price !== undefined ? Number(price) : undefined;
    if (numericPrice !== undefined && (!Number.isFinite(numericPrice) || numericPrice < 0)) {
        return res.status(400).json({ message: "가격은 0 이상의 숫자여야 합니다." });
    }
    const parsedDiscount = discountRate !== undefined ? Math.round(Number(discountRate) || 0) : null;

    try {
        const existing = await prisma.product.findUnique({ where: { id: productId } });
        if (!existing) {
            return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
        }

        if (name) {
            const duplicateName = await prisma.product.findFirst({
                where: { name, NOT: { id: productId } },
            });
            if (duplicateName) {
                return res.status(409).json({ message: "이미 동일한 상품명이 존재합니다." });
            }
        }

        await prisma.$transaction(async (tx) => {
            const baseUpdate = {};
            if (name !== undefined) baseUpdate.name = name;
            if (description !== undefined) baseUpdate.description = description || null;
            if (numericPrice !== undefined) baseUpdate.price = numericPrice;
            if (material !== undefined) baseUpdate.material = material;

            if (Object.keys(baseUpdate).length) {
                await tx.product.update({
                    where: { id: productId },
                    data: baseUpdate,
                });
            }

            if (categoryCode) {
                const category = await findOrCreateCategory(categoryCode, tx);
                await tx.productCategory.deleteMany({ where: { productId } });
                await tx.productCategory.create({
                    data: { productId, categoryId: category.id },
                });
            }

            if (Array.isArray(imageUrls)) {
                await tx.productImage.updateMany({
                    where: { productId },
                    data: { isActive: false },
                });

                const filteredImages = imageUrls.filter(Boolean);
                for (const url of filteredImages) {
                    await tx.productImage.create({
                        data: { productId, imageUrl: url, isActive: true },
                    });
                }
            }

            if (Array.isArray(sizes)) {
                const sizeValues = Array.from(
                    new Set(sizes.map((size) => Number(size)).filter(Number.isFinite))
                );
                const keepSizes = new Set(sizeValues);

                const existingSizes = await tx.productSize.findMany({ where: { productId } });
                for (const sizeRow of existingSizes) {
                    if (!keepSizes.has(sizeRow.size)) {
                        await tx.productSize.update({
                            where: { id: sizeRow.id },
                            data: { isActive: false },
                        });
                    }
                }

                for (const size of sizeValues) {
                    await tx.productSize.upsert({
                        where: { productId_size: { productId, size } },
                        update: { isActive: true },
                        create: { productId, size, isActive: true },
                    });
                }
            }

            if (parsedDiscount !== null) {
                const discount = Math.max(0, Math.min(90, parsedDiscount));
                await tx.productDiscount.updateMany({
                    where: { productId, isActive: true },
                    data: { isActive: false, endDate: new Date() },
                });

                if (discount > 0) {
                    await tx.productDiscount.create({
                        data: {
                            productId,
                            discountRate: discount,
                            startDate: new Date(),
                            endDate: new Date("9999-12-31"),
                            isActive: true,
                        },
                    });
                }
            }
        });

        const product = await prisma.product.findUnique({
            where: { id: productId },
            include: productInclude,
        });

        return res.json({ product: mapProduct(product) });
    } catch (error) {
        console.error("상품 수정 실패", error);
        return res.status(500).json({ message: "상품 수정 중 오류가 발생했습니다." });
    }
});

adminRouter.get("/sales", async (req, res) => {
    const { from, to } = req.query;
    const fromDate = from ? new Date(from) : new Date(0);
    const toDate = to ? new Date(`${to}T23:59:59.999Z`) : new Date();

    if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
        return res.status(400).json({ message: "날짜 형식이 올바르지 않습니다." });
    }

    try {
        const [products, orderItems] = await Promise.all([
            prisma.product.findMany({
                where: { isActive: true },
                include: {
                    categories: { include: { category: true } },
                },
            }),
            prisma.orderItem.findMany({
                where: {
                    order: {
                        createdAt: { gte: fromDate, lte: toDate },
                        status: "PAID",
                    },
                },
            }),
        ]);

        const salesMap = new Map();
        let totalUnits = 0;
        let totalRevenue = 0;
        for (const item of orderItems) {
            const current = salesMap.get(item.productId) || { units: 0, revenue: 0 };
            current.units += item.quantity;
            const lineTotal =
                item.lineTotal !== null && item.lineTotal !== undefined
                    ? item.lineTotal
                    : item.unitPrice * item.quantity;
            current.revenue += lineTotal;
            salesMap.set(item.productId, current);
            totalUnits += item.quantity;
            totalRevenue += lineTotal;
        }

        const sales = products.map((product) => {
            const category = product.categories?.[0]?.category;
            const totals = salesMap.get(product.id) || { units: 0, revenue: 0 };
            return {
                productId: product.id,
                name: product.name,
                categoryCode: category?.code ?? null,
                categoryName: category?.name ?? null,
                units: totals.units,
                revenue: totals.revenue,
            };
        });

        return res.json({ sales, summary: { totalUnits, totalRevenue } });
    } catch (error) {
        console.error("판매 현황 조회 실패", error);
        return res.status(500).json({ message: "판매 현황을 불러오지 못했습니다." });
    }
});

export default adminRouter;
