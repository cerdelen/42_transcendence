import React, { useContext } from "react";
import JSCookies from "js-cookie";
import { UserContext } from "../contexts/UserContext";

type Props = {};

const UserPage = (props: Props) => {
  const { userId } = useContext(UserContext);
  const getData = async () => {
    const response = await fetch("http://localhost:3003/user/user_data", {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSCookies.get("accessToken")}`,
      },
      body: JSON.stringify({ user_id: userId }),
    });
    const data = await response.json();
    console.log(data);
    console.log(userId);
  };
  return (
    <div onClick={getData}>
      UserPage
      <div>whatevs</div>
      <div>whatevs</div>
      <div>whatevs</div>
      <div>whatevs</div>
      <div>whatevs</div>
      <div>whatevs</div>
      <div>whatevs</div>
      <div>whatevs</div>
      <div>whatevs</div>
    </div>
  );
};

export default UserPage;
