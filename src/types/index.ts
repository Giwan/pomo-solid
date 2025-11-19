import { IconBreak, IconLongBreak, IconWork } from "../components/icons";

export const MODE_DEFINITIONS = [
    { id: "work", label: "Work", Icon: IconWork },
    { id: "break", label: "Break", Icon: IconBreak },
    { id: "longBreak", label: "Long Break", Icon: IconLongBreak },
] as const;

export type Mode = (typeof MODE_DEFINITIONS)[number]["id"];

export type ModeDurations = Record<Mode, number>;
export type ModeMinutes = Record<Mode, number>;

export type ModalDurations = {
    work: number;
    break: number;
    longBreak: number;
};

export type TField =
    | {
        readonly key: "work";
        readonly label: "Work Session";
    }
    | {
        readonly key: "break";
        readonly label: "Break";
    }
    | {
        readonly key: "longBreak";
        readonly label: "Long Break";
    };

