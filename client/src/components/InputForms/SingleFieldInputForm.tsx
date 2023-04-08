import { useState } from "react";

type Props = {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>, inputValue: string) => Promise<void>;
  buttonText: string;
  fieldPlaceholder: string;
  buttonStyle?: string
};

const SingleFieldInputForm = ({
  handleSubmit,
  buttonText,
  fieldPlaceholder = '',
  buttonStyle = "purple-button"

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
      <button className={buttonStyle}>{buttonText}</button>
    </form>
  );
};

export default SingleFieldInputForm;
