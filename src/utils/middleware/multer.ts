import multer from "multer";
import path from "path";

const pathToUploads = path.resolve(__dirname, "../../public/books");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, pathToUploads);
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toUTCString() + " - " + file.originalname);
    },
});

export const uploadImageMiddleware = multer({ storage });
