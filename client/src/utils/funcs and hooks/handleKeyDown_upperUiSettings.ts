import { UpperUiContext_i } from "../interfaces";

export function handleKeyDown_upperUiSetting(
  eventCode: string,
  upperUiContext: UpperUiContext_i,
  focusOnUpperUi_number: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | null
) {
  switch (eventCode) {
    case "Escape":
      if (focusOnUpperUi_number && upperUiContext) {
        switch (focusOnUpperUi_number) {
          case 5:
            upperUiContext.upperVisDispatch({
              type: "BACKGROUND_SETTINGS_TOGGLE",
            });
            break;
          case 6:
            upperUiContext.upperVisDispatch({
              type: "COLORS_SETTINGS_TOGGLE",
            });
            break;
          case 7:
            upperUiContext.upperVisDispatch({
              type: "SETTINGS_TOGGLE",
            });
            break;
          case 8:
            upperUiContext.upperVisDispatch({
              type: "PROFILE_TOGGLE",
            });
            break;
          default:
            break;
        }
        upperUiContext.upperVisDispatch({
          type: "FOCUS_ON_UPPER_RIGHT_UI",
          payload: focusOnUpperUi_number,
        });
      }
      return;

    default:
      return;
  }
}
