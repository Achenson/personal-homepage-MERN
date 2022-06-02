import React from "react";

interface Props {
  notification: string;
  colorClass: string;
}

function AuthNotification({ notification, colorClass }: Props): JSX.Element {
  return (
    <div className={` text-${colorClass}`}>
      <p>{notification}</p>
    </div>
  );
}

export default AuthNotification;
