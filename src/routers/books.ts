import { Router } from "express";
import { BooksController } from "../controllers/books";

const router = Router();

router.get("/", BooksController.browseBooks);
router.get("/:id", BooksController.bookDetail);
// borrow book
router.post("/:id/borrow", BooksController.borrowBook);

export { router as BooksRouter };
