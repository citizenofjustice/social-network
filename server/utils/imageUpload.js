import sharp from "sharp";
import crypto from "crypto";
import imageSize from "image-size";
import { storage } from "../config/firebase.config.js";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

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
  const resizedBuffer = await sharp(file.buffer)
    .resize(100, 70, {
      fit: "inside",
    })
    .webp()
    .toBuffer();
  const fullImageBuffer = await sharp(file.buffer)
    .resize(800)
    .webp()
    .toBuffer();
  const storedImages = await uploadImage({
    type: file.mimetype,
    folder: file.fieldname,
    source: fullImageBuffer,
    placeholder: resizedBuffer,
  });
  const { width, height } = imageSize(fullImageBuffer);
  const sourceAspectRatio = `${width} / ${height}`;

  const sourceRef = ref(storage, storedImages.sourcePath);
  const placeholderRef = ref(storage, storedImages.placeholderPath);
  const sourceUrl = await getDownloadURL(sourceRef);
  const placeholderUrl = await getDownloadURL(placeholderRef);
  return { sourceUrl, sourceAspectRatio, placeholderUrl };
};
