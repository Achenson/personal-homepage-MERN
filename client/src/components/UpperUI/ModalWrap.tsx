import React, { ReactChild } from "react";

import shallow from "zustand/shallow";
import { RemoveScroll } from "react-remove-scroll";

import { useGlobalSettings } from "../../state/hooks/defaultSettingsHooks";

interface Props {
  children: ReactChild;
}

// different handling of scrollbar in case of plain color image mode and background image mode
function ModalWrap({ children }: Props): JSX.Element {
  const globalSettings = useGlobalSettings((state) => state, shallow);

  return globalSettings.picBackground ? (
    <RemoveScroll removeScrollBar={false}>
      <>{children}</>
    </RemoveScroll>
  ) : (
    <>{children}</>
  );
}

export default ModalWrap;
