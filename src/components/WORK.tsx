export const WORK = "work" as const;
export const PAUSE = "pause" as const;
export const RESET = "reset" as const;
const PAUSE_LABEL = "Pause" as const;
const RESET_LABEL = "Reset" as const;

export type TButton = typeof WORK | typeof PAUSE | typeof RESET;

export function generateButtons(handleButtonClick: Function) {
  return [
    {
      id: WORK,
      label: WORK,
      action: () => handleButtonClick(WORK),
      cssClass: "start-button",
    },
    {
      id: PAUSE,
      label: PAUSE_LABEL,
      action: () => handleButtonClick(PAUSE),
    },
    {
      id: RESET,
      label: RESET_LABEL,
      action: () => handleButtonClick(RESET),
    },
  ];
}
