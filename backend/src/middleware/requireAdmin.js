// Simple session guard to ensure only admins can access admin routes.
export default function requireAdmin(req, res, next) {
    const sessionUser = req.session?.user;
    if (!sessionUser || sessionUser.role !== "ADMIN") {
        return res.status(401).json({ message: "관리자 인증이 필요합니다." });
    }
    next();
}
