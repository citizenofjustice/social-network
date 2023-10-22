import multer from "multer";
import path from "path";

function checkFileType(file, cb) {
  // Allowed ext
  const fileTypes = /jpeg|jpg|png/;
  // Check ext
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb("Error: Images Only !!!");
  }
}

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10485760 },
  fileFilter: async function (req, file, cb) {
    checkFileType(file, cb);
  },
});
