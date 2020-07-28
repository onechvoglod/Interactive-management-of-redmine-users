import React, { useReducer } from "react";
import { RedmineReducer } from "./redmineReducer";
import { RedmineContext } from "./redmineContext";
import { GET_USERS } from "../type";
import axios from "axios";

const ADMIN_KEY = process.env.REACT_APP_ADMIN_KEY;
const BASE_URL = process.env.REACT_APP_BASE_URL;

const RedmineState = ({ children }) => {
  const initialState = {
    users: [],
    loading: true,
  };

  const [state, dispatch] = useReducer(RedmineReducer, initialState);

  const getUsers = async () => {
    const response = await axios.get(
      `${BASE_URL}/users.json?key=${ADMIN_KEY}&limit=50`
    );
    dispatch({ type: GET_USERS, payload: response.data.users });

    // fetch(`${BASE_URL}/users.json?key=${ADMIN_KEY}&limit=50`)
    //   .then((response) => response.json())
    //   .then((data) => dispatch({ type: GET_USERS, payload: data.users }));
  };

  const { users, loading } = state;

  return (
    <RedmineContext.Provider value={{ users, loading, getUsers }}>
      {children}
    </RedmineContext.Provider>
  );
};

export default RedmineState;
