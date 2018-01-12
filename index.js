import { combineArray, fromEvent, chain, merge } from "most";
import { fromInput } from "./script/form";
import * as d3 from "d3";
import Star from "./script/star";

const $ = document.querySelector.bind(document);
const canvas = d3.select("#canvas");

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
    const { width, left, height, top } = document
      .querySelector("svg")
      .getBoundingClientRect();
    return [left + width / 2, top + height / 2, width / 300];
  })
  .chain(([cx, cy, scale]) => {
    console.log(scale);
    return mousemove
      .takeUntil(dragEnd)
      .map(([x, y]) => Math.sqrt((cx - x) ** 2 + (cy - y) ** 2) / scale);
  })
  .map(radius => {
    const min = 3;
    const max = 149;

    if (radius < min) return min;
    if (radius > max) return max;
    return radius;
  });

dragRadius.observe(radius => {
  $("#small-radius").value = radius;
});

const radius = merge(radiusInput, dragRadius);

const angle = dragStart
  .map(([x, y]) => {
    const { width, height } = document.body.getBoundingClientRect();
    const [cx, cy] = [width / 2, height / 2];
    const angle = Math.atan2(cx - x, cy - y);
    return [cx, cy, angle];
  })
  .chain(([cx, cy, startAngle]) => {
    const startCanvasAngle = Number(
      (d3
        .select(".wrapper")
        .style("transform")
        .match(/-?\d+\.\d+/) || [0])[0]
    );

    return mousemove
      .takeUntil(dragEnd)
      .map(
        ([x, y]) =>
          startCanvasAngle + (startAngle - Math.atan2(cx - x, cy - y)) * 57.3
      );
  })
  .observe(a => {
    d3.select(".wrapper").style("transform", `rotate(${a}deg)`);
  });

const star = new Star(canvas);

combineArray((...args) => args, [n, radius, showPoints, proportion]).observe(
  ([n, smallRadius, showPoints, proportion]) => {
    star.update(n, 150, smallRadius, proportion);
    star.render(showPoints);
  }
);
