import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
     const uniqueName =
    Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + "-" + file.originalname);
  }
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});
