import { Router } from "express";
import { userController } from "../controllers/userController";
import { loginController } from "../controllers/loginController";

const router: Router = Router();

router.post("/register", userController.createUser);
router.post("/login", loginController.authenticate);
router.delete("/logout", loginController.logout);

export default router;
