const buffer = require('buffer')

function equals(a, b) {
    if (a.length !== b.length) {
        return false
    }
    const length = a.length
    for (let i = 0; i < length; i++) {
        if (a[i] !== b[i]) {
            return false
        }
    }
    return true
}

module.exports = {
    fill: function fill(buffer, value) {
        const length = buffer.length
        for (let i = 0; i < length; i++) {
            buffer[i] = value
        }
        return buffer
    },

    copy: function(original) {
        const buffer = Buffer.alloc(original.length)
        original.copy(buffer)
        return buffer
    },

    isBuffer: function isBuffer(arg) {
        return buffer.Buffer.isBuffer(arg) || arg instanceof Uint8Array
    },

    emptyBuffer: function emptyBuffer(bytes) {
        const result = new buffer.Buffer(bytes)
        for (let i = 0; i < bytes; i++) {
            result.write('\0', i)
        }
        return result
    },

    concat: buffer.Buffer.concat,
    equals: equals,
    equal: equals,

    /**
     * Transforms a number from 0 to 255 into a Buffer of size 1 with that value
     */
    integerAsSingleByteBuffer: function integerAsSingleByteBuffer(integer) {
        return new buffer.Buffer([integer & 0xff])
    },

    /**
     * Transform a 4-byte integer into a Buffer of length 4.
     */
    integerAsBuffer: function integerAsBuffer(integer) {
        const bytes = []
        bytes.push((integer >> 24) & 0xff)
        bytes.push((integer >> 16) & 0xff)
        bytes.push((integer >> 8) & 0xff)
        bytes.push(integer & 0xff)
        return Buffer.from(bytes)
    },

    /**
     * Transform the first 4 values of a Buffer into a number, in little endian encoding
     */
    integerFromBuffer: function integerFromBuffer(buffer) {
        return (buffer[0] << 24) | (buffer[1] << 16) | (buffer[2] << 8) | buffer[3]
    },

    /**
     * Transforms the first byte of an array into a number ranging from -128 to 127
     */
    integerFromSingleByteBuffer: function integerFromBuffer(buffer) {
        return buffer[0]
    },

    bufferToHex: function bufferToHex(buffer) {
        return buffer.toString('hex')
    },

    reverse: function reverse(param) {
        const ret = new buffer.Buffer(param.length)
        for (let i = 0; i < param.length; i++) {
            ret[i] = param[param.length - i - 1]
        }
        return ret
    },

    hexToBuffer: function hexToBuffer(string) {
        return new buffer.Buffer(string, 'hex')
    },
}

module.exports.NULL_HASH = module.exports.fill(Buffer.alloc(32), 0)
module.exports.EMPTY_BUFFER = Buffer.alloc(0)
