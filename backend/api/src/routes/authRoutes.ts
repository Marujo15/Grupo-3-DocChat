import { Router } from "express";
import { authenticate, logout } from "../controllers/loginController";
import { createUser } from "../controllers/userController";

const router: Router = Router();

router.post("/login", authenticate);
router.delete("/logout", logout);
router.post("/register", createUser);

export default router;
