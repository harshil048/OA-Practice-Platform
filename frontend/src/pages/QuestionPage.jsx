import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanies } from "../redux/slices/companySlice";
import Editor from "@monaco-editor/react";
import axios from "axios";

const QuestionPage = () => {
  const { id } = useParams();
  const { companies } = useSelector((state) => state.company);
  const dispatch = useDispatch();

  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState("// Write your code here");
  const [language, setLanguage] = useState("cpp");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [hiddenTestResult, setHiddenTestResult] = useState(null);
  const [runningHiddenTests, setRunningHiddenTests] = useState(false);

  useEffect(() => {
    if (companies.length > 0) {
      for (const company of companies) {
        const foundQuestion = company.questions.find((q) => q._id === id);
        if (foundQuestion) {
          setQuestion(foundQuestion);
          break;
        }
      }
    }
  }, [companies, id]);

  useEffect(() => {
    if (companies.length === 0) {
      dispatch(fetchCompanies());
    }
  }, [dispatch, companies]);

  const handleRunCode = async () => {
    setLoading(true);
    setTestResult(null);

    try {
      const response = await axios.post(
        "https://oa-practice-platform-uj4o.vercel.app/execute",
        {
          language,
          code,
          input: question.input,
          output: question.output,
        }
      );

      setOutput(response.data.output);
      setLoading(false);

      // Check if the output matches the expected sample output
      if (response.data.data.passed === true) {
        setTestResult("✅ Sample test case passed!");
      } else {
        setTestResult("❌ Sample test case failed.");
      }
    } catch (error) {
      setOutput("Error executing code.");
      setLoading(false);
    }
  };

  const handleRunHiddenTestCases = async () => {
    setRunningHiddenTests(true);
    setHiddenTestResult(null);

    try {
      const response = await axios.post(
        "https://oa-practice-platform-uj4o.vercel.app/run-hidden-tests",
        {
          language,
          code,
          hiddenTests: question.hiddenTestCases, // Assuming question has hidden test cases
        }
      );

      setRunningHiddenTests(false);
      setHiddenTestResult(response.data.data); // Expecting an array of results
    } catch (error) {
      setHiddenTestResult("Error running hidden test cases.");
      setRunningHiddenTests(false);
    }
  };

  if (!question) {
    return <div className="text-center mt-10">Loading question...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 border rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold">{question.title}</h1>
      <p className="mt-4">{question.description}</p>

      <h3 className="mt-4 font-semibold">Input:</h3>
      <pre className="bg-gray-100 p-2">{question.input}</pre>

      <h3 className="mt-4 font-semibold">Expected Output:</h3>
      <pre className="bg-gray-100 p-2">{question.output}</pre>

      <h3 className="mt-4 font-semibold">Constraints:</h3>
      <pre className="bg-gray-100 p-2">{question.constraints}</pre>

      {/* Language Selection */}
      <select
        className="mt-4 p-2 border rounded"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="cpp">C++</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
        <option value="javascript">JavaScript</option>
      </select>

      {/* Code Editor */}
      <div className="mt-4 border rounded">
        <Editor
          height="300px"
          language={language}
          value={code}
          onChange={(value) => setCode(value)}
          theme="vs-dark"
        />
      </div>

      {/* Run Code Button */}
      <button
        onClick={handleRunCode}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
        disabled={loading}
      >
        {loading ? "Running..." : "Run Code"}
      </button>

      {/* Output Section */}
      {loading && <p className="mt-4 text-blue-500">Executing code...</p>}
      {!loading && output && (
        <div className="mt-4 p-2 border rounded bg-gray-100">
          <h3 className="font-semibold">Output:</h3>
          <pre>{output}</pre>
        </div>
      )}

      {/* Sample Test Case Result */}
      {testResult && (
        <div
          className={`mt-4 p-2 rounded ${
            testResult.includes("✅") ? "bg-green-200" : "bg-red-200"
          }`}
        >
          <h3 className="font-semibold">{testResult}</h3>
        </div>
      )}

      {/* Run Hidden Test Cases */}
      <button
        onClick={handleRunHiddenTestCases}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        disabled={runningHiddenTests}
      >
        {runningHiddenTests
          ? "Running Hidden Tests..."
          : "Run Hidden Test Cases"}
      </button>

      {/* Hidden Test Cases Result */}
      {hiddenTestResult && (
        <div className="mt-4 p-2 border rounded bg-gray-100">
          <h3 className="font-semibold">Hidden Test Cases Result:</h3>
          {Array.isArray(hiddenTestResult) ? (
            hiddenTestResult.map((result, index) => (
              <p
                key={index}
                className={`mt-2 ${
                  result.passed ? "text-green-600" : "text-red-600"
                }`}
              >
                Test {index + 1}: {result.passed ? "✅ Passed" : "❌ Failed"}
                <br />
                <span className="text-gray-700">
                  Expected: <code>{result.expectedOutput}</code> | Got:{" "}
                  <code>{result.stdout}</code>
                </span>
              </p>
            ))
          ) : (
            <pre>{hiddenTestResult}</pre>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionPage;
