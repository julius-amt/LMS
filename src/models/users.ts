import { client } from "../utils/dbConfig";

class User {
    private name: string;
    private email: string;
    private password: string;
    private role: string;

    constructor(name: string, email: string, password: string, role: string) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;

        // Ensure the table exists upon creating the first User instance
        User.createTable();
    }

    private static async createTable() {
        try {
            await client.query(
                `CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    email VARCHAR(100) NOT NULL UNIQUE,
                    password VARCHAR(100) NOT NULL,
                    role VARCHAR(100) NOT NULL CHECK (role IN ('admin', 'user'))
                )`
            );
        } catch (error) {
            console.error(error);
        }
    }

    async save() {
        try {
            await client.query(
                `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)`,
                [this.name, this.email, this.password, this.role]
            );
            return 1;
        } catch (error) {
            console.error("Error saving user:", error);
            return 0;
        }
    }

    static async findAll() {
        try {
            const result = await client.query(`SELECT * FROM users`);
            return result.rows;
        } catch (error) {
            console.error(error);
        }
    }

    static async findById(id: number) {
        try {
            const result = await client.query(
                `SELECT * FROM users WHERE id = $1`,
                [id]
            );
            return result.rows[0];
        } catch (error) {
            console.error(error);
        }
    }

    static async findByEmail(email: string) {
        try {
            const result = await client.query(
                `SELECT * FROM users WHERE email = $1`,
                [email]
            );
            return result.rows[0];
        } catch (error) {
            console.error(error);
        }
    }

    static async countUsers() {
        try {
            const result = await client.query(`SELECT COUNT(*) FROM users`);
            return result.rows[0].count;
        } catch (error) {
            console.error(error);
        }
    }
}

export default User;
