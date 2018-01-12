import { combineArray, fromEvent, chain, merge } from "most";
import { fromInput } from "./script/form";
import * as d3 from "d3";
import renderStarPath, {
  renderPoints,
  getPoints,
  getAdditionalPoints
} from "./script/star";

const $ = document.querySelector.bind(document);
const canvas = d3.select("#canvas");
const star = canvas.append("path");

const n = fromInput($("#n")).map(Number);
const radiusInput = fromInput($("#small-radius")).map(Number);
const proportion = fromInput($("#proportions")).map(Number);
const showPoints = fromInput($("#show-points")).map(Boolean);

const dragStart = fromEvent("mousedown", canvas.node())
  .filter(ev => ev.target.matches(".inner"))
  .map(ev => [ev.clientX, ev.clientY]);

const dragEnd = fromEvent("mouseup", document);

const mousemove = fromEvent("mousemove", window).map(ev => [
  ev.clientX,
  ev.clientY
]);


const dragRadius = dragStart
    .map(() => {
        const { width, left, height, top } = document.querySelector("svg").getBoundingClientRect();
        return [left + width / 2, top + height / 2, width / 300];
    })
    .chain(([cx, cy, scale]) => {
        return mousemove
            .takeUntil(dragEnd)
            .map(([x, y]) => Math.sqrt((cx - x) ** 2 + (cy - y) ** 2) / scale);
    })
    .map ( radius => {
        const min=3;
        const max=149;

        if ( radius < min) return min;
        if ( radius > max) return max;
        return radius
    })

dragRadius.observe ( radius => {
    $("#small-radius").value = radius;
})

const radius = merge(
  radiusInput,
  dragRadius
);

const angle = dragStart
  .map(() => {
    const { width, height } = document.body.getBoundingClientRect();
    return [width / 2, height / 2];
  })
  .chain(([cx, cy]) => {
    return mousemove
      .takeUntil(dragEnd)
      .map(([x, y]) => Math.atan2(cx - x, cy - y));
  });

combineArray((...args) => args, [n, radius, showPoints, proportion]).observe(
  ([n, smallRadius, showPoints, proportion]) => {
    const basePoints = getPoints(n, 150, smallRadius);
    const additionalPoints = getAdditionalPoints(basePoints, proportion);

    star.attr("d", renderStarPath(basePoints, additionalPoints));
    canvas
      .classed("Star_points", showPoints)

      .call(renderPoints, basePoints.filter((a, i) => !(i % 2)), "outer")
      .call(renderPoints, basePoints.filter((a, i) => i % 2), "inner")
      .call(renderPoints, additionalPoints, "middle");
  }
);
