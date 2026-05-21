import { useMemo } from "react"
import * as d3 from "d3";
import { AxisLeft } from "./AxisLeft"
import { AxisBottom } from "./AxisBottom"

// MARGINS
const MARGIN = { top: 40, right: 30, bottom: 60, left: 70 }

// BUBBLE SIZES
//since the area of a circle is proportional to the value, we need to use a sqrt scale and define theto get the radius right

const BUBBLE_MIN_SIZE = 4;
const BUBBLE_MAX_SIZE = 40;

// Always start with component function that will wrap the whole visualization. It will receive the data and dimensions as props, and will be responsible for setting up the scales, axes, and shapes.

export default function BubblePlot({ width, height, data }) {

//PADDING
const boundsWidth  = width  - MARGIN.right - MARGIN.left
const boundsHeight = height - MARGIN.top   - MARGIN.bottom

// ── SCALES ──
  // ── D3 MATH ZONE ──
  const yScale = useMemo(() => {
    return d3.scaleLinear()
      .domain([0, d3.max(data, (d) => d.lifeExp) || 100])
      .range([boundsHeight, 0]);
  }, [data, boundsHeight]);

  const xScale = useMemo(() =>
    d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.gdpPercap) || 10])
    .range([0, boundsWidth]),
    [data, boundsWidth]
  );

const groups = useMemo(() =>
  data
    .map((d) => d.continent)
    .filter((x, i, a) => a.indexOf(x) === i),
  [data]
);

  const colorScale = d3.scaleOrdinal()
    .domain(groups)
    .range(["#e0ac2b", "#e85252", "#6689c6", "#9a6fb0", "#a53253"])

  // For the bubble size, we want to use a sqrt scale to ensure that the area of the circles is proportional to the data values. We can define a size scale like this:
  const sizeScale = useMemo(() => {
    const min = d3.min(data, d => d.pop);
    const max = d3.max(data, d => d.pop);
    return d3.scaleSqrt()
      .domain([min, max])
      .range([BUBBLE_MIN_SIZE, BUBBLE_MAX_SIZE]);
  }, [data]);


//Build shapes
  const allShapes = data
    .sort((a, b) => b.pop - a.pop)
    .map((d, i) => {
      return (
        <circle
          key={i}
          r={sizeScale(d.pop)}
          cx={xScale(d.gdpPercap)}
          cy={yScale(d.lifeExp)}
          opacity={1}
          stroke={colorScale(d.continent)}
          fill={colorScale(d.continent)}
          fillOpacity={0.4}
          strokeWidth={1}
        />
      );
    });

  return (
    <div style={{ position: "relative" }}>
          {/* TITLE */}
    <div style={{ marginLeft: MARGIN.left }}>
      <h2
        style={{
          margin: 0,
          fontSize: "20px",
          fontFamily: "sans-serif",
        }}
      >
        Global Inequalities Across Continents
      </h2>

      <p
        style={{
          margin: "4px 0 10px 0",
          fontSize: "14px",
          color: "#666",
          fontFamily: "sans-serif",
        }}
      >
        GDP per capita vs. life expectancy across 142 countries. Bubble size reflects population. 
      </p>
    </div>
      <svg width={width} height={height}>
        <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
          <AxisLeft yScale={yScale} pixelsPerTick={40} width={boundsWidth} height={boundsHeight} label="Life expectancy" />
          <g transform={`translate(0, ${boundsHeight})`}>
            <AxisBottom xScale={xScale} pixelsPerTick={190} width={boundsWidth} height={boundsHeight} label="GDP per capita" />
          </g>
          {allShapes}
        </g>
      </svg>
      </div>
  )
} 
