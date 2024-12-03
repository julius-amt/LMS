import express, { json, urlencoded } from "express";
import session from "express-session";
import morgan from "morgan";
import path from "path";
import { BooksRouter } from "./routers/books";
import { AdminBooksManagementRouter } from "./routers/admin/books";
import { AuthRouter } from "./routers/auth";
import expressLayouts from "express-ejs-layouts";
import {
    authenticateUserMiddleware,
    authenticateAdminMiddleware,
} from "./utils/middleware/authenticateUser";
import { addSessionDataToLocals } from "./utils/middleware/addDataToLocals";
import { AdminReportRouter } from "./routers/admin/report";

const app = express();
const PORT = 3000;

// seesion store
const store = new session.MemoryStore();

app.use(
    session({
        secret: "secret",
        cookie: { maxAge: 24 * 60 * 60 * 1000, secure: false },
        saveUninitialized: false,
        resave: false,
        store,
    })
);

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan("dev"));

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.resolve(__dirname, "public")));
app.use(expressLayouts);

app.set("layout", "layouts/layout");
app.use("/auth", AuthRouter);

// middlware to authenticate user
app.use(authenticateUserMiddleware, addSessionDataToLocals);
app.use("/books/", BooksRouter);

// middleware to authenticate admin
app.use(authenticateAdminMiddleware);
app.use("/admin/books/", AdminBooksManagementRouter);
app.use("/admin/report/", AdminReportRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
