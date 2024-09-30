import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const DonutChartCrypto = ({ data, colors, id }) => {
  const ref = useRef();

  useEffect(() => {
    if (data && ref.current) {
      const svg = d3.select(ref.current);
      svg.selectAll("*").remove(); // Clear SVG contents

      const width = +svg.attr("width");
      const height = +svg.attr("height");
      const radius = Math.min(width, height) / 2;

      const color = d3.scaleOrdinal(colors);

      const pie = d3
        .pie()
        .value((d) => d.value)
        .sort(null);

      const outerArc = d3
        .arc()
        .outerRadius(radius - 100)
        .innerRadius(radius - 80);

      const labelArc = d3
        .arc()
        .outerRadius(radius - 60)
        .innerRadius(radius - 60);

      const g = svg
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

      // Calculate the total value of all segments
      const total = d3.sum(data, (d) => d.value);

      const arc = g
        .selectAll(".arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "arc");

      arc
        .append("path")
        .attr("d", outerArc)
        .attr("fill", (d) => color(d.data.label))
        .each(function (d) {
          this._current = d;
        }); // Store the initial angles

      arc
        .append("text")
        .attr("transform", (d) => `translate(${labelArc.centroid(d)})`)
        .attr("text-anchor", "middle")
        .text((d) => d.data.label)
        .style("font-size", "8px")
        .style("fill", "gray");

      // Tooltip setup
      const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "d3-tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("padding", "10px")
        .style("background", "rgba(0, 0, 0, 0.6)")
        .style("border-radius", "4px")
        .style("color", "#fff")
        .text("a simple tooltip");

      // Hover events
      arc
        .on("mouseover", function (event, d) {
          tooltip.text(
            `${d.data.label}: ${(d.data.value).toFixed(1)}`
          );
          return tooltip.style("visibility", "visible");
        })
        .on("mousemove", function (event) {
          return tooltip
            .style("top", event.pageY - 10 + "px")
            .style("left", event.pageX + 10 + "px");
        })
        .on("mouseout", function () {
          return tooltip.style("visibility", "hidden");
        });
    }
  }, [data, colors, id]); // Add id to the dependencies array

  return (
    <svg ref={ref} width={400} height={375} id={id}>
      <g />
    </svg>
  );
};

export default DonutChartCrypto;
