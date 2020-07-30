import React, { useContext, useEffect } from "react";
import { RedmineContext } from "../context/redmine/redmineContext";
import classes from "./UsersList.module.scss";

const UsersList = () => {
  const { users, loading, getUsers } = useContext(RedmineContext);

  const cls = ["list-group-item", "list-group-item-action"];

  useEffect(() => {
    getUsers();
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <div className={`list-group ${classes["users-list"]}`}>
        {users.map((user, index) => {
          let isParent = users.find((item) => item.parent === user.key);
          if (!user.parent && !isParent) {
            cls.push("bg-danger", "text-white");
          } else {
            cls.splice(2, 2);
          }

          return (
            <button type="button" className={cls.join(" ")} key={index}>
              {user.name ? user.name : `${user.firstname} ${user.lastname}`}
            </button>
          );
        })}
      </div>
    </React.Fragment>
  );
};

export default UsersList;
