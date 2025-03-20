import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { OAQuestions } from "../models/OAQuestions.model.js";
import { Company } from "../models/company.model.js";

// @desc      Get all OA questions
// @route     GET /api/v1/oa-questions
// @access    Private
const getOAQuestions = asyncHandler(async (req, res) => {
  const questions = await OAQuestions.find().populate("companyId");
  return res.status(200).json(new ApiResponse(200, questions));
});

// @desc      Get a single OA question
// @route     GET /api/v1/oa-questions/:id
// @access    Private
const getOAQuestion = asyncHandler(async (req, res) => {
  const question = await OAQuestions.findById(req.params.id).populate(
    "companyId"
  );

  if (!question) {
    throw new ApiError(404, "OA question not found");
  }

  return res.status(200).json(new ApiResponse(200, question));
});

// @desc      Create a new OA question
// @route     POST /api/v1/oa-questions
// @access    Private
const createOAQuestion = asyncHandler(async (req, res) => {
  // only admin can create a OA question
  if (req.user.role !== "admin") {
    throw new ApiError(403, "You are not authorized to create a OA question");
  }
  const question = await OAQuestions.create(req.body);
  await Company.findByIdAndUpdate(question.companyId, {
    $push: { questions: question._id },
  });
  return res.status(201).json(new ApiResponse(201, question));
});

// @desc      Update a OA question
// @route     PUT /api/v1/oa-questions/:id
// @access    Private
const updateOAQuestion = asyncHandler(async (req, res) => {
  // only admin can update a OA question
  if (req.user.role !== "admin") {
    throw new ApiError(403, "You are not authorized to update a OA question");
  }

  const question = await OAQuestions.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!question) {
    throw new ApiError(404, "OA question not found");
  }

  return res.status(200).json(new ApiResponse(200, question));
});

// @desc      Delete a OA question
// @route     DELETE /api/v1/oa-questions/:id
// @access    Private
const deleteOAQuestion = asyncHandler(async (req, res) => {
  // only admin can delete a OA question
  if (req.user.role !== "admin") {
    throw new ApiError(403, "You are not authorized to delete a OA question");
  }
  const question = await OAQuestions.findByIdAndDelete(req.params.id);

  if (!question) {
    throw new ApiError(404, "OA question not found");
  }

  return res.status(200).json(new ApiResponse(200, {}));
});

export {
  getOAQuestions,
  getOAQuestion,
  createOAQuestion,
  updateOAQuestion,
  deleteOAQuestion,
};
