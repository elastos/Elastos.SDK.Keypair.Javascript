const { getAddressFromPrivateKey } = require('../Address')

class UtxoTxInput {
    constructor(txid, index, privateKey) {
        this.txid = txid
        this.index = index
        this.privateKey = privateKey
        this.address = getAddressFromPrivateKey(privateKey)
    }

    toString() {
        return `txid, index, privateKey, address: <${this.txid}, ${this.index}, ${this.privateKey}, ${this.address}>`
    }

    serialize() {}
}

module.exports = UtxoTxInput
