import { Router } from "express";
import userRouter from "./userRoutes";
import authRouter from "./authRoutes";
// import chatRouter from "./chatRoutes";
import { authenticateJWT } from "../middlewares/auth";
import testRoutes from "./testRoutes";
import scrapeRoutes from "./scrapeRoutes";
import vectorRoutes from "./vectorRoutes";
import questionRoutes from "./questionRoutes";

const router = Router();

// router.use("/chat", authenticateJWT, chatRouter);
router.use("/users", authenticateJWT, userRouter);
router.use("/auth", authRouter);
router.use("/test", testRoutes);
router.use("/scrape", scrapeRoutes);
router.use("/vector", vectorRoutes);
router.use("/question", questionRoutes);

export default router;
