import { useState } from "react";
import JSCookies from "js-cookie";

type Props = {
  handleSubmit: (inputValue: string, password?: string) => Promise<void>;
  buttonText: string;
  fieldPlaceholder: string;
  passwordField?: boolean;
};

const SingleFieldInputForm = ({
  handleSubmit,
  buttonText,
  fieldPlaceholder = '',
  passwordField = false,

}: Props) => {
  const [inputValue, setInputValue] = useState("");
  const [password, setPassword] = useState("");

  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  };

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
  };
  console.log(passwordField);
  
  return (
    <form
      className="popup"
      onSubmit={() => {
        handleSubmit(inputValue);
      }}
    >
      <input type="text" value={inputValue} placeholder={fieldPlaceholder} onChange={handleInputChange} />
      <button className="purple-button">{buttonText}</button>
      {passwordField && (
        <input type="text" value={password} placeholder='Optional password' onChange={handlePasswordChange} />
      )}
    </form>
  );
};

export default SingleFieldInputForm;
