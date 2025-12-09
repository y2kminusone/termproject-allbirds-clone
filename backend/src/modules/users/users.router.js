import express from "express";

const router = express.Router();

// Placeholder users router to keep existing import working.
router.get("/", (req, res) => {
    res.json({ message: "users route is not implemented" });
});

export default router;
