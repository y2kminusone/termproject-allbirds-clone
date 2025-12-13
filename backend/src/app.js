import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import path from "path";
import usersRouter from "./modules/users/users.router.js";
import adminRouter from "./modules/admin/admin.router.js";
import cartRouter from "./modules/cart/cart.router.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const uploadDir = path.join(process.cwd(), "uploads");
const frontendUploadsDir = path.resolve(process.cwd(), "../frontend/public/assets/uploads");

app.use(
    cors({
        origin: true,
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadDir));
app.use("/assets/uploads", express.static(frontendUploadsDir));
app.use("/cart", cartRouter);

app.use(
    session({
        secret: process.env.SESSION_SECRET || "change-me",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        },
    })
);

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

app.use("/api/users", usersRouter);
app.use("/api/admin", adminRouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
