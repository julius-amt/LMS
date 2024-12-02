import { Router } from "express";
import { BooksController } from "../controllers/books";

const router = Router();

router.get("/", BooksController.browseBooks);
router.get("/:id", BooksController.bookDetail);
router.post("/:id/borrow", BooksController.borrowBook);
router.get("/me/history", BooksController.borrowHistory);

export { router as BooksRouter };
