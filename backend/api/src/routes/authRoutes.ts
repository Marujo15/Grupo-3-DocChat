import { Router } from "express";
import { loginController } from "../controllers/loginController";
import { userCotroller } from "../controllers/userController";

const router: Router = Router();

router.post("/login", loginController.authenticate);
router.delete("/logout", loginController.logout);
router.post("/register", userCotroller.createUser);

export default router;
