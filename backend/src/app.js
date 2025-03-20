import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config({ path: "/env" });

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

import userRouter from "./routes/user.route.js";
import oaQuestionRouter from "./routes/oaQuestion.route.js";
import companyRouter from "./routes/company.route.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/oa-questions", oaQuestionRouter);
app.use("/api/v1/companies", companyRouter);
app.post("/execute", async (req, res) => {
  const { language, code, input } = req.body;

  // Judge0 API URL
  const apiUrl = "https://judge0-ce.p.rapidapi.com/submissions";

  const languageMap = {
    cpp: 54, // C++ (GCC 9.2)
    python: 71, // Python (3.8)
    java: 62, // Java (OpenJDK 13)
    javascript: 63, // JavaScript (Node.js 12.14.0)
  };

  try {
    const response = await axios.post(
      apiUrl,
      {
        source_code: code,
        language_id: languageMap[language],
        stdin: input,
      },
      {
        headers: {
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY, // Get API Key from RapidAPI
        },
      }
    );

    const token = response.data.token;

    // Wait for result
    setTimeout(async () => {
      const result = await axios.get(`${apiUrl}/${token}`, {
        headers: {
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        },
      });

      res.json({ output: result.data.stdout || result.data.stderr });
    }, 3000);
  } catch (error) {
    res.status(500).json({ error: "Execution error" });
  }
});

export default app;
