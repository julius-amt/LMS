import User from "../models/users";
import { Response, Request } from "express";
import { matchedData, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import "express-session";

declare module "express-session" {
    interface SessionData {
        authenticatedUser: {
            id: number;
            role: string;
            name: string;
        };
    }
}

class AuthController {
    static async createUser(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const extractedErrors: string[] = ["Error(s): "];
                errors.array().map((err) => extractedErrors.push(err.msg));

                res.status(400).render("auth/signup", {
                    layout: false,
                    error: extractedErrors,
                });
                return;
            }

            const { name, password, email } = matchedData(req);

            // verify if email already exists
            const user = await User.findByEmail(email);
            if (user) {
                res.status(400).render("auth/signup", {
                    layout: false,
                    error: "Email already exists",
                });
                return;
            }

            // hash password
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);

            // save user to db
            const newUser = new User(name, email, hashPassword, "user");
            await newUser.save();

            res.redirect(
                "/auth/login?message=User+created+successfully%21+%F0%9F%93%9A"
            );
        } catch (error) {
            res.status(500).render("auth/signup", {
                layout: false,
                error: "An error occurred, please try again",
            });
        }
    }

    static getSignupPage(req: Request, res: Response) {
        res.render("auth/signup", { layout: false, error: null });
    }

    static async loginUser(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const extractedErrors: string[] = ["Error(s): "];
                errors.array().map((err) => extractedErrors.push(err.msg));

                res.status(400).render("auth/login", {
                    error: extractedErrors,
                });
                return;
            }

            const { email, password } = matchedData(req);

            // verify if email exists
            const user = await User.findByEmail(email);
            if (!user) {
                res.status(400).render("auth/login", {
                    error: "Bad credentials",
                });
                return;
            }

            // verify password
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                res.status(400).render("auth/login", {
                    layout: false,
                    error: "Bad credentials",
                });
                return;
            }

            req.session.authenticatedUser = {
                id: user.id,
                role: user.role,
                name: user.name,
            };

            res.redirect("/books");
        } catch (error) {
            res.status(500).render("auth/login", {
                error: "An error occurred, please try again",
            });
        }
    }

    static getLoginPage(req: Request, res: Response) {
        res.render("auth/login", {
            layout: false,
            message: "User created successfully! 📚",
            showAlert: true,
        });
    }

    // logout endpint
    static logoutUser(req: Request, res: Response) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).send("Error logging out.");
            }

            res.clearCookie("connect.username");

            res.status(200).json({
                message: "Logged out successfully!",
                success: true,
            });
        });
    }
}

export default AuthController;
