import { useMemo } from "react";

const TICK_LENGTH = 10;

export const AxisBottom = ({ xScale, pixelsPerTick, width,height, label }) => {

  const ticks = useMemo(() => {
    const range = xScale.range();
    const width = range[1] - range[0];
    const numberOfTicksTarget = Math.floor(width / pixelsPerTick);
    return xScale.ticks(numberOfTicksTarget).map((value) => ({
      value,
      xOffset: xScale(value),
    }));
  }, [xScale,pixelsPerTick ]);

  return (
    <>
      {ticks.map(({ value, xOffset }) => (
        <g key={value} transform={`translate(${xOffset}, 0)`}>
          <line
            y1={TICK_LENGTH}
            y2={-height - TICK_LENGTH}
            strokeWidth={0.5}
            shapeRendering={"crispEdges"}
          />        
          <text
            style={{
              fontSize: "10px",
              textAnchor: "middle",
              transform: "translateY(20px)",
              fill: "#d7d3d2",
            }}
          >
            {value}
          </text>
        </g>
      ))}
        {label && (
          <text
          x={height - 80}     // centers along the axis
          y={40}                  // distance below ticks
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