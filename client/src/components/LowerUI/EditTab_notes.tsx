import React from "react";

interface Props {
  textAreaValue: string | null;
  setTextAreaValue: React.Dispatch<React.SetStateAction<string | null>>;
  setWasAnythingClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

function EditTab_notes({
  textAreaValue,
  setTextAreaValue,
  setWasAnythingClicked,
}: Props): JSX.Element {
  return (
    <div className="mt-2">
      <textarea
        value={textAreaValue as string}
        className="h-full w-full overflow-visible pl-px pr-px border font-mono resize-none focus-1"
        // rows={(currentTab[0].noteInput as string).length / 30}
        rows={4}
        onChange={(e) => {
          setTextAreaValue(e.target.value);
          setWasAnythingClicked(true);
        }}
      ></textarea>
    </div>
  );
}

export default EditTab_notes;
