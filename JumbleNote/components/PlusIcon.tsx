import React from "react";
import { SvgXml } from "react-native-svg";

// Define SVG as a string
const plusSvg = `
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <g stroke="#f40125" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 16,7.33 V 24.67" />
    <path d="M 7.33,16 H 24.67" />
  </g>
</svg>`;

const PlusIcon = ({ width = 32, height = 32 }) => (
  <SvgXml xml={plusSvg} width={width} height={height} />
);

export default PlusIcon;
