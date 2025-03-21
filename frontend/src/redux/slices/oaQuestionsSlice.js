import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://oa-practice-platform-uj4o.vercel.app/v1/oa-questions";

// Async Thunks
export const fetchOAQuestions = createAsyncThunk(
  "oaQuestions/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchOAQuestion = createAsyncThunk(
  "oaQuestions/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createOAQuestion = createAsyncThunk(
  "oaQuestions/create",
  async (questionData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, questionData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateOAQuestion = createAsyncThunk(
  "oaQuestions/update",
  async ({ id, questionData }, { rejectWithValue }) => {
    try {
      console.log(questionData, "questionData");

      const response = await axios.put(`${API_URL}/${id}`, questionData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteOAQuestion = createAsyncThunk(
  "oaQuestions/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const oaQuestionsSlice = createSlice({
  name: "oaQuestions",
  initialState: {
    questions: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOAQuestions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOAQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload.data;
      })
      .addCase(fetchOAQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(createOAQuestion.fulfilled, (state, action) => {
        state.questions.push(action.payload.data);
      })
      .addCase(updateOAQuestion.fulfilled, (state, action) => {
        const index = state.questions.findIndex(
          (q) => q._id === action.payload.data._id
        );
        if (index !== -1) {
          state.questions[index] = action.payload.data;
        }
      })
      .addCase(deleteOAQuestion.fulfilled, (state, action) => {
        state.questions = state.questions.filter(
          (q) => q._id !== action.payload
        );
      });
  },
});

export const { clearError } = oaQuestionsSlice.actions;
export default oaQuestionsSlice.reducer;
