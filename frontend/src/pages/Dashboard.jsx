import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/slices/authSlice";
import { fetchCompanies, createCompany } from "../redux/slices/companySlice";
import {
  createOAQuestion,
  updateOAQuestion,
  deleteOAQuestion,
} from "../redux/slices/oaQuestionsSlice";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { companies } = useSelector((state) => state.company);
  const { user } = useSelector((state) => state.auth);
  const [openCompany, setOpenCompany] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [showHiddenTestForm, setShowHiddenTestForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [updatedQuestion, setUpdatedQuestion] = useState({});

  const [newQuestion, setNewQuestion] = useState({
    title: "",
    description: "",
    input: "",
    output: "",
    constraints: "",
    companyId: "",
    hiddenTestCases: [],
  });

  const [hiddenTestCase, setHiddenTestCase] = useState({
    input: "",
    output: "",
  });

  const [newCompany, setNewCompany] = useState({ name: "" });

  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const handleAddQuestion = (e) => {
    e.preventDefault();
    dispatch(createOAQuestion(newQuestion));
    setShowForm(false);
  };

  const handleAddCompany = (e) => {
    e.preventDefault();
    dispatch(createCompany(newCompany));
    setShowCompanyForm(false);
  };

  const handleAddHiddenTestCase = () => {
    if (hiddenTestCase.input && hiddenTestCase.output) {
      setNewQuestion({
        ...newQuestion,
        hiddenTestCases: [...newQuestion.hiddenTestCases, hiddenTestCase],
      });
      setHiddenTestCase({ input: "", output: "" });
      setShowHiddenTestForm(false);
    }
  };

  const handleEditClick = (question) => {
    setEditingQuestion(question._id);
    setUpdatedQuestion({
      title: question.title,
      description: question.description,
      input: question.input,
      output: question.output,
      constraints: question.constraints,
      companyId: question.companyId,
      hiddenTestCases: question.hiddenTestCases || [],
    });
  };

  const handleInputChange = (e, field) => {
    setUpdatedQuestion((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleAddTestCase = () => {
    setUpdatedQuestion((prev) => ({
      ...prev,
      hiddenTestCases: [...prev.hiddenTestCases, { input: "", output: "" }],
    }));
  };

  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = [...updatedQuestion.hiddenTestCases];
    updatedTestCases[index][field] = value;
    setUpdatedQuestion((prev) => ({
      ...prev,
      hiddenTestCases: updatedTestCases,
    }));
  };

  const handleDeleteTestCase = (index) => {
    const updatedTestCases = [...updatedQuestion.hiddenTestCases];
    updatedTestCases.splice(index, 1);
    setUpdatedQuestion((prev) => ({
      ...prev,
      hiddenTestCases: updatedTestCases,
    }));
  };

  const handleSaveQuestion = () => {
    console.log(updatedQuestion.hiddenTestCases);
    dispatch(
      updateOAQuestion({ id: editingQuestion, questionData: updatedQuestion })
    );
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = (id) => {
    dispatch(deleteOAQuestion(id));
  };

  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl font-bold">Welcome to Dashboard</h1>
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>

      {user?.role === "admin" && (
        <div className="mt-4">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-500 text-white rounded mr-4"
          >
            {showForm ? "Cancel" : "Add OA Question"}
          </button>
          <button
            onClick={() => setShowCompanyForm(!showCompanyForm)}
            className="px-4 py-2 bg-purple-500 text-white rounded"
          >
            {showCompanyForm ? "Cancel" : "Add Company"}
          </button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleAddQuestion} className="mt-6 p-4 border rounded">
          <input
            type="text"
            placeholder="Title"
            className="block w-full p-2 border rounded mb-2"
            value={newQuestion.title}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, title: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Description"
            className="block w-full p-2 border rounded mb-2"
            value={newQuestion.description}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, description: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Input"
            className="block w-full p-2 border rounded mb-2"
            value={newQuestion.input}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, input: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Output"
            className="block w-full p-2 border rounded mb-2"
            value={newQuestion.output}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, output: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Constraints"
            className="block w-full p-2 border rounded mb-2"
            value={newQuestion.constraints}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, constraints: e.target.value })
            }
            required
          />
          <select
            className="block w-full p-2 border rounded mb-2"
            value={newQuestion.companyId}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, companyId: e.target.value })
            }
            required
          >
            <option value="">Select Company</option>
            {companies.map((company) => (
              <option key={company._id} value={company._id}>
                {company.name}
              </option>
            ))}
          </select>

          <div className="mt-4">
            <h3 className="text-lg font-semibold">Hidden Test Cases</h3>
            <button
              type="button"
              onClick={() => setShowHiddenTestForm(!showHiddenTestForm)}
              className="mt-2 px-4 py-2 bg-gray-600 text-white rounded"
            >
              {showHiddenTestForm ? "Cancel" : "Add Hidden Test Case"}
            </button>

            {showHiddenTestForm && (
              <div className="mt-2 p-3 border rounded">
                <input
                  type="text"
                  placeholder="Hidden Input"
                  className="block w-full p-2 border rounded mb-2"
                  value={hiddenTestCase.input}
                  onChange={(e) =>
                    setHiddenTestCase({
                      ...hiddenTestCase,
                      input: e.target.value,
                    })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Hidden Output"
                  className="block w-full p-2 border rounded mb-2"
                  value={hiddenTestCase.output}
                  onChange={(e) =>
                    setHiddenTestCase({
                      ...hiddenTestCase,
                      output: e.target.value,
                    })
                  }
                  required
                />
                <button
                  type="button"
                  onClick={handleAddHiddenTestCase}
                  className="px-4 py-2 bg-green-500 text-white rounded"
                >
                  Add Test Case
                </button>
              </div>
            )}

            {/* Display Added Hidden Test Cases */}
            <ul className="mt-3">
              {newQuestion.hiddenTestCases.map((test, index) => (
                <li
                  key={index}
                  className="mt-1 text-sm bg-gray-100 p-2 rounded"
                >
                  <strong>Input:</strong> {test.input}, <strong>Output:</strong>{" "}
                  {test.output}
                </li>
              ))}
            </ul>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Submit Question
          </button>
        </form>
      )}

      {showCompanyForm && (
        <form onSubmit={handleAddCompany} className="mt-6 p-4 border rounded">
          <input
            type="text"
            placeholder="Company Name"
            className="block w-full p-2 border rounded mb-2"
            value={newCompany.name}
            onChange={(e) =>
              setNewCompany({ ...newCompany, name: e.target.value })
            }
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-purple-500 text-white rounded"
          >
            Add Company
          </button>
        </form>
      )}

      <div className="mt-6">
        <h2 className="text-2xl font-semibold">Companies</h2>
        <ul className="mt-4">
          {companies.map((company) => (
            <li key={company._id} className="mt-2 border p-3">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() =>
                  setOpenCompany(
                    openCompany === company._id ? null : company._id
                  )
                }
              >
                <span className="font-medium">{company.name}</span>
                <span>{openCompany === company._id ? "▼" : "►"}</span>
              </div>
              {openCompany === company._id && (
                <ul className="mt-2 bg-gray-100 p-2">
                  {company.questions.map((question) => (
                    <li key={question._id} className="p-2 border-b">
                      {editingQuestion === question._id ? (
                        <div className="space-y-2 p-2 bg-white rounded shadow">
                          <input
                            type="text"
                            value={updatedQuestion.title}
                            onChange={(e) => handleInputChange(e, "title")}
                            className="p-1 border rounded w-full"
                            placeholder="Title"
                          />
                          <textarea
                            value={updatedQuestion.description}
                            onChange={(e) =>
                              handleInputChange(e, "description")
                            }
                            className="p-1 border rounded w-full"
                            placeholder="Description"
                          />
                          <input
                            type="text"
                            value={updatedQuestion.input}
                            onChange={(e) => handleInputChange(e, "input")}
                            className="p-1 border rounded w-full"
                            placeholder="Input"
                          />
                          <input
                            type="text"
                            value={updatedQuestion.output}
                            onChange={(e) => handleInputChange(e, "output")}
                            className="p-1 border rounded w-full"
                            placeholder="Output"
                          />
                          <input
                            type="text"
                            value={updatedQuestion.constraints}
                            onChange={(e) =>
                              handleInputChange(e, "constraints")
                            }
                            className="p-1 border rounded w-full"
                            placeholder="Constraints"
                          />
                          <input
                            type="text"
                            value={updatedQuestion.companyId}
                            onChange={(e) => handleInputChange(e, "companyId")}
                            className="p-1 border rounded w-full"
                            placeholder="Company ID"
                          />

                          {/* Hidden Test Cases Section */}
                          <div className="mt-3">
                            <h3 className="font-semibold">Hidden Test Cases</h3>
                            {updatedQuestion.hiddenTestCases.map(
                              (testCase, index) => (
                                <div
                                  key={index}
                                  className="flex gap-2 mt-2 p-2 border rounded bg-gray-50"
                                >
                                  <input
                                    type="text"
                                    value={testCase.input}
                                    onChange={(e) =>
                                      handleTestCaseChange(
                                        index,
                                        "input",
                                        e.target.value
                                      )
                                    }
                                    className="p-1 border rounded w-1/2"
                                    placeholder="Input"
                                  />
                                  <input
                                    type="text"
                                    value={testCase.output}
                                    onChange={(e) =>
                                      handleTestCaseChange(
                                        index,
                                        "output",
                                        e.target.value
                                      )
                                    }
                                    className="p-1 border rounded w-1/2"
                                    placeholder="Output"
                                  />
                                  <button
                                    onClick={() => handleDeleteTestCase(index)}
                                    className="text-red-600 hover:underline"
                                  >
                                    ❌
                                  </button>
                                </div>
                              )
                            )}
                            <button
                              onClick={handleAddTestCase}
                              className="mt-2 text-blue-600 hover:underline"
                            >
                              ➕ Add Test Case
                            </button>
                          </div>

                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={handleSaveQuestion}
                              className="text-green-600 hover:underline"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingQuestion(null)}
                              className="text-gray-600 hover:underline"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div
                            className="cursor-pointer text-blue-600 hover:underline"
                            onClick={() =>
                              navigate(`/question/${question._id}`)
                            }
                          >
                            {question.title}
                          </div>
                          <div className="flex gap-2 mt-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick(question);
                              }}
                              className="text-yellow-600 hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteQuestion(question._id);
                              }}
                              className="text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
