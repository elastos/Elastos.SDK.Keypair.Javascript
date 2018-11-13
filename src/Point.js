const BN = require('./BigNumber')
const EC = require('elliptic').ec
const { Buffer } = require('buffer')

const ec = new EC('p256')
const ecPoint = ec.curve.point.bind(ec.curve)
const ecPointFromX = ec.curve.pointFromX.bind(ec.curve)

const Point = function Point(x, y, isRed) {
    let point
    try {
        point = ecPoint(x, y, isRed)
    } catch (e) {
        throw new Error('Invalid Point')
    }
    point.validate()
    return point
}

Point.prototype = Object.getPrototypeOf(ec.curve.point())

Point.fromX = function fromX(odd, x) {
    try {
        var point = ecPointFromX(x, odd)
    } catch (e) {
        throw new Error('Invalid X')
    }
    point.validate()
    return point
}

Point.getG = function getG() {
    return ec.curve.g
}

Point.getN = function getN() {
    return new BN(ec.curve.n.toArray())
}

Point.prototype._getX = Point.prototype.getX

Point.prototype.getX = function getX() {
    return new BN(this._getX().toArray())
}

Point.prototype._getY = Point.prototype.getY

Point.prototype.getY = function getY() {
    return new BN(this._getY().toArray())
}

Point.prototype.validate = function validate() {
    if (this.isInfinity()) {
        throw new Error('Point cannot be equal to Infinity')
    }

    var p2
    try {
        p2 = ecPointFromX(this.getX(), this.getY().isOdd())
    } catch (e) {
        throw new Error('Point does not lie on the curve')
    }

    if (p2.y.cmp(this.y) !== 0) {
        throw new Error('Invalid y value for curve.')
    }

    //todo: needs test case
    if (!this.mul(Point.getN()).isInfinity()) {
        throw new Error('Point times N must be infinity')
    }

    return this
}

Point.pointToCompressed = function pointToCompressed(point) {
    var xbuf = point.getX().toBuffer({ size: 32 })
    var ybuf = point.getY().toBuffer({ size: 32 })

    var prefix
    var odd = ybuf[ybuf.length - 1] % 2
    if (odd) {
        prefix = Buffer.from([0x03])
    } else {
        prefix = Buffer.from([0x02])
    }
    return Buffer.concat([prefix, xbuf])
}

module.exports = Point
