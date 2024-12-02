import { Response, Request, NextFunction } from "express";

export const addSessionDataToLocals = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    res.locals.authenticatedUser = req.session?.authenticatedUser || null;
    next();
};
