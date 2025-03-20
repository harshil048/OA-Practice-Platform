import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createCompany,
  deleteCompany,
  getCompany,
  getCompanies,
  updateCompany,
  getCompanyQuestions,
} from "../controllers/company.controller.js";

// @route     GET /api/v1/companies
// @route     GET /api/v1/companies/:id
// @route     POST /api/v1/companies
// @route     PUT /api/v1/companies/:id
// @route     DELETE /api/v1/companies/:id

const router = Router();

router.route("/").get(getCompanies).post(verifyJWT, createCompany);
router
  .route("/:id")
  .get(getCompany)
  .put(verifyJWT, updateCompany)
  .delete(verifyJWT, deleteCompany);

router.route("/:id/questions").get(verifyJWT, getCompanyQuestions);

export default router;
