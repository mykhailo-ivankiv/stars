import { fromEvent, combineArray } from "most";
import * as d3 from "d3";

const createElement = document.createElementNS.bind(
  document,
  "http://www.w3.org/2000/svg"
);

const star = createElement("path");

const middlePoint = (p1, p2) => [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];

const renderStarPath = (n, bigRadius, smallRadius, drawLine) => {
  const angle = 2 * Math.PI / n;
  const apex = Array(n)
    .fill()
    .map((el, i) => i);

  const points = apex.reduce((accum, i) => {
    accum.push([
      Math.cos(angle * i) * bigRadius,
      Math.sin(angle * i) * bigRadius
    ]);

    accum.push([
      Math.cos(angle * i + angle / 2) * smallRadius,
      Math.sin(angle * i + angle / 2) * smallRadius
    ]);

    return accum;
  }, []);

  const middlePoints = points.reduce((accum, el, i, arr) => {
    accum.push(middlePoint(el, arr[i + 1] ? arr[i + 1] : arr[0]));
    return accum;
  }, []);

  if (drawLine) {
    return `
        M ${points[0].join()}
        ${points.map( point => `L ${point.join(" ")} `).join(" ")}
        L ${points[0].join()}
    `;
  } else {
    return `
        M ${middlePoints[2 * n - 1].join()}
        ${points
          .map((point, i) => `Q ${point.join()} ${middlePoints[i].join()}`)
          .join(" ")}
    `;
  }
};

document.querySelector("#canvas").append(star);

const renderPoints = (n, bigRadius, smallRadius, className = "") => {
  const angle = 2 * Math.PI / n;
  const apex = Array(n)
    .fill()
    .map((el, i) => i);

  const pointsBig = apex.map(i => [
    Math.cos(angle * i) * bigRadius,
    Math.sin(angle * i) * bigRadius
  ]);

  const pointsSmall = apex.map(i => [
    Math.cos(angle * i + angle / 2) * smallRadius,
    Math.sin(angle * i + angle / 2) * smallRadius
  ]);

  const points = d3
    .select("#canvas")
    .selectAll("." + className)
    .data(pointsBig.concat(pointsSmall));

  points.attr("cx", d => d[0]).attr("cy", d => d[1]);

  points
    .enter()
    .append("circle")
    .attr("class", className)
    .attr("r", 3)
    .attr("cx", d => d[0])
    .attr("cy", d => d[1]);

  points.exit().remove();

  const middlePoints = apex.reduce((accum, i) => {
    accum.push(
      middlePoint(
        pointsBig[i],
        pointsSmall[i - 1] ? pointsSmall[i - 1] : pointsSmall[n - 1]
      )
    );
    accum.push(middlePoint(pointsBig[i], pointsSmall[i]));
    return accum;
  }, []);

  const middlePointsEl = d3
    .select("#canvas")
    .selectAll(".middle")
    .data(middlePoints);

  middlePointsEl.attr("cx", d => d[0]).attr("cy", d => d[1]);

  middlePointsEl
    .enter()
    .append("circle")
    .attr("class", "middle")
    .attr("r", 3)
    .attr("cx", d => d[0])
    .attr("cy", d => d[1]);

  middlePointsEl.exit().remove();
};

const n = fromEvent("input", document.querySelector("#n"))
  .map(e => e.target.value)
  .map(Number)
  .startWith(3);

const sRadius = fromEvent("input", document.querySelector("#small-radius"))
  .map(e => e.target.value)
  .map(Number)
  .startWith(40);

const showPoints = fromEvent("input", document.querySelector("#show-points"))
  .map(e => e.target.checked)
  .map(Boolean)
  .startWith(false);

const drawLine = fromEvent("input", document.querySelector("#draw-line"))
  .map(e => e.target.checked)
  .map(Boolean)
  .startWith(false);

combineArray((...args) => args, [n, sRadius, showPoints, drawLine]).observe(
  ([n, smallRadius, showPoints, drawLine]) => {

    d3.select(star)
        .attr("d", renderStarPath(n, 150, smallRadius, drawLine));

    showPoints
      ? document.querySelector("#canvas").classList.add("Star_points")
      : document.querySelector("#canvas").classList.remove("Star_points");

    renderPoints(n, 150, smallRadius, "base");
  }
);
