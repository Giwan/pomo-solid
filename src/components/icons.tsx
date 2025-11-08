import { Component } from "solid-js";

const baseProps = {
  viewBox: "0 0 32 32",
  fill: "none",
  "aria-hidden": "true",
  focusable: "false",
  role: "presentation",
} as const;

const Svg: Component<Record<string, any>> = (props) => (
  <svg {...baseProps} {...props}>
    {props.children}
  </svg>
);

const strokeBase = { stroke: "currentColor", "stroke-width": 1.8 } as const;
const strokeJoin = { ...strokeBase, "stroke-linejoin": "round" } as const;
const strokeCap = { ...strokeBase, "stroke-linecap": "round" } as const;
const strokeCapJoin = {
  ...strokeBase,
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
} as const;

const Path: Component<Record<string, any>> = (props) => (
  <path {...strokeCapJoin} {...props} />
);

const Rect: Component<Record<string, any>> = (props) => (
  <rect {...strokeJoin} {...props} />
);

const Line: Component<Record<string, any>> = (props) => (
  <line {...strokeCap} {...props} />
);

const Circle: Component<Record<string, any>> = (props) => (
  <circle {...strokeBase} {...props} />
);

const IconWork: Component = () => (
  <Svg>
    <Rect x="5.5" y="12.5" width="21" height="13" rx="2" />
    <Path d="M11 12.5V10a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v2.5" />
    <Path d="M5.5 17.5h21" />
  </Svg>
);

const IconBreak: Component = () => (
  <Svg>
    <Path d="M7 12h15.5v5a7.5 7.5 0 0 1-7.5 7.5h0A7.5 7.5 0 0 1 7.5 17V12" />
    <Path d="M22.5 14h3a2.5 2.5 0 0 1 0 5H24" />
    <Path d="M11 24.5h9" />
  </Svg>
);

const IconLongBreak: Component = () => (
  <Svg>
    <Path d="M25.5 22.5a9.5 9.5 0 1 1-5.5-14" />
    <Path d="M22.5 9.5a6 6 0 1 0 5.5 9" />
  </Svg>
);

const IconPlay: Component = () => (
  <Svg>
    <Path d="M12 10.5v11l9-5.5-9-5.5Z" />
  </Svg>
);

const IconPause: Component = () => (
  <Svg>
    <Path d="M12.5 10.5v11" />
    <Path d="M19.5 10.5v11" />
  </Svg>
);

const IconReset: Component = () => (
  <Svg>
    <Path d="M9.5 12.5 7 9v7h7l-2.8-2.8a7.5 7.5 0 1 1 2.3 11" />
  </Svg>
);

const IconSettings: Component = () => (
  <Svg>
    <Path d="M11 8.5v15" />
    <Path d="M21 8.5v15" />
    <Rect x="8" y="12.5" width="6" height="4" rx="1.2" />
    <Rect x="18" y="15.5" width="6" height="4" rx="1.2" />
  </Svg>
);

const IconChipDot: Component = () => (
  <Svg>
    <Circle cx="16" cy="16" r="5" />
    <circle cx="16" cy="16" r="1" fill="currentColor" />
  </Svg>
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
