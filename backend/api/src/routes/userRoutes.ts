import { Router } from "express";
import { userController } from "../controllers/userController";

const router: Router = Router();

router.get("/me", userController.getUserMe);
router.get("/:userId", userController.getUserById);
// router.delete("/:userId", adminOnly, deleteUser);
// router.patch("/:userId", updateUser);
router.get("/", userController.getAllUsers);

export default router;
