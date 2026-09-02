import multer from "multer";
import { MAX_IMAGE_SIZE } from "../config/limits.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_IMAGE_SIZE,
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error("Only JPEG, JPG and PNG images are allowed"));
      return;
    }

    cb(null, true);
  },
});

export const uploadSingleImage = upload.single("image");
