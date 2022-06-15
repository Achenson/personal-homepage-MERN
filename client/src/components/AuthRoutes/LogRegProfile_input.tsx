import React, { useState } from "react";

interface Props {
  // inputType: "name" | "email" | "name_or_email" | "password";
  /* name?: string;
  email?: string;
  name_or_email?: string;
  password?: string; */
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  preventCopyPaste: boolean;
}

function LogRegProfile_input(
  { inputValue, setInputValue, preventCopyPaste }: Props,
  passedRef: React.LegacyRef<HTMLInputElement> | undefined
): JSX.Element {
  const [inputHover, setInputHover] = useState(false);
  /* 
  @layer components {
  .input-profile {
    @apply pl-px border border-gray-200 h-7;
  }
}
  */

  // const [inputType, setInputType] = useState("name_or_email", "password")

  /*   function calcValue() {
    let value;

    switch (inputType) {
      case "name":
        value = name;
        break;
      case "email":
        value = email;
        break;
      case "name_or_email":
        value = name_or_email;
        break;
      case "password":
        value = password;
        break;
    }

    return value;
  } */

  return (
    <input
      ref={passedRef}
      type="text"
      className="w-full pl-px border border-gray-200 h-7 hover:border-gray-300 transition-colors duration-150
       focus-1"
      style={{
        borderTopColor: `${inputHover ? "#9CA3AF" : "#D1D5DB"}`,
        transitionProperty:
          "background-color, border-color, color, fill, stroke",
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        transitionDuration: "150ms",
      }}
      onMouseEnter={() => {
        setInputHover(true);
      }}
      onMouseLeave={() => {
        setInputHover(false);
      }}
      onChange={(e) => {
        setInputValue(e.target.value);
      }}
      onCopy={(e) => {
        if (preventCopyPaste) {
          e.preventDefault();
          return;
        }
      }}
      onPaste={(e) => {
        if (preventCopyPaste) {
          e.preventDefault();
          return;
        }
      }}
      value={inputValue}
    />
  );
}

export default React.forwardRef(LogRegProfile_input);
