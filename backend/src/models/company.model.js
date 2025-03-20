// this is company model which contains comany id, name, and list of OA questions
// and OA questions comes from OAQuestions model

import mongoose, { Schema } from "mongoose";

const companySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a company name"],
    },
    questions: [
      {
        type: Schema.Types.ObjectId,
        ref: "OAQuestions",
      },
    ],
  },
  { timestamps: true }
);

export const Company = mongoose.model("Company", companySchema);
