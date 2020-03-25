const { crypto, encoding, PrivateKey } = require('bitcore-lib-curve')
const { getPublicKeyFromPrivateKey } = require('./Api')
const { Buffer } = require('buffer')
const { compress } = require('./Utils')

const { BN, Hash } = crypto
const { Base58Check } = encoding

const signTypeMap = {
    ELA_STANDARD: { type: 0xac, address: 0x21 },
    ELA_MULTISIG: { type: 0xae, address: 0x12 },
    ELA_CROSSCHAIN: { type: 0xaf, address: 0x48 },
    ELA_IDCHAIN: { type: 0xad, address: 0x67 },
    ELA_DESTROY: {
        type: 0xaa,
        address: 0x0,
    },
}

// a, b => public key
const sortBigNumber = (a, b) => {
    const bBigInt = BN.fromBuffer(Buffer.from(a, 'hex').slice(1))
    const aBigInt = BN.fromBuffer(Buffer.from(b, 'hex').slice(1))
    return bBigInt.gt(aBigInt)
}

const toCode = (pubKeyBuf, signType) => {
    return Buffer.concat([Buffer.from([pubKeyBuf.length]), pubKeyBuf, Buffer.from([signType])])
}

const getAddressBase = (pubKey, signType) => {
    const pubKeyBuf = new Buffer(pubKey, 'hex')
    const code = toCode(pubKeyBuf, signTypeMap[signType].type)
    const hashBuf = Hash.sha256ripemd160(code)
    const programHashBuf = Buffer.concat([Buffer.from([signTypeMap[signType].address]), hashBuf])

    return Base58Check.encode(programHashBuf)
}

const getAddressByInfoBase = (info, signType) => {
    const infoBuf = new Buffer(info)
    const code = toCode(infoBuf, signTypeMap[signType].type)
    const hashBuf = Hash.sha256ripemd160(code)
    const programHashBuf = Buffer.concat([Buffer.from([signTypeMap[signType].address]), hashBuf])

    return Base58Check.encode(programHashBuf)
}

const getAddress = pubKey => getAddressBase(pubKey, 'ELA_STANDARD')

const getAddressFromPrivateKey = prvKey => {
    const prvKeyBuf = Buffer.from(prvKey, 'hex')
    const pubKeyObj = getPublicKeyFromPrivateKey(prvKeyBuf)
    return getAddress(compress(pubKeyObj))
}

const getDid = pubKey => getAddressBase(pubKey, 'ELA_IDCHAIN')

const getMultiSignAddress = (pubKeys, requiredCount) => {
    const keysCount = pubKeys.length

    const sortedPubKeys = pubKeys.sort(sortBigNumber)

    let buf = Buffer.from([0x51 + requiredCount - 1])

    sortedPubKeys.forEach(pub => {
        const pubInHex = Buffer.from(pub, 'hex')
        buf = Buffer.concat([buf, Buffer.from([pubInHex.length]), pubInHex])
    })

    buf = Buffer.concat([buf, Buffer.from([0x51 + keysCount - 1, 0xae])])

    const hashBuf = Hash.sha256ripemd160(buf)
    const programHashBuf = Buffer.concat([Buffer.from([0x12]), hashBuf])

    return Base58Check.encode(programHashBuf)
}

const getAddressByInfo = info => getAddressByInfoBase(info, 'ELA_STANDARD')

const getDidByInfo = info => getAddressByInfoBase(info, 'ELA_IDCHAIN')

module.exports = {
    toCode,
    getAddress,
    getAddressFromPrivateKey,
    getDid,
    getMultiSignAddress,
    getAddressByInfo,
    getDidByInfo,
}
