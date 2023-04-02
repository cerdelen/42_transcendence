import { useState } from "react";
import JSCookies from "js-cookie";

type Props = {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>, inputValue: string) => Promise<void>;
  buttonText: string;
  fieldPlaceholder: string;
};

const SingleFieldInputForm = ({
  handleSubmit,
  buttonText,
  fieldPlaceholder = '',

}: Props) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  };

  return (
    <form
      className="popup"
      onSubmit={(event) => {
        handleSubmit(event, inputValue);
      }}
    >
      <input type="text" value={inputValue} placeholder={fieldPlaceholder} onChange={handleInputChange} />
      <button className="purple-button">{buttonText}</button>
    </form>
  );
};

export default SingleFieldInputForm;
