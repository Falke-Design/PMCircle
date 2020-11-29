const CircleUtils = {
    _calculateCircleCenter3P(A, B, C) {
        var yDelta_a = B.y - A.y;
        var xDelta_a = B.x - A.x;
        var yDelta_b = C.y - B.y;
        var xDelta_b = C.x - B.x;

        var center = {};

        var aSlope = yDelta_a / xDelta_a;
        var bSlope = yDelta_b / xDelta_b;

        center.x = (aSlope * bSlope * (A.y - C.y) + bSlope * (A.x + B.x) - aSlope * (B.x + C.x)) / (2 * (bSlope - aSlope));
        center.y = -1 * (center.x - (A.x + B.x) / 2) / aSlope + (A.y + B.y) / 2;
        return center;

    },
    _calculateCircleCenter2P(A, C) {
        var dis = this._distance(A, C);
        var r = dis / 2;
        var angle = this._angle(A, C);
        return this._findDestinationPoint(A, r, angle);
    },
    _findDestinationPoint(point, distance, angle) {
        var result = {};
        angle = angle - 90;
        result.x = Math.round(Math.cos(angle * Math.PI / 180) * distance + point.x);
        result.y = Math.round(Math.sin(angle * Math.PI / 180) * distance + point.y);
        return result;
    },
    _distance(p1, p2) {
        var x = p1.x - p2.x;
        var y = p1.y - p2.y;
        return Math.sqrt(x * x + y * y);
    },
    _angle(p1, p2) {
        var x = p1.x - p2.x;
        var y = p1.y - p2.y;
        var _angle = ((Math.atan2(y, x) * 180 / Math.PI) * (-1) - 90) * (-1);
        return _angle < 0 ? _angle + 180 : _angle - 180;
    }
};

export default CircleUtils;
