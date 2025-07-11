import { createSlice } from "@reduxjs/toolkit";

interface SingleRequest {
  _id: string;
  name: string;
  status: "pending" | "accepted" | "rejected";
}

interface StateType {
  requests: SingleRequest[];
}

const intitalState: StateType = {
  requests: [],
};

const requestSlice = createSlice({
  name: "requests",
  initialState: intitalState,
  reducers: {
    setRequests: (state, action) => {
      state.requests = [];
      state.requests = action.payload;
      state.requests = [...state.requests];
    },
    approveRequests: (state, action) => {
      const _id = action.payload;

      state.requests = state.requests.filter((req) => {
        if (req._id === _id) {
          req.status = "accepted";
        } else {
          return req;
        }
      });
      state.requests = [...state.requests];
    },

    rejectRequest: (state, action) => {
      const _id = action.payload;

      state.requests = state.requests.filter((req) => {
        if (req._id === _id) {
          req.status = "rejected";
        } else {
          return req;
        }
      });
      state.requests = [...state.requests];
    },
  },
});

export const { approveRequests, setRequests, rejectRequest } =
  requestSlice.actions;

export default requestSlice.reducer;
