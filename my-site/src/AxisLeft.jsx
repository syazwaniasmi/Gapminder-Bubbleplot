import { useMemo } from "react";

const TICK_LENGTH = 10;

export const AxisLeft = ({ yScale, pixelsPerTick, width, height, label }) => {
  const range = yScale.range();

  const ticks = useMemo(() => {
    const height = range[0] - range[1];
    const numberOfTicksTarget = Math.floor(height / pixelsPerTick);
    return yScale.ticks(numberOfTicksTarget).map((value) => ({
      value,
      yOffset: yScale(value),
    }));
  }, [yScale]);

  return (
    <>
      {ticks.map(({ value, yOffset }) => (
        <g key={value} transform={`translate(0, ${yOffset})`}>
          <line
            x1={-TICK_LENGTH}
            x2={width + TICK_LENGTH}
            strokeWidth={0.5}
            shapeRendering={"crispEdges"}
          />
          <text
            style={{
              fontSize: "10px",
              textAnchor: "middle",
              transform: "translateX(-20px)",
              fill: "#D2D7D3",
            }}
          >
            {value}
          </text>
        </g>
      ))}
        {label && (
          <text
          transform = "rotate(-90)"
          x={-height / 2}     // centers along the axis
          y={-50}                  // distance below ticks
          textAnchor="middle"
          fontSize={12}
          fill="#D2D7D3"
  >
    {label}
  </text>
      )} 
    </>
  );
};      