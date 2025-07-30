import express from "express";
import { createRoom , getRoomById} from "../controllers/roomController.js";

const router = express.Router();

router.post("/create", createRoom);
// backend/routes/roomRoutes.js
router.get('/:roomId', getRoomById);


export default router;
