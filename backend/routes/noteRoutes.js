import express from "express";
import { saveNote, getNote } from "../controllers/noteController.js";

const router = express.Router();

router.post("/save", saveNote);
router.get("/:roomId", getNote);

export default router;
