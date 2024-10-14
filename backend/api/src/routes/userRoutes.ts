import { Router } from "express";
import { getUserById, getUserMe } from "../controllers/userController";

const router: Router = Router();

router.get("/me", getUserMe);
router.get("/:userId", getUserById);
// router.delete("/:userId", adminOnly, deleteUser);
// router.patch("/:userId", updateUser);
// router.get("/", adminOnly, getAllUsers);

export default router;
