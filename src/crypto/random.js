const crypto = require('crypto')

function Random() {}

/* secure random bytes that sometimes throws an error due to lack of entropy */
Random.getRandomBuffer = function(size) {
    if (process.browser) return Random.getRandomBufferBrowser(size)
    else return Random.getRandomBufferNode(size)
}

Random.getRandomBufferNode = function(size) {
    return crypto.randomBytes(size)
}

Random.getRandomBufferBrowser = function(size) {
    if (!window.crypto && !window.msCrypto) throw new Error('window.crypto not available')

    if (window.crypto && window.crypto.getRandomValues) var crypto = window.crypto
    else if (window.msCrypto && window.msCrypto.getRandomValues)
        //internet explorer
        var crypto = window.msCrypto
    else throw new Error('window.crypto.getRandomValues not available')

    var bbuf = new Uint8Array(size)
    crypto.getRandomValues(bbuf)
    var buf = Buffer.from(bbuf)

    return buf
}
