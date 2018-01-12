const getPointAtLinePart = ([x1, y1], [x2, y2], part) => {
  const d = Math.sqrt(Math.abs((x1 + x2) ** 2 + (y1 + y2) ** 2));
  const k1 = d * part;
  const k2 = d - k1;
  return [(x1 * k1 + x2 * k2) / d, (y1 * k1 + y2 * k2) / d];
};

export const getPoints = (n, r1, r2) => {
  const angle = 2 * Math.PI / n;

  return [...Array(n).keys()].reduce((accum, i) => {
    accum.push([Math.cos(angle * i) * r1, Math.sin(angle * i) * r1]);

    accum.push([
      Math.cos(angle * i + angle / 2) * r2,
      Math.sin(angle * i + angle / 2) * r2
    ]);

    return accum;
  }, []);
};

export const getAdditionalPoints = (points, part = 1 / 2) =>
  points.reduce((accum, el, i, arr) => {
    accum.push(
      getPointAtLinePart(el, arr[i + 1] ? arr[i + 1] : arr[0], 1 - part),
      getPointAtLinePart(el, arr[i + 1] ? arr[i + 1] : arr[0], part)
    );

    return accum;
  }, []);

const renderStarPath = (basePoints, additionalPoints) => {
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
};
export default renderStarPath;

export const renderPoints = (context, data, className = "") => {
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
};
