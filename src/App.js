import React from "react";
import Header from "./components/Header";
import UsersList from "./components/UsersList";
import RedmineState from "./context/redmine/redmineState";
import Diagrama from "./components/Diagrama";

function App() {
  return (
    <RedmineState>
      <Header />

      <div className="container-fluid pt-4">
        <div className="row">
          <div className="col-sm">
            <Diagrama />
          </div>
          <div className="col-sm-3">
            <UsersList />
          </div>
        </div>
      </div>
    </RedmineState>
  );
}

export default App;
