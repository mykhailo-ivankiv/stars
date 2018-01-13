import Line from "./Line";
import Point from "./Point";
import Points from "./Points";

class Star {
  constructor(canvas) {
    this.canvas = canvas;
    this.root = canvas.append("path");
  }

  update(n, radius, smallRadius, proportion) {
    this.basePoints = this.getPoints(n, radius, smallRadius);
    this.additionalPoints = this.getAdditionalPoints(proportion);
  }

  getPoints(n, r1, r2) {
    const angle = 2 * Math.PI / n;

    return [...Array(n).keys()].reduce(
      (accum, i) =>
        accum
          .add(new Point(angle * i, r1, "radian"))
          .add(new Point(angle * (i + 1 / 2), r2, "radian")),
      new Points()
    );
  }

  getAdditionalPoints(part = 1 / 2) {
    return this.basePoints.reduce((accum, el, i, arr) => {
      const line = new Line(el, arr[i + 1] || arr[0]);
      return accum
        .add(line.getPointAtPart(1 - part))
        .add(line.getPointAtPart(part));
    }, new Points());
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

  render(showPoints) {
    this.root.attr("d", this.getPath());

    this.canvas
      .classed("Star_points", showPoints)
      .call(
        Points.render,
        this.basePoints.filter((a, i) => !(i % 2)),
        "outer"
      )
      .call(Points.render, this.basePoints.filter((a, i) => i % 2), "inner")
      .call(Points.render, this.additionalPoints, "middle");
  }
}

export default Star;
