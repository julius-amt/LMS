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
    "/:bookId",
    checkSchema(addBookValidationSchema),
    AdminBooksManagementController.editBook
);
router.delete("/:bookId", AdminBooksManagementController.deleteBook);

router.get("/list", AdminBooksManagementController.listBooks);

router.get("/transactions/", AdminBooksManagementController.getTransactions);
router.put(
    "/transactions/:transactionId/returned",
    AdminBooksManagementController.returnBook
);

export { router as AdminBooksManagementRouter };
