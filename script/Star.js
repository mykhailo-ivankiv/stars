import Line from "./Line";
import Point from "./Point";

class Star {
  constructor(canvas) {
    this.canvas = canvas;
    this.root = canvas.append("path");
  }

  update(n, radius, smallRadius, proportion) {
    this.basePoints = this.getPoints(n, radius, smallRadius);
    this.additionalPoints = this.getAdditionalPoints(
      this.basePoints,
      proportion
    );
  }

  getPoints(n, r1, r2) {
    const angle = 2 * Math.PI / n;

    return [...Array(n).keys()].reduce((accum, i) => {
      accum.push([Math.cos(angle * i) * r1, Math.sin(angle * i) * r1]);

      accum.push([
        Math.cos(angle * i + angle / 2) * r2,
        Math.sin(angle * i + angle / 2) * r2
      ]);

      return accum;
    }, []);
  }

  getAdditionalPoints(points, part = 1 / 2) {
    return points.reduce((accum, el, i, arr) => {
      const p1 = new Point(...el);
      const p2 = new Point(...(arr[i + 1] ? arr[i + 1] : arr[0]));

      const line = new Line(p1, p2);

      accum.push(line.getPointAtPart(1 - part), line.getPointAtPart(part));

      return accum;
    }, []);
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

  renderPoints(context, data, className = "") {
    const points = context.selectAll("." + className).data(data);

    points.attr("cx", d => d[0]).attr("cy", d => d[1]);

    points
      .enter()
      .append("circle")
      .attr("class", className)
      .attr("r", 3)
      .attr("cx", d => d[0])
      .attr("cy", d => d[1]);

    points.exit().remove();
  }

  render(showPoints) {
    this.root.attr("d", this.getPath());

    this.canvas
      .classed("Star_points", showPoints)
      .call(
        this.renderPoints,
        this.basePoints.filter((a, i) => !(i % 2)),
        "outer"
      )
      .call(this.renderPoints, this.basePoints.filter((a, i) => i % 2), "inner")
      .call(this.renderPoints, this.additionalPoints, "middle");
  }
}

export default Star;
