import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import companyReducer from "./slices/companySlice";
import oaQuestionsReducer from "./slices/oaQuestionsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    company: companyReducer,
    oaQuestions: oaQuestionsReducer,
  },
});

export default store;
