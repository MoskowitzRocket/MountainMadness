import React from "react";
import { SvgXml } from "react-native-svg";

// Define SVG as a string
const plusSvg = `
<svg
   width="32"
   height="32"
   viewBox="0 0 32 32"
   version="1.1"
   id="svg1"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
  <sodipodi:namedview
     id="namedview1"
     pagecolor="#ffffff"
     bordercolor="#000000"
     borderopacity="0.25"
     inkscape:showpageshadow="2"
     inkscape:pageopacity="0.0"
     inkscape:pagecheckerboard="0"
     inkscape:deskcolor="#d1d1d1"
     inkscape:document-units="px" />
  <defs
     id="defs1" />
  <g
     inkscape:label="Layer 1"
     inkscape:groupmode="layer"
     id="layer1">
    <path
       style="fill:#764200;stroke:#f40125;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1"
       d="M 16,7.3307594 V 24.669241"
       id="path1" />
    <path
       style="fill:#764200;stroke:#f40125;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1"
       d="M 7.3307597,16 H 24.66924"
       id="path1-8" />
  </g>
</svg>`;

const PlusIcon = ({ width = 32, height = 32 }) => (
  <SvgXml xml={plusSvg} width={width} height={height} />
);

export default PlusIcon;
