import { Router, type IRouter } from "express";
import healthRouter from "./health";
import contactRouter from "./contact";
import previewGeneratorRouter from "./preview-generator";
import stripeRouter from "./stripe";
import downloadRouter from "./download";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/contact", contactRouter);
router.use("/preview-generator", previewGeneratorRouter);
router.use("/generate-page", downloadRouter);
router.use(stripeRouter);

export default router;
