// {
//     "message": "User created Successfully",
//     "status": "success",
//     "data": {
//
//     },
//     "metadata": {
//         "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImF5dXNoLmphbmRAaGVscGZ1bGluc2lnaHRzb2x1dGlvbi5jb20iLCJfaWQiOiI2ODZjYzliYWE4OGIxNTA1ODNlMDkwZWQiLCJpYXQiOjE3NTE5NTk5OTQsImV4cCI6MTc1MTk2MTE5NH0.rGvUUtzj33vHjr2YQZuDQY1ptgXnjExblNNpASrc3j8"
//     },
//     "links": {}
// }

export type SuccessRegister = {
  message: string;
  status: string;
  data: {};
  metadata: {
    token: string;
  };
  links: {};
};

export type SuccessLogin = {
  message: string;
  status: string;
  data: {};
  metadata: {
    token: string;
  };
  links: {};
};

export type SuccessLogout = {
  message: string;
  status: string;
  metadata: {};
  links: {};
};

export type ErrorLogout = {
  status: string;
  error: {
    code: number;
    message: string;
    details: {};
  };
  metadata: {
    timestamps: string;
  };
};
