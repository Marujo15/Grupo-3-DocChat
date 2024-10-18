import { Router } from "express";
import userRouter from "./userRoutes";
import authRouter from "./authRoutes";
import { authenticateJWT } from "../middlewares/auth";
import questionRoutes from "./questionRoutes";
import urlRoutes from "./urlRoutes";
import chatRoutes from "./chatRoutes";

const router = Router();

router.use("/chat", authenticateJWT, chatRoutes);
router.use("/users", authenticateJWT, userRouter);
router.use("/url", authenticateJWT, urlRoutes);
router.use("/auth", authRouter);
router.use("/question", questionRoutes);

export default router;
