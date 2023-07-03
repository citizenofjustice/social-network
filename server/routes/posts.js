import express from "express";
import {
  getFeedPosts,
  getUserPosts,
  likePost,
  getPostEditData,
  editPost,
  removePost,
} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id/feed/:limit/:pageNum", verifyToken, getFeedPosts);
router.get(
  "/user/:userId/limit/:limit/page/:pageNum",
  verifyToken,
  getUserPosts
);
router.get("/:postId/get/edit/by/:userId", verifyToken, getPostEditData);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);

/* DELETE */
router.delete("/:postId/remove/by/:userId", verifyToken, removePost);

export default router;
