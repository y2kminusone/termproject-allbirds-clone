import express from "express";
import prisma from "../../lib/prisma.js";

const adminRouter = express.Router();

const requireAdmin = (req, res, next) => {
    const sessionUser = req.session?.user;
    if (!sessionUser || sessionUser.role !== "ADMIN") {
        return res.status(401).json({ message: "관리자 인증이 필요합니다." });
    }
    next();
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

export default adminRouter;
