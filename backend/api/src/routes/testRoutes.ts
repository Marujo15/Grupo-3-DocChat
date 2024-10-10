import express from "express";
import { testController } from "../controllers/testController";
import { Router } from "express";

const router: Router = express.Router();

router.get("/", testController.getAllTests);

export default router;
