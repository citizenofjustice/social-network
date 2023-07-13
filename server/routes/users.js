import express from "express";
import {
  getUser,
  getUserFriends,
  getUsersByQuery,
  addRemoveFriend,
  updateUserProfile,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";
import multer from "multer";

const router = express.Router();
const upload = multer();

/* READ */
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);
router.get("/like/:query/not/:id", verifyToken, getUsersByQuery);

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);
router.patch(
  "/:id/profile/change",
  upload.none(),
  verifyToken,
  updateUserProfile
);

export default router;
