class Point extends Array {
  constructor(a, b, type) {
    super();

    if (type === "radian") {
      this.initRadian(a, b);
    } else {
      this.initDecart(a, b);
    }
  }

  initDecart(x, y) {
    this.x = x;
    this.y = y;
    this[0] = x;
    this[1] = y;
  }

  initRadian(angle, radius) {
    this.initDecart(Math.cos(angle) * radius, Math.sin(angle) * radius);
  }
}
export default Point;
