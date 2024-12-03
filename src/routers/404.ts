import { Router } from "express";
import _404Controller from "../controllers/404";

const router = Router();

router.use(_404Controller.index);

export { router as _404Router };
