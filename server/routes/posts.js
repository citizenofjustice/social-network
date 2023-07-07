import express from "express";
import {
  getFeedPosts,
  getUserPosts,
  likePost,
  getPostEditData,
  removePost,
  addNewComment,
} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";
import multer from "multer";

const router = express.Router();
const upload = multer();

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
router.patch("/:postId/comment/add", upload.none(), verifyToken, addNewComment);

/* DELETE */
router.delete("/:postId/remove/by/:userId", verifyToken, removePost);

export default router;
