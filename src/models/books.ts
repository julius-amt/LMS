import { client } from "../utils/dbConfig";
import { UpdateBookDataType } from "../utils/types/book-update";

class Book {
    private title: string;
    private description: string;
    private author: string;
    private coverImage: string;
    private publicationDate: Date;
    private pages: number;

    constructor(
        title: string,
        description: string,
        author: string,
        publicationDate: Date,
        pages: number,
        coverImage?: string
    ) {
        this.title = title;
        this.description = description;
        this.author = author;
        this.publicationDate = publicationDate;
        this.pages = pages;
        this.coverImage = coverImage || "book-placeholder.png";

        Book.createTable();
    }

    private static async createTable() {
        try {
            await client.query(
                `CREATE TABLE IF NOT EXISTS books (
                    id SERIAL PRIMARY KEY,
                    title VARCHAR(200) NOT NULL,
                    description VARCHAR(500) NOT NULL,
                    author VARCHAR(100) NOT NULL,
                    publicationDate DATE,
                    pages INT,
                    coverImage VARCHAR(200),
                    isAvailable BOOLEAN DEFAULT TRUE,
                    createdAt TIMESTAMP DEFAULT NOW()
                )`
            );
            return 1;
        } catch (error) {
            console.error(error);
            return 0;
        }
    }

    async save() {
        try {
            await client.query(
                `INSERT INTO books (title, description, author, publicationDate, pages, coverImage) VALUES ($1, $2, $3, $4, $5, $6)`,
                [
                    this.title,
                    this.description,
                    this.author,
                    this.publicationDate,
                    this.pages,
                    this.coverImage,
                ]
            );

            return 1;
        } catch (error) {
            console.error(error);
            return 0;
        }
    }

    static async findAll() {
        try {
            const result = await client.query(`SELECT * FROM books`);

            return result.rows;
        } catch (error) {
            console.error(error);
        }
    }

    static async findById(id: number) {
        try {
            const result = await client.query(
                `SELECT * FROM books WHERE id = $1`,
                [id]
            );

            return result.rows[0];
        } catch (error) {
            console.error(error);
        }
    }

    static async findOneAndUpdate(updateData: UpdateBookDataType) {
        const { id, ...fieldsToUpdate } = updateData;

        // Ensure there's an ID and at least one field to update
        if (!id) throw new Error("ID is required to update the book.");
        if (!Object.keys(fieldsToUpdate).length)
            throw new Error("No fields to update.");

        // Construct the SET clause dynamically
        const setClause: string[] = [];
        const values = [];

        Object.entries(fieldsToUpdate).forEach(([key, value]) => {
            if (value !== undefined) {
                // Skip undefined values
                setClause.push(`${key} = $${setClause.length + 1}`);
                values.push(value);
            }
        });

        // Add the ID as the last parameter
        values.push(id);

        const query = `
            UPDATE books
            SET ${setClause.join(", ")}
            WHERE id = $${setClause.length + 1}
            RETURNING *;
        `;

        try {
            const result = await client.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error("Error updating book:", error);
            throw new Error("Failed to update the book.");
        }
    }

    static async findOneAndDelete(id: number) {
        try {
            await client.query(
                `DELETE FROM books
                WHERE id = $1`,
                [id]
            );

            return 1;
        } catch (error) {
            console.error(error);
            return 0;
        }
    }

    static async markAsUnavailable(id: number) {
        try {
            await client.query(
                `UPDATE books
                SET isAvailable = FALSE
                WHERE id = $1`,
                [id]
            );

            return 1;
        } catch (error) {
            console.error(error);
            return 0;
        }
    }

    static async markAsAvailable(id: number) {
        try {
            await client.query(
                `UPDATE books
                SET isAvailable = TRUE
                WHERE id = $1`,
                [id]
            );

            return 1;
        } catch (error) {
            console.error(error);
            return 0;
        }
    }

    static async countBooks() {
        try {
            const result = await client.query(`SELECT COUNT(*) FROM books`);

            return result.rows[0].count;
        } catch (error) {
            console.error(error);
        }
    }
}

export default Book;
