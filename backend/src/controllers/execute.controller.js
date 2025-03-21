import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import dotenv from "dotenv";
dotenv.config({ path: "/env" });
import axios from "axios";

const execute = asyncHandler(async (req, res) => {
  const { language, code, input, output } = req.body;

  try {
    const languageMap = {
      cpp: 54,
      python: 71,
      java: 62,
      javascript: 63,
    };

    const response = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions",
      {
        source_code: code,
        language_id: languageMap[language],
        stdin: input,
      },
      {
        headers: {
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        },
      }
    );

    const token = response.data.token;
    let result;
    while (!result || result.status.id <= 2) {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait before checking again
      const response = await axios.get(
        `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
        {
          headers: {
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          },
        }
      );
      result = response.data;
    }
    result.stdout = result.stdout ? result.stdout.trim() : "";
    result.expectedOutput = output ? output.trim() : "";
    result.passed = result.stdout == result.expectedOutput;

    return res
      .status(200)
      .json(new ApiResponse(200, result, "Code executed successfully"));
  } catch (error) {
    console.error("Execution error:", error);
    throw new ApiError(500, "Error executing code");
  }
});

const runHiddenTests = asyncHandler(async (req, res) => {
  const { language, code, hiddenTests } = req.body;

  try {
    const languageMap = {
      cpp: 54,
      python: 71,
      java: 62,
      javascript: 63,
    };

    // Step 1: Submit all test cases
    const submissionPromises = hiddenTests.map(async (test) => {
      const response = await axios.post(
        "https://judge0-ce.p.rapidapi.com/submissions",
        {
          source_code: code,
          language_id: languageMap[language],
          stdin: test.input,
        },
        {
          headers: {
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          },
        }
      );

      return {
        token: response.data.token,
        expectedOutput: test.output,
      };
    });

    const tokensWithExpected = await Promise.all(submissionPromises);

    // Step 2: Fetch results for all submissions
    const fetchResults = async ({ token, expectedOutput }) => {
      let result;
      while (!result || result.status.id <= 2) {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait before checking again
        const response = await axios.get(
          `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
          {
            headers: {
              "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
              "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
            },
          }
        );
        result = response.data;
      }

      // Ensure stdout is valid before calling trim()
      const actualOutput = result.stdout ? result.stdout.trim() : "";
      const expected = expectedOutput ? expectedOutput.trim() : "";

      return {
        stdout: actualOutput,
        expectedOutput: expected,
        passed: actualOutput === expected, // Compare trimmed outputs
      };
    };

    const testResults = await Promise.all(tokensWithExpected.map(fetchResults));

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          testResults,
          "Hidden test cases executed successfully"
        )
      );
  } catch (error) {
    console.error("Execution error:", error);
    throw new ApiError(500, "Error running hidden test cases");
  }
});

export { execute, runHiddenTests };
