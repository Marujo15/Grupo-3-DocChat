import { Router } from "express";
import authRouter from "./authRoutes";
import scrapeRoutes from "./scrapeRoutes";
import chatRoutes from "./chatRoutes";
import userRouter from "./userRoutes";
import urlRoutes from "./urlRoutes";
import { authenticateJWT } from "../middlewares/auth";

const router = Router();

router.use("/auth", authRouter);
router.use("/scrape", scrapeRoutes);
router.use("/chat", authenticateJWT, chatRoutes);
router.use("/users", authenticateJWT, userRouter);
router.use("/url", authenticateJWT, urlRoutes);

export default router;
