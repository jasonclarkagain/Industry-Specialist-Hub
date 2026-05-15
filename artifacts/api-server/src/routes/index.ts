import { Router, type IRouter } from "express";
import healthRouter from "./health";
import contactRouter from "./contact";
import previewGeneratorRouter from "./preview-generator";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/contact", contactRouter);
router.use("/preview-generator", previewGeneratorRouter);

export default router;
