import express from "express";
import { addParticipant } from "../controllers/participantController.js";

const router = express.Router();

router.post("/join", addParticipant);

export default router;
