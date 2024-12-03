import { Router } from "express";
import ReportController from "../../controllers/report";

const router = Router();

router.get("/", ReportController.getReportPage);

export { router as AdminReportRouter };
