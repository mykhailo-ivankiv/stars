import { fromEvent, combineArray } from "most";
import * as d3 from "d3";

const star = d3.select("#canvas").append("path");

const getPointAtLinePart = ([x1, y1], [x2, y2], part) => {
    const d = Math.sqrt(Math.abs( (x1 + x2) **2  + (y1+y2)**2  ))
    const k1 = d * part;
    const k2 = d - k1;
    return [
        (x1 * k1 + x2 * k2) / d,
        (y1  * k1 + y2 * k2) / d
    ]
};

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

  return basePoints;
};

const getAdditionalPoints = points =>
  points.map((el, i, arr) =>
    getPointAtLinePart(el, arr[i + 1] ? arr[i + 1] : arr[0])
  );

const getExtendedAdditionalPoints = (points, part = 1 / 2) =>
  points.reduce((accum, el, i, arr) => {
    accum.push(getPointAtLinePart(el, arr[i + 1] ? arr[i + 1] : arr[0],  1 - part ));
    accum.push( getPointAtLinePart(el, arr[i + 1] ? arr[i + 1] : arr[0],  part) );
    return accum;
  }, []);

const renderStarPath = (basePoints, additionalPoints) => {
  const n = additionalPoints.length;
  return `
         M ${additionalPoints[n - 1].join()}
         ${basePoints.map((point, i) => `
             Q ${basePoints[i].join()} ${additionalPoints[i * 2].join()}
             L ${additionalPoints[i * 2 + 1].join()}
         `).join("")}
     `;
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

 const proportion = fromEvent("input", document.querySelector("#proportions"))
    .map(e => e.target.value)
    .map(Number)
    .startWith(0.5);

const showPoints = fromEvent("input", document.querySelector("#show-points"))
  .map(e => e.target.checked)
  .map(Boolean)
  .startWith(true);

combineArray((...args) => args, [n, sRadius, showPoints, proportion]).observe(
  ([n, smallRadius, showPoints,  proportion]) => {
    showPoints
      ? document.querySelector("#canvas").classList.add("Star_points")
      : document.querySelector("#canvas").classList.remove("Star_points");

    const basePoints = getPoints(n, 150, smallRadius);
    const additionalPoints = getExtendedAdditionalPoints(basePoints, proportion);

    star.attr("d", renderStarPath(basePoints, additionalPoints));

    renderPoints(basePoints, "base");
    renderPoints(additionalPoints, "middle");
  }
);
