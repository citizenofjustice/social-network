import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost, editPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { upload } from "./middleware/multer.js";
import { storage } from "./config/firebase.config.js";
import sharp from "sharp";
import imageSize from "image-size";

/* CONFIGURATION */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FIREBASE STORAGE */
export const uploadImage = async (file) => {
  const fileId = crypto.randomUUID();
  const sourcePath = `${file.folder}/${fileId}/source`;
  const placeholderPath = `${file.folder}/${fileId}/placeholder`;
  const placeholderRef = ref(storage, placeholderPath);
  const sourceRef = ref(storage, sourcePath);
  const metadata = {
    contentType: file.type,
  };
  await uploadBytesResumable(placeholderRef, file.placeholder, metadata);
  await uploadBytesResumable(sourceRef, file.source, metadata);
  return { sourcePath, placeholderPath };
};

export const uploadPictureAndGetUrl = async (file) => {
  const { width, height } = imageSize(file.buffer);
  const sourceAspectRatio = `${width} / ${height}`;

  const resizedBuffer = await sharp(file.buffer)
    .resize(100, 70, {
      fit: "inside",
    })
    .toBuffer();
  const storedImages = await uploadImage({
    type: file.mimetype,
    folder: file.fieldname,
    source: file.buffer,
    placeholder: resizedBuffer,
  });

  const sourceRef = ref(storage, storedImages.sourcePath);
  const placeholderRef = ref(storage, storedImages.placeholderPath);
  const sourceUrl = await getDownloadURL(sourceRef);
  const placeholderUrl = await getDownloadURL(placeholderRef);
  return { sourceUrl, sourceAspectRatio, placeholderUrl };
};

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("avatar"), register);
app.post("/posts/:userId", verifyToken, upload.single("picture"), createPost);
app.patch(
  "/posts/:postId/edit/by/:userId",
  verifyToken,
  upload.single("picture"),
  editPost
);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));
