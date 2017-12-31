import { fromEvent, combineArray } from "most";
import * as d3 from "d3";

const star = d3.select("#canvas").append("path");

const middlePoint = ([x1, y1], [x2, y2]) => [(x1 + x2) / 2, (y1 + y2) / 2];

const getPoints = (n, r1, r2) => {
  const angle = 2 * Math.PI / n;

  const basePoints = Array(n)
    .fill()
    .reduce((accum, el, i) => {
      accum.push([Math.cos(angle * i) * r1, Math.sin(angle * i) * r1]);

      accum.push([
        Math.cos(angle * i + angle / 2) * r2,
        Math.sin(angle * i + angle / 2) * r2
      ]);

      return accum;
    }, []);

  const additionalPoints = basePoints.map((el, i, arr) =>
    middlePoint(el, arr[i + 1] ? arr[i + 1] : arr[0])
  );
  return { basePoints, additionalPoints };
};

const renderStarPath = (n, bigRadius, smallRadius, drawLine) => {
  const { basePoints, additionalPoints } = getPoints(n, bigRadius, smallRadius);

  if (drawLine) {
    return `
        M ${basePoints[0].join()}
        ${basePoints.map(point => `L ${point.join(" ")} `).join(" ")}
        L ${basePoints[0].join()}
    `;
  } else {
    return `
        M ${additionalPoints[2 * n - 1].join()}
        ${basePoints
          .map((point, i) => `Q ${point.join()} ${additionalPoints[i].join()}`)
          .join(" ")}
    `;
  }
};

const renderPoints = (data, className = "") => {
  const points = d3
    .select("#canvas")
    .selectAll("." + className)
    .data(data);

  points.attr("cx", d => d[0]).attr("cy", d => d[1]);

  points
    .enter()
    .append("circle")
    .attr("class", className)
    .attr("r", 3)
    .attr("cx", d => d[0])
    .attr("cy", d => d[1]);

  points.exit().remove();
};

const n = fromEvent("input", document.querySelector("#n"))
  .map(e => e.target.value)
  .map(Number)
  .startWith(5);

const sRadius = fromEvent("input", document.querySelector("#small-radius"))
  .map(e => e.target.value)
  .map(Number)
  .startWith(40);

const showPoints = fromEvent("input", document.querySelector("#show-points"))
  .map(e => e.target.checked)
  .map(Boolean)
  .startWith(true);

const drawLine = fromEvent("input", document.querySelector("#draw-line"))
  .map(e => e.target.checked)
  .map(Boolean)
  .startWith(false);

combineArray((...args) => args, [n, sRadius, showPoints, drawLine]).observe(
  ([n, smallRadius, showPoints, drawLine]) => {
    star.attr("d", renderStarPath(n, 150, smallRadius, drawLine));

    showPoints
      ? document.querySelector("#canvas").classList.add("Star_points")
      : document.querySelector("#canvas").classList.remove("Star_points");

    const { basePoints, additionalPoints } = getPoints(n, 150, smallRadius);
    renderPoints(basePoints, "base");
    renderPoints(additionalPoints, "middle");
  }
);
