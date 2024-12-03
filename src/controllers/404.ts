import { Response, Request, NextFunction } from "express";

class _404Controller {
    static index(req: Request, res: Response, next: NextFunction) {
        res.status(404).render("404", {
            layout: false,
            message: "The page you are looking for does not exist.",
        });
    }
}

export default _404Controller;
