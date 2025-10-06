import express from "express";
import upload from "../Middleware/upload.js";
import { streamVideoOfAnimal, streamVideoOfAnimalsWithPagination, uploadAnimalVideo } from "../Controllers/AnimalVedioImage.Controller.js";

const router = express.Router();

router.post("/video/upload", upload.single("video"), uploadAnimalVideo);
router.get("/video/stream/:id", streamVideoOfAnimal);
router.get("/video/nearby", streamVideoOfAnimalsWithPagination);


export default router;
