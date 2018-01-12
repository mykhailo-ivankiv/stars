class Point extends Array {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this[0] = x;
        this[1] = y;
    }
}
export default Point;