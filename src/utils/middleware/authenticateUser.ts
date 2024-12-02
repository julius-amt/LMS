import { Response, Request, NextFunction } from "express";

export const authenticateUserMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (req.session?.authenticatedUser) {
        return next();
    }
    res.redirect("/auth/login");
};

// Middleware to ensure the user is an admin
export const authenticateAdminMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const user = req.session?.authenticatedUser;

    if (user && user.role === "admin") {
        return next();
    }

    res.status(403).send("Access denied. Admins only.");
};
