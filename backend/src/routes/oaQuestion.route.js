import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createOAQuestion,
  deleteOAQuestion,
  getOAQuestion,
  getOAQuestions,
  updateOAQuestion,
} from "../controllers/oaQuestions.controller.js";

const router = Router();

router.route("/").get(getOAQuestions).post(verifyJWT, createOAQuestion);
router
  .route("/:id")
  .get(getOAQuestion)
  .put(verifyJWT, updateOAQuestion)
  .delete(verifyJWT, deleteOAQuestion);

export default router;
