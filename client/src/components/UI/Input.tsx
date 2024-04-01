import { useState } from "react";

type Props = {
  buttonText: string;
  placeholder: string;
  onButtonPress: (userInput: string) => void;
};

export default function Chat({
  buttonText,
  placeholder,
  onButtonPress,
}: Props) {
  const [userInput, setUserInput] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);

  const onButtonPressHandler = () => {
    if (userInput.trim() === "") {
      return;
    }
    onButtonPress(userInput);
    setUserInput("");
  };

  return (
    <div
      className={`border-2 rounded-md w-full flex flex-row ${
        isInputFocused ? "border-teal-400" : "border-indigo-400"
      }`}
    >
      <input
        onFocus={() => setIsInputFocused(true)}
        onBlur={() => setIsInputFocused(false)}
        className="w-full bg-indigo-800 rounded-l-md p-4 focus:outline-none"
        type="text"
        value={userInput}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setUserInput(e.target.value)
        }
        placeholder={placeholder}
      />
      <button
        className="bg-emerald-700 px-4 rounded-r-md"
        onClick={onButtonPressHandler}
      >
        {buttonText}
      </button>
    </div>
  );
}
