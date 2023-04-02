import { useState } from "react";
import { useMyDisplayedChatContext } from "../../contexts/Displayed_Chat_Context";
import SingleFieldInputForm from "./SingleFieldInputForm";

type Props = {
  handleSubmit: (
    event: React.FormEvent<HTMLFormElement>,
    inputValue: string
  ) => Promise<void>;
  buttonText: string;
  fieldPlaceholder: string;
};

const InputFieldOrButton = ({
  handleSubmit,
  buttonText,
  fieldPlaceholder = "",
}: Props) => {
  const [show_button, set_show_button] = useState(true);

  const handleClick = () => {
    set_show_button(false);
  };

  const handleSubmitWrapper = async (event: React.FormEvent<HTMLFormElement>, inputValue: string) => {
    event.preventDefault();
    await handleSubmit(event, inputValue);
    set_show_button(true);
  };
  return (
    <>
      {show_button ? (
        <button className="purple-button" onClick={handleClick}>
          {buttonText}
        </button>
      ) : (
        <SingleFieldInputForm
          handleSubmit={handleSubmitWrapper}
          fieldPlaceholder={fieldPlaceholder}
          buttonText={buttonText}
        />
      )}
    </>
  );
};

export default InputFieldOrButton;
