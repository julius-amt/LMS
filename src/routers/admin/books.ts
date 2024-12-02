import { Router } from "express";
import { AdminBooksManagementController } from "../../controllers/books";
import { addBookValidationSchema } from "../../utils/middleware/validator";
import { checkSchema } from "express-validator";
import { uploadImageMiddleware } from "../../utils/middleware/multer";

const router = Router();

router.get("/create", AdminBooksManagementController.getAddBookPage);
router.post(
    "/create",
    uploadImageMiddleware.single("coverImage"),
    checkSchema(addBookValidationSchema),
    AdminBooksManagementController.addBooks
);
router.put(
    "/edit/:id",
    checkSchema(addBookValidationSchema),
    AdminBooksManagementController.editBook
);

router.get("/list", AdminBooksManagementController.listBooks);

export { router as AdminBooksManagementRouter };
