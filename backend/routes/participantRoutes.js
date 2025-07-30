import express from "express";
import { addParticipant, getParticipants } from "../controllers/participantController.js";

// Export a function that accepts io and participants
export default (io, participants) => {
    const router = express.Router();

    // Pass io and participants to your addParticipant controller
    router.post("/join", (req, res) => addParticipant(req, res, io, participants));
    
    // getParticipants might also need access to 'participants' if it's solely in-memory
    router.get("/", (req, res) => getParticipants(req, res, participants)); 

    return router;
};