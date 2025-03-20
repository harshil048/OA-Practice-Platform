import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Editor from "@monaco-editor/react";
import axios from "axios";

const QuestionPage = () => {
  const { id } = useParams();
  const { companies } = useSelector((state) => state.company);
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState("// Write your code here");
  const [language, setLanguage] = useState("cpp");
  const [output, setOutput] = useState("");

  useEffect(() => {
    for (const company of companies) {
      const foundQuestion = company.questions.find((q) => q._id === id);
      if (foundQuestion) {
        setQuestion(foundQuestion);
        break;
      }
    }
  }, [companies, id]);

  const handleRunCode = async () => {
    try {
      const response = await axios.post("http://localhost:8000/execute", {
        language,
        code,
        input: question.input,
      });
      setOutput(response.data.output);
    } catch (error) {
      setOutput("Error executing code.");
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

      <h3 className="mt-4 font-semibold">Output:</h3>
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
      >
        Run Code
      </button>

      {/* Output Section */}
      {output && (
        <div className="mt-4 p-2 border rounded bg-gray-100">
          <h3 className="font-semibold">Output:</h3>
          <pre>{output}</pre>
        </div>
      )}
    </div>
  );
};

export default QuestionPage;
