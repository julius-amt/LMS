import { client } from "../utils/dbConfig";

class Transaction {
    private userId: number;
    private bookId: number;
    private status: string;

    constructor(userId: number, bookId: number, status: string) {
        this.userId = userId;
        this.bookId = bookId;
        this.status = status;

        Transaction.createTable();
    }

    private static async createTable() {
        try {
            await client.query(`
                CREATE TABLE IF NOT EXISTS transactions (
                    id SERIAL PRIMARY KEY,
                    userId INTEGER NOT NULL,
                    bookId INTEGER NOT NULL,
                    status VARCHAR(10) NOT NULL,
                    returndate TIMESTAMP,
                    createdAt TIMESTAMP DEFAULT NOW()
                )`);
        } catch (error) {
            console.error(error);
        }
    }

    async save() {
        try {
            await client.query(
                `INSERT INTO transactions (userId, bookId, status) VALUES ($1, $2, $3)`,
                [this.userId, this.bookId, this.status]
            );
            console.log("Transaction saved successfully:", this.bookId);
        } catch (error) {
            console.error("Error saving user:", error);
        }
    }

    static async findById(id: number) {
        try {
            const result = await client.query(
                `
                    SELECT * FROM transactions WHERE id = $1
                `,
                [id]
            );
            return result.rows[0];
        } catch (error) {
            console.log(error);
        }
    }

    static async findAll() {
        try {
            const results = await client.query(`
                SELECT 
                    transactions.id AS transactionId,
                    transactions.returndate,
                    transactions.createdAt AS transactionCreatedAt,
                    transactions.status,
                    books.title,
                    books.author,
                    books.createdAt AS bookCreatedAt
                FROM transactions
                INNER JOIN books ON transactions.bookId = books.id
                `);
            return results.rows;
        } catch (error) {
            console.error(error);
        }
    }

    static async findByUserId(userId: number) {
        try {
            const results = await client.query(
                `
                SELECT 
                    transactions.id AS transactionId,
                    transactions.returndate,
                    transactions.createdAt AS transactionCreatedAt,
                    transactions.status,
                    books.title,
                    books.author,
                    books.createdAt AS bookCreatedAt
                FROM transactions
                INNER JOIN books ON transactions.bookId = books.id
                WHERE transactions.userId = $1
                `,
                [userId]
            );
            return results.rows;
        } catch (error) {
            console.error("Error fetching transactions for user:", error);
        }
    }
}

export default Transaction;
