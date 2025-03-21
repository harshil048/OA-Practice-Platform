import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API base URL
const API_URL = "https://oa-practice-platform-uj4o.vercel.app/v1/companies";

// Async Thunks

// Fetch all companies
export const fetchCompanies = createAsyncThunk(
  "company/fetchCompanies",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch a single company
export const fetchCompany = createAsyncThunk(
  "company/fetchCompany",
  async (companyId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${companyId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch questions related to a company
export const fetchCompanyQuestions = createAsyncThunk(
  "company/fetchCompanyQuestions",
  async (companyId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${companyId}/questions`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create a new company
export const createCompany = createAsyncThunk(
  "company/createCompany",
  async (companyData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, companyData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update an existing company
export const updateCompany = createAsyncThunk(
  "company/updateCompany",
  async ({ companyId, companyData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${companyId}`, companyData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete a company
export const deleteCompany = createAsyncThunk(
  "company/deleteCompany",
  async (companyId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${companyId}`, { withCredentials: true });
      return companyId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Company Slice
const companySlice = createSlice({
  name: "company",
  initialState: {
    companies: [],
    company: null,
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
      // Fetch Companies
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload.data;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Fetch a single Company
      .addCase(fetchCompany.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload.data;
      })
      .addCase(fetchCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Fetch Company Questions
      .addCase(fetchCompanyQuestions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCompanyQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload.data;
      })
      .addCase(fetchCompanyQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Create Company
      .addCase(createCompany.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.companies.push(action.payload.data);
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Update Company
      .addCase(updateCompany.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = state.companies.map((company) =>
          company._id === action.payload.data._id
            ? action.payload.data
            : company
        );
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Delete Company
      .addCase(deleteCompany.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = state.companies.filter(
          (company) => company._id !== action.payload
        );
      })
      .addCase(deleteCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearError } = companySlice.actions;
export default companySlice.reducer;
