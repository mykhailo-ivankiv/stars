import Point from "./Point";
class Line extends Array {
    constructor(begin, end) {
        super();
        this.begin = begin;
        this.end = end;
        this[0] = begin;
        this[1] = end;
    }

    getPointAtPart(part) {
        const d = this.distance();
        const k1 = d * part;
        const k2 = d - k1;
        return new Point(
            (this.begin.x * k1 + this.end.x * k2) / d,
            (this.begin.y * k1 + this.end.y * k2) / d
        );
    }

    distance() {
        return Math.sqrt(
            (this.begin.x + this.end.x) ** 2 + (this.begin.y + this.end.y) ** 2
        );
    }
}

export default Line;