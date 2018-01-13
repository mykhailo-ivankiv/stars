class Point extends Array {
  constructor(a, b, type) {
    super();

    if (type === "polar") {
      this.initRadian(a, b);
    } else {
      this.initCartesian(a, b);
    }
  }

  initCartesian(x, y) {
    this.x = x;
    this.y = y;
    this[0] = x;
    this[1] = y;
  }

  initRadian(angle, radius) {
    this.initCartesian(Math.cos(angle) * radius, Math.sin(angle) * radius);
  }
}
export default Point;
