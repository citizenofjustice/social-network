import express from "express";
import multer from "multer";
import { verifyToken } from "../middleware/auth.js";
import { login } from "../controllers/auth.js";
import { updateAuthData } from "../controllers/auth.js";

const router = express.Router();
const upload = multer();

/* POST */
router.post("/login", login);

/* UPDATE */
router.patch(
  "/:id/profile/changeAuthData",
  upload.none(),
  verifyToken,
  updateAuthData
);

export default router;
