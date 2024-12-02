import User from "../models/users";
import Transaction from "../models/transactions";
import Book from "../models/books";
import { Response, Request } from "express";
import { validationResult, matchedData } from "express-validator";

class BooksController {
    static async browseBooks(req: Request, res: Response) {
        const books = await Book.findAll();
        res.render("books", { books });
    }

    static async bookDetail(req: Request, res: Response) {
        const { id } = req.params;
        const book = await Book.findById(parseInt(id));

        if (!book) {
            return res.status(404).render("404");
        }

        // fetch other books excluding the current book
        const otherBooks = await Book.findAll();
        const otherBooksExcludingCurrent = otherBooks?.filter(
            (b) => b.id !== book.id
        );

        console.log("Book to be viewd: ", book);

        res.render("bookDetail", { book, otherBooksExcludingCurrent });
    }

    static async borrowBook(req: Request, res: Response) {
        const { id } = req.params;

        const book = await Book.findById(parseInt(id));
        if (!book) {
            res.status(404).json({ message: "Book not found" });
            return;
        }

        const response = await Book.findOneAndUpdate(
            parseInt(id),
            undefined,
            undefined,
            undefined,
            undefined,
            true
        );

        if (!response) {
            res.status(500).json({ message: "An error occurred" });
            return;
        }

        res.status(200).json({
            message: "Book borrowed successfully",
            success: true,
        });
    }
}

class AdminBooksManagementController {
    static async addBooks(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = errors.array();
            const extractedErrors = [
                "Error(s): ",
                ...error.map((err) => err.msg),
            ];
            console.log(error);

            return res.status(400).render("admin/addBooks", {
                error: extractedErrors,
            });
        }

        try {
            console.log("Adding book");
            const { title, description, author } = matchedData(req);
            const image = req.file;
            const coverImage = image ? image.filename : undefined;
            const book = new Book(title, description, author, coverImage);
            await book.save();

            res.redirect("/admin/books/list");
        } catch (err) {
            return res.status(500).render("admin/addBooks", {
                error: ["An error occurred while saving the book."],
            });
        }
    }

    static async getAddBookPage(req: Request, res: Response) {
        res.render("admin/addBooks");
    }

    static async listBooks(req: Request, res: Response) {
        const books = await Book.findAll();
        res.render("admin/listBooks", { books });
    }

    static async editBook(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = errors.array();
            const extractedErrors = [
                "Error(s): ",
                ...error.map((err) => err.msg),
            ];

            return res.status(400).render("admin/books/list", {
                error: extractedErrors,
            });
        }

        const { bookId } = req.params;
        const { title, description, author } = matchedData(req);
        const book = await Book.findOneAndUpdate(
            parseInt(bookId),
            title,
            description,
            author
        );
    }
}

export { BooksController, AdminBooksManagementController };
