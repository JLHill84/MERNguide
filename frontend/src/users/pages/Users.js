import React from "react";
import UsersList from "../components/UsersList";

const Users = () => {
  const USERS = [
    {
      id: "u1",
      name: "Joshua L. Hill",
      image:
        "https://lh3.googleusercontent.com/LNTpg4k0miWmNdr8zLrYQtBOKkskOKHfDqUjLmkA63WYGBpIJl03hPtG7aw-bPmeiKkd6A=s85",
      places: 2
    }
  ];

  return <UsersList items={USERS} />;
};

export default Users;
