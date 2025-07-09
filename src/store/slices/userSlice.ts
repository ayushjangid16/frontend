import { createSlice } from "@reduxjs/toolkit";

// Role Interface
interface Role {
  _id: string;
  name: string;
  username: string;
  isDeleted: boolean;
}

// Permission Interface
interface Permission {
  _id: string;
  name: string;
  username: string;
  isDeleted: boolean;
}

// User Interface
interface User {
  _id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  email: string;
  country_code: string | null;
  phone_number: string;
  password_reset_token: string | null;
  role_id: Role;
  status: "active" | "inactive";
  isVerified: boolean;
  createdBy: string | null;
  updatedBy: string | null;
  deletedBy: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Full Response Interface
interface UserWithPermissions {
  userInfo: User;
  permissions: Permission[];
}

interface MainUser {
  userRole: string;
  isLoggedIn: boolean;
  userInfo: UserWithPermissions;
}

interface StateData {
  userData: MainUser;
}

const intialState: StateData = { userData: {} };

const userSlice = createSlice({
  name: "user",
  initialState: intialState,
  reducers: {
    setUser: (state, action) => {
      let userData: UserWithPermissions = action.payload;

      //   console.log(state.userData);
      state.userData.userRole = userData.userInfo.role_id.username;

      state.userData.isLoggedIn = true;
      state.userData.userInfo = userData;
    },
    removeUser: (state, action) => {},
  },
});

export const { setUser, removeUser, getUser } = userSlice.actions;

export default userSlice.reducer;
