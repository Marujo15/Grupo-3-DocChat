import { Router } from "express";
import { userCotroller } from "../controllers/userController";

const router: Router = Router();

router.get("/me", userCotroller.getUserMe);
router.get("/:userId", userCotroller.getUserById);
// router.delete("/:userId", adminOnly, deleteUser);
// router.patch("/:userId", updateUser);
router.get("/", userCotroller.getAllUsers);

export default router;
