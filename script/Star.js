import Line from "./Line";
import Point from "./Point";
import Points from "./Points";
import { range } from "d3";
import { circlePairs } from "./utils";

class Star {
  constructor(canvas) {
    this.canvas = canvas;
    this.root = canvas.append("path");
    this.proportion = 0.5;
    this.angle = 0;
  }

  update(n, radius, smallRadius) {
    this.n = n;
    this.radius= radius;
    this.smallRadius = smallRadius;

    this.calculateMainPoints(n, radius, smallRadius);
    this.render();
  }

  setCurveProportion(proportion) {
    this.proportion = proportion;
    this.calculateBezierPoints();
    this.render();
  }

  calculateMainPoints() {
    const {n, radius, smallRadius} = this;
    const angle = Math.PI / n;
    this.basePoints = range(2 * n)
      .map(i => (i % 2 ? radius : smallRadius))
      .map((radius, i) => new Point(angle * i, radius, "radian"));

    this.calculateBezierPoints();
  }

  calculateBezierPoints() {
    this.additionalPoints = circlePairs(this.basePoints)
      .map(([p1, p2]) => new Line(p1, p2))
      .reduce(
        (accum, line) =>
          accum
            .add(line.getPointAtPart(1 - this.proportion))
            .add(line.getPointAtPart(this.proportion)),
        new Points()
      );
  }

  getPath() {
    const { basePoints, additionalPoints } = this;

    const n = additionalPoints.length;
    return `
       M ${additionalPoints[n - 1].join()}
       ${basePoints
         .map(
           (point, i) => `
             Q ${basePoints[i].join()} ${additionalPoints[i * 2].join()}
             L ${additionalPoints[i * 2 + 1].join()}
           `
         )
         .join("")}
   `;
  }

  showPoints(showPoints) {
    this.canvas.classed("Star_points", showPoints);
  }

  setAngle(angle) {
    this.angle = angle;
    this.canvas
        .attr("transform", `translate(150,150)rotate(${angle * 57.2958})`)
  }

  render() {
    this.root.attr("d", this.getPath());

    this.canvas
      .call(Points.render, this.basePoints.filter((a, i) => !(i % 2)), "inner")
      .call(Points.render, this.basePoints.filter((a, i) => i % 2), "outer")
      .call(Points.render, this.additionalPoints, "middle");
  }
}

export default Star;
