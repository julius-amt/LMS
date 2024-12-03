import User from "../models/users";
import Transaction from "../models/transactions";
import Book from "../models/books";
import { Response, Request } from "express";
import { validationResult, matchedData } from "express-validator";
import fs from "fs";
import path from "path";

class BooksController {
    static async browseBooks(req: Request, res: Response) {
        const books = await Book.findAll();
        res.render("books", { books });
    }

    static async bookDetail(req: Request, res: Response) {
        const { id } = req.params;
        const book = await Book.findById(parseInt(id));

        if (!book) {
            res.status(404).render("bookDetail", { error: "Book not found" });
            return;
        }

        // fetch other books excluding the current book
        const otherBooks = await Book.findAll();
        const otherBooksExcludingCurrent = otherBooks?.filter(
            (b) => b.id !== book.id
        );

        res.render("bookDetail", { book, otherBooksExcludingCurrent });
    }

    // Borrow a book endpoint handler
    static async borrowBook(req: Request, res: Response) {
        const { id } = req.params;

        const book = await Book.findById(parseInt(id));
        if (!book) {
            res.status(404).json({ message: "Book not found" });
            return;
        }

        // mark the book as borrowed
        const response = await Book.findOneAndUpdate({
            id: parseInt(id),
            isAvailable: false,
        });

        if (!response) {
            res.status(500).json({ message: "An error occurred" });
            return;
        }

        // create a transaction
        const user = req.session?.authenticatedUser;
        const transaction = new Transaction(user!.id, parseInt(id), "borrowed");
        await transaction.save();

        res.status(200).json({
            message: "Book borrowed successfully",
            success: true,
        });
    }

    static async borrowHistory(req: Request, res: Response) {
        const userId = req.session?.authenticatedUser?.id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const transactions = await Transaction.findByUserId(userId);
        res.render("history", { transactions });
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

            return res.status(400).render("admin/addBooks", {
                error: extractedErrors,
            });
        }

        try {
            const { title, description, author, publicationdate, pages } =
                matchedData(req);
            const image = req.file;
            const coverImage = image ? image.filename : undefined;

            const book = new Book(
                title,
                description,
                author,
                publicationdate,
                pages,
                coverImage
            );
            await book.save();

            res.redirect(
                "/admin/books/list?message=Book+added+successfully%21+%F0%9F%93%9A"
            );
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

    // delete book endpoint handler
    static async deleteBook(req: Request, res: Response) {
        const { bookId } = req.params;

        // find book byy id, to delete cover image after deleting the book
        const book = await Book.findById(parseInt(bookId));

        const response = await Book.findOneAndDelete(parseInt(bookId));
        if (!response) {
            res.status(500).json({ message: "An error occurred" });
            return;
        }

        // delete cover image
        if (book!.coverimage) {
            const pathToCoverImage = path.join(
                __dirname,
                "..",
                "public/books",
                book.coverimage
            );
            fs.unlinkSync(path.resolve(pathToCoverImage));
        }

        res.status(200).json({
            message: "Book deleted successfully",
            success: true,
        });
    }

    // edit book endpoint handler
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
        const { title, description, author, publicationdate, pages } =
            matchedData(req);
        const response = await Book.findOneAndUpdate({
            id: parseInt(bookId),
            title,
            description,
            author,
            publicationDate: publicationdate,
            pages,
        });

        if (!response) {
            res.status(500).json({ message: "An error occurred" });
            return;
        }

        res.status(200).json({
            message: "Book updated successfully",
            success: true,
        });
    }

    static async getTransactions(req: Request, res: Response) {
        const transactions = await Transaction.findAll();
        res.render("admin/transactions", { transactions });
    }

    static async returnBook(req: Request, res: Response) {
        const { transactionId } = req.params;

        const transaction = await Transaction.findById(parseInt(transactionId));
        if (!transaction) {
            res.status(404).json({ message: "Transaction not found" });
            return;
        }

        const response = await Transaction.findOneAndUpdate({
            id: parseInt(transactionId),
            status: "returned",
            returnedDate: new Date().toISOString(),
        });

        if (!response) {
            res.status(500).json({ message: "An error occurred" });
            return;
        }

        // mark the book as available
        const book = await Book.findOneAndUpdate({
            id: transaction.bookid,
            isAvailable: true,
        });

        if (!book) {
            res.status(500).json({ message: "An error occurred" });
            return;
        }

        res.status(200).render("admin/transactions", {
            transactions: await Transaction.findAll(),
            message: "Book returned successfully",
        });
    }

    static async getReport(req: Request, res: Response) {
        res.render("admin/report", {});
    }
}

export { BooksController, AdminBooksManagementController };
