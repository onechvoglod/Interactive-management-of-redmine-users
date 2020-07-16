import React, { useContext, useEffect } from "react";
import { RedmineContext } from "../context/redmine/redmineContext";
import classes from "./UsersList.module.scss";

const UsersList = () => {
  const { users, loading, getUsers } = useContext(RedmineContext);
  console.log(users);

  useEffect(() => {
    getUsers();
    //eslint-disable-next-line
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <div className={`list-group ${classes["users-list"]}`}>
        {users.map((user, index) => {
          return (
            <button
              type="button"
              className="list-group-item list-group-item-action"
              key={index}
            >
              {`${user.firstname} ${user.lastname}`}
            </button>
          );
        })}
      </div>
    </React.Fragment>
  );

  // return (
  //   <div className="list-group">
  //     <button type="button" className="list-group-item list-group-item-action">
  //       Dapibus ac facilisis in
  //     </button>
  //     <button type="button" className="list-group-item list-group-item-action">
  //       Morbi leo risus
  //     </button>
  //     <button type="button" className="list-group-item list-group-item-action">
  //       Porta ac consectetur ac
  //     </button>
  //     <button type="button" className="list-group-item list-group-item-action">
  //       Dapibus ac facilisis in
  //     </button>
  //     <button type="button" className="list-group-item list-group-item-action">
  //       Morbi leo risus
  //     </button>
  //     <button type="button" className="list-group-item list-group-item-action">
  //       Porta ac consectetur ac
  //     </button>
  //   </div>
  // );
};

export default UsersList;
