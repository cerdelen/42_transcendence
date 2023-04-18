import { useState } from "react";
import JSCookies from "js-cookie";
import React from "react";
type Props = {
  handleSubmit: (
    event: React.FormEvent<HTMLFormElement>,
    inputValue: string,
    password?: string
  ) => Promise<void>;
  buttonText: string;
  fieldPlaceholder: string;
  passwordField?: boolean;
};

const TwoFieldInputForm = ({
  handleSubmit,
  buttonText,
  fieldPlaceholder = "",
}: Props) => {
  const [inputValue, setInputValue] = useState("");
  const [password, setPassword] = useState("");

  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  };

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
  };
  // console.log(password);

  return (
    <form
      className="popup"
      onSubmit={(event) => {
        handleSubmit(event , inputValue, password);
      }}
    >
      <input
        type="text"
        value={inputValue}
        placeholder={fieldPlaceholder}
        onChange={handleInputChange}
      />
      <button className="purple-button">{buttonText}</button>
      <input
        type="text"
        value={password}
        placeholder="Optional password"
        onChange={handlePasswordChange}
      />
    </form>
  );
};

export default TwoFieldInputForm;
