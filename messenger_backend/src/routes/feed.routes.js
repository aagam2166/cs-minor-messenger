import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getFeed } from "../controllers/feed.controller.js";

const router = Router();

/**
 * GET /api/v1/feed
 * protected
 */
router.get("/", verifyJWT, getFeed);

export default router;
