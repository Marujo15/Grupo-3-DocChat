import express from "express";
import { vectorController } from "../controllers/vectorController";
import { Router } from "express";

const router: Router = express.Router();

router.post("/", vectorController.addVector);

export default router;
