import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config({ path: "/env" });

const app = express();

app.use(
  cors({
    origin: "https://oa-practice-platform.vercel.app/",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

import userRouter from "./routes/user.route.js";
import oaQuestionRouter from "./routes/oaQuestion.route.js";
import companyRouter from "./routes/company.route.js";
import { execute, runHiddenTests } from "./controllers/execute.controller.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/oa-questions", oaQuestionRouter);
app.use("/api/v1/companies", companyRouter);
app.post("/execute", execute);
app.post("/run-hidden-tests", runHiddenTests);

export default app;
