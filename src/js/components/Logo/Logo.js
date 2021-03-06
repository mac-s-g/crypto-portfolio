import React from "react"

export default ({ backgroundColor, primaryColor, size = "100px" }) => (
  <svg
    viewBox="0 0 134 134"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: size, height: size }}
  >
    <g>
      <ellipse
        stroke={primaryColor}
        ry="62.5"
        rx="62.5"
        cy="67"
        cx="67"
        strokeWidth="7.5"
        fill={backgroundColor}
      />
      <path
        transform="rotate(-102.86898040771484 61.81500244140626,67.85614013671875) "
        d="m55.70472,40.82308l23.5553,24.47117l-23.2641,8.40701l21.5028,26.27191l8.68155,-4.43641l-6.15752,25.32323l-24.47057,-11.04837l10.33187,-4.61817l-28.05556,-37.73495l25.64595,-6.8392l-24.76532,-25.49934l14.12661,-3.82859l-15.38599,-16.20617l5.65216,-0.23291l23.87601,22.23312l-11.27319,3.73769l0,-0.00001z"
        strokeWidth="0"
        fill={primaryColor}
      />
    </g>
  </svg>
)
