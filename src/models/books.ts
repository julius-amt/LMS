import { client } from "../utils/dbConfig";

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
            console.log("User table created!");
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

    static async findOneAndUpdate(
        id: number,
        title?: string,
        description?: string,
        author?: string,
        coverImage?: string,
        isAvailable?: boolean,
        publicationDate?: Date,
        pages?: number
    ) {
        const setClause = [];
        const values = [];

        if (title) {
            setClause.push(`title = $${setClause.length + 1}`);
            values.push(title);
        }
        if (description) {
            setClause.push(`description = $${setClause.length + 1}`);
            values.push(description);
        }
        if (author) {
            setClause.push(`author = $${setClause.length + 1}`);
            values.push(author);
        }
        if (coverImage) {
            setClause.push(`coverImage = $${setClause.length + 1}`);
            values.push(coverImage);
        }
        if (isAvailable !== undefined) {
            setClause.push(`isAvailable = $${setClause.length + 1}`);
            values.push(isAvailable);
        }
        if (publicationDate) {
            setClause.push(`publicationDate = $${setClause.length + 1}`);
            values.push(publicationDate);
        }
        if (pages) {
            setClause.push(`pages = $${setClause.length + 1}`);
            values.push(pages);
        }

        if (setClause.length === 0) {
            throw new Error("No fields to update.");
        }

        // Construct the final query string
        const query = `
            UPDATE books
            SET ${setClause.join(", ")}
            WHERE id = $${setClause.length + 1}
            RETURNING *;
        `;
        values.push(id); // Add id as the last value

        try {
            await client.query(query, values);
            return 1;
        } catch (error) {
            console.error(error);
            return 0;
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
}

export default Book;
