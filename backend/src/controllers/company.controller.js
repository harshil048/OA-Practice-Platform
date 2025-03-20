import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Company } from "../models/company.model.js";
import { OAQuestions } from "../models/OAQuestions.model.js";

// @desc      Get all companies
// @route     GET /api/v1/companies
// @access    Private
const getCompanies = asyncHandler(async (req, res) => {
  const companies = await Company.find().populate("questions");
  return res.status(200).json(new ApiResponse(200, companies));
});

// @desc      Get a single company
// @route     GET /api/v1/companies/:id
// @access    Private
const getCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id).populate("questions");

  if (!company) {
    throw new ApiError(404, "Company not found");
  }

  return res.status(200).json(new ApiResponse(200, company));
});

// @desc      Create a new company
// @route     POST /api/v1/companies
// @access    Private
const createCompany = asyncHandler(async (req, res) => {
  // only admin can create a company
  // company schema has a name and list of questions
  // list of questions comes from OAQuestions model
  // OAQuestions model has a description, input, output, constraints, company id, and hidden test cases
  // hidden test cases is a array of objects which includes input and output
  if (req.user.role !== "admin") {
    throw new ApiError(403, "You are not authorized to create a company");
  }
  const company = await Company.create(req.body);
  return res.status(201).json(new ApiResponse(201, company));
});

// @desc      Update a company
// @route     PUT /api/v1/companies/:id
// @access    Private
const updateCompany = asyncHandler(async (req, res) => {
  // only admin can update a company
  if (req.user.role !== "admin") {
    throw new ApiError(403, "You are not authorized to update a company");
  }
  const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!company) {
    throw new ApiError(404, "Company not found");
  }

  return res.status(200).json(new ApiResponse(200, company));
});

// @desc      Delete a company
// @route     DELETE /api/v1/companies/:id
// @access    Private
const deleteCompany = asyncHandler(async (req, res) => {
  // only admin can delete a company
  if (req.user.role !== "admin") {
    throw new ApiError(403, "You are not authorized to delete a company");
  }
  const company = await Company.findByIdAndDelete(req.params.id);

  if (!company) {
    throw new ApiError(404, "Company not found");
  }

  return res.status(200).json(new ApiResponse(200, {}));
});

// @desc      Get all questions of a company
// @route     GET /api/v1/companies/:id/questions
// @access    Private
const getCompanyQuestions = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id).populate("questions");

  if (!company) {
    throw new ApiError(404, "Company not found");
  }

  return res.status(200).json(new ApiResponse(200, company.questions));
});

export {
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
  getCompanyQuestions,
};
