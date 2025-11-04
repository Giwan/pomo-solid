import { Component } from "solid-js";

const baseProps = {
  viewBox: "0 0 32 32",
  fill: "none",
  "aria-hidden": "true",
  focusable: "false",
  role: "presentation",
} as const;

const IconWork: Component = () => (
  <svg {...baseProps}>
    <rect
      x="5.5"
      y="12.5"
      width="21"
      height="13"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M11 12.5V10a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v2.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.5 17.5h21"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const IconBreak: Component = () => (
  <svg {...baseProps}>
    <path
      d="M7 12h15.5v5a7.5 7.5 0 0 1-7.5 7.5h0A7.5 7.5 0 0 1 7.5 17V12"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22.5 14h3a2.5 2.5 0 0 1 0 5H24"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11 24.5h9"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const IconLongBreak: Component = () => (
  <svg {...baseProps}>
    <path
      d="M25.5 22.5a9.5 9.5 0 1 1-5.5-14"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22.5 9.5a6 6 0 1 0 5.5 9"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconPlay: Component = () => (
  <svg {...baseProps}>
    <path
      d="M12 10.5v11l9-5.5-9-5.5Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

const IconPause: Component = () => (
  <svg {...baseProps}>
    <path
      d="M12.5 10.5v11"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M19.5 10.5v11"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const IconReset: Component = () => (
  <svg {...baseProps}>
    <path
      d="M9.5 12.5 7 9v7h7l-2.8-2.8a7.5 7.5 0 1 1 2.3 11"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconSettings: Component = () => (
  <svg {...baseProps}>
    <path
      d="M11 8.5v15"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M21 8.5v15"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <rect
      x="8"
      y="12.5"
      width="6"
      height="4"
      rx="1.2"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <rect
      x="18"
      y="15.5"
      width="6"
      height="4"
      rx="1.2"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

const IconChipDot: Component = () => (
  <svg {...baseProps}>
    <circle
      cx="16"
      cy="16"
      r="5"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <circle cx="16" cy="16" r="1" fill="currentColor" />
  </svg>
);

export {
  IconBreak,
  IconChipDot,
  IconLongBreak,
  IconPause,
  IconPlay,
  IconReset,
  IconSettings,
  IconWork,
};
