import { combine, fromEvent, merge } from "most";
import { fromInput } from "./script/utils";
import { select } from "d3";
import Star from "./script/star";

const $ = document.querySelector.bind(document);
const canvas = select("#canvas");

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
    const startCanvasAngle = star.angle;

    return mousemove
      .takeUntil(dragEnd)
      .map(
        ([x, y]) =>
          startCanvasAngle + (startAngle - Math.atan2(cx - x, cy - y))
      );
  });

angle.observe(a => {
    star.setAngle(a)
});

const star = new Star(canvas);

combine(Array.of, n, radius).observe(([n, radius]) =>
  star.update(n, 150, radius)
);

showPoints.observe(showPoints => star.showPoints(showPoints));
proportion.observe(proportion => star.setCurveProportion(proportion));
