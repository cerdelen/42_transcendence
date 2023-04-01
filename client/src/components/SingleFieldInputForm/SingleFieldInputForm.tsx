import { useState } from "react";
import JSCookies from "js-cookie";

type Props = {
  handleSubmit: (inputValue: string) => Promise<void>;
  buttonText: string;
};

const SingleFieldInputForm = ({ handleSubmit, buttonText }: Props) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  };

  return (
    <form
      className="popup"
      onSubmit={() => {
        handleSubmit(inputValue);
      }}
    >
      <input type="text" value={inputValue} onChange={handleInputChange} />
      <button className="purple-button">{buttonText}</button>
    </form>
  );
};

export default SingleFieldInputForm;
