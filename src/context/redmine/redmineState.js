import React, { useReducer } from "react";
import { RedmineReducer } from "./redmineReducer";
import { RedmineContext } from "./redmineContext";
import { GET_USERS } from "../type";

const RedmineState = ({ children }) => {
  const initialState = {
    users: [],
    loading: true,
  };

  const adminKey = `c87667a752ee525799da4662f9d00a1297514fbb`;
  const [state, dispatch] = useReducer(RedmineReducer, initialState);

  const getUsers = () => {
    fetch(`https://redmine.lineup.com.ua/users.json?key=${adminKey}&limit=100`)
      .then((response) => response.json())
      .then((data) => dispatch({ type: GET_USERS, payload: data.users }));
  };

  const { users, loading } = state;

  return (
    <RedmineContext.Provider value={{ users, loading, getUsers }}>
      {children}
    </RedmineContext.Provider>
  );
};

export default RedmineState;
