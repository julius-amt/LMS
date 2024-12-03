import { Response, Request } from "express";
import User from "../models/users";
import Transaction from "../models/transactions";
import Book from "../models/books";

class ReportController {
    static async getReportPage(req: Request, res: Response) {
        // get users count
        const usersCount = await User.countUsers();

        // get books count
        const booksCount = await Book.countBooks();

        // get transactions count
        const transactionsCount = await Transaction.countTransactions();

        // get total number of books borrowed
        const borrowedBooksCount = await Transaction.countBorrowedBooks();

        // get total number of books returned
        const returnedBooksCount = transactionsCount - borrowedBooksCount;

        // get total number of users who borrowed books
        const usersWhoBorrowedBooks = await Transaction.countUniqueUsers();

        res.render("admin/report", {
            usersCount,
            booksCount,
            transactionsCount,
            borrowedBooksCount,
            returnedBooksCount,
            usersWhoBorrowedBooks,
        });
    }
}

export default ReportController;
