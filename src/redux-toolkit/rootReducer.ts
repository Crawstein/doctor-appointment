import { combineReducers } from "@reduxjs/toolkit";
import stateSlice from "./stateSlice";

const rootReducer = combineReducers({
  state: stateSlice
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;