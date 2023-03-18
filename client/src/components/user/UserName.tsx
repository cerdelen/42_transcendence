import React, { useContext, useEffect, useState } from "react";
import JSCookies from "js-cookie";
import { UserContext } from "../../contexts/UserContext";
import { AiOutlineEdit } from "react-icons/ai";

type Props = {};

const UserName = (props: Props) => {
  const { name } = useContext(UserContext);
  const [newName, setNewName] = useState<string>("");
  const [showInput, setShowInput] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>(name);

  useEffect(() => {
    setUserName(name);
  }, [name]);

  const changeName = async () => {
    console.log("changeName called");
    try {
      const response = await fetch("http://localhost:3003/user/change_name", {
        method: "POST",
        body: JSON.stringify({ new_name: newName }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSCookies.get("accessToken")}`,
        },
      });
      if (response.ok) {
        setShowInput(!showInput);
        setNewName("");
        setUserName(newName);
        alert("Name was changed successfully");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  const handleNewNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    changeName();
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div>{`USERNAME: ${userName}`}</div>
      <div
        onClick={() => {
          setShowInput(!showInput);
        }}
        style={{ marginLeft: "10px", cursor: "pointer" }}
      >
        <AiOutlineEdit />
      </div>
      {showInput && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newName}
            onChange={handleNewNameChange}
            minLength={3}
            pattern="^\S*$"
            title="Name should be at least 3 characters long and should not contain any spaces"
          />
          <button>Change Name</button>
        </form>
      )}
    </div>
  );
};

export default UserName;
