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
import { ref, uploadBytesResumable } from "firebase/storage";
import { upload } from "./middleware/multer.js";
import { storage } from "./config/firebase.config.js";

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
  const dateTime = Date.now();
  const fileName = `${file.folder}/${dateTime}`;
  const storageRef = ref(storage, fileName);
  const metadata = {
    contentType: file.type,
  };
  await uploadBytesResumable(storageRef, file.buffer, metadata);
  return fileName;
};

export const uploadPictureAndGetUrl = async (file) => {
  const data = {
    type: file.mimetype,
    buffer: file.buffer,
    folder: file.fieldname,
    // filename: file.originalname,
  };
  const storedImage = await uploadImage(data);
  const path = `/${storedImage}`;
  const storageRef = ref(storage, path);
  picturePath = await getDownloadURL(storageRef);
  return picturePath;
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

/* TEST FOR DEPLOYMENT */
app.get("/", (req, res) => res.json("Hello world!"));

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
