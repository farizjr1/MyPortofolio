import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import profileRouter from "./profile";
import portfolioRouter from "./portfolio";
import contentRouter from "./content";
import cvRouter from "./cv";
import contactRouter from "./contact";
import blogRouter from "./blog";
import analyticsRouter from "./analytics";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/profile", profileRouter);
router.use("/portfolio", portfolioRouter);
router.use("/content", contentRouter);
router.use("/cv", cvRouter);
router.use("/contact", contactRouter);
router.use("/blog", blogRouter);
router.use("/analytics", analyticsRouter);

export default router;
