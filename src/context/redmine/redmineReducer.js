import { GET_USERS } from "../type";

export const RedmineReducer = (state, action) => {
  switch (action.type) {
    case GET_USERS:
      return { users: action.payload, loading: false };
    default:
      return state;
  }
};
