import express, { json, urlencoded } from "express";
import session from "express-session";
import morgan from "morgan";
import path from "path";
import { BooksRouter } from "./routers/books";
import { AdminBooksManagementRouter } from "./routers/admin/books";
import { AuthRouter } from "./routers/auth";
import expressLayouts from "express-ejs-layouts";

const app = express();
const PORT = 3000;

// seesion store
const store = new session.MemoryStore();

app.use(
    session({
        secret: "secret",
        cookie: { maxAge: 24 * 60 * 60 * 1000 },
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

app.use("/books/", BooksRouter);
app.use("/admin/books/", AdminBooksManagementRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
