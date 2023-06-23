import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id/feed/:limit/:pageNum", verifyToken, getFeedPosts);
router.get(
  "/user/:userId/limit/:limit/page/:pageNum",
  verifyToken,
  getUserPosts
);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);

export default router;
