import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";

export const store = configureStore({
    reducer: {
      counter: counterReducer,
    },
  });
  
  // Типизация корневого состояния и dispatch
  export type RootState = ReturnType<typeof store.getState>;
  export type AppDispatch = typeof store.dispatch;