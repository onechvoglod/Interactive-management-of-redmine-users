import { GET_USERS, CHANGE_USERS } from "../type";

// export const RedmineReducer = (state, action) => {
//   switch (action.type) {
//     case GET_USERS:
//       return { users: action.payload, loading: false };
//     default:
//       return state;
//   }
// };

const handlers = {
  [GET_USERS]: (state, { payload }) => ({
    ...state,
    users: payload,
    loading: false,
  }),
  [CHANGE_USERS]: (state, { payload }) => ({
    ...state,
    users: payload,
    loading: false,
  }),
  DEFAULT: (state) => state,
};

export const RedmineReducer = (state, action) => {
  const hendle = handlers[action.type] || handlers.DEFAULT;
  return hendle(state, action);
};
