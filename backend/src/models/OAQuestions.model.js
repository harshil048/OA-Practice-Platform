// this OAQuestions model contains OA question which is a coding question and it includes description, input, output, and
// constraints of the question, company id and hidden test cases wich includes input and output

import mongoose, { Schema } from "mongoose";

const oaQuestionsSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
    input: {
      type: String,
      required: [true, "Please provide an input"],
    },
    output: {
      type: String,
      required: [true, "Please provide an output"],
    },
    constraints: {
      type: String,
      required: [true, "Please provide constraints"],
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
    hiddenTestCases: [
      {
        input: {
          type: String,
          required: [true, "Please provide an input"],
        },
        output: {
          type: String,
          required: [true, "Please provide an output"],
        },
      },
    ],
  },
  { timestamps: true }
);

export const OAQuestions = mongoose.model("OAQuestions", oaQuestionsSchema);
