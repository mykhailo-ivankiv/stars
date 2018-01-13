class Points extends Array {
    static render (context, data, className = "") {
        const points = context.selectAll("." + className).data(data);

        points
            .enter()
            .append("circle")
            .attr("class", className)
            .attr("r", 3)
            .merge(points)
            .attr("cx", d => d[0])
            .attr("cy", d => d[1]);

        points.exit().remove();
    }
    constructor() {
        super();
    }
    add(point) {
        this.push(point);
        return this;
    }
}

export default Points;