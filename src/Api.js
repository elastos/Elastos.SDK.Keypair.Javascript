const HDPrivateKey = require('./HDPrivateKey')
const PrivateKey = require('./PrivateKey')
const ecdsa = require('./crypto/ecdsa')
const hash = require('./crypto/hash')
const { getSeedFromMnemonic } = require('./Mnemonic')
const { getAddress } = require('./Address')

const getMasterPublicKey = seed => {
    const prvKey = HDPrivateKey.fromSeed(seed)
    const parent = new HDPrivateKey(prvKey.xprivkey)

    const multiWallet = parent
        .deriveChild(44, true)
        .deriveChild(0, true)
        .deriveChild(0, true)

    return multiWallet.xpubkey
}

// TODO fix return type
const getMasterPublicKeyFromKey = prvKey => {
    const parent = new HDPrivateKey(prvKey.xprivkey)

    const multiWallet = parent
        .deriveChild(44, true)
        .deriveChild(0, true)
        .deriveChild(0, true)

    return multiWallet
}

const getIdChainMasterPublicKey = seed => {
    const prvKey = HDPrivateKey.fromSeed(seed)
    const parent = new HDPrivateKey(prvKey.xprivkey)
    const singleWallet = parent.deriveChild(0, true)

    return singleWallet.xpubkey
}

const getSingleWallet = seed => {
    const prvKey = HDPrivateKey.fromSeed(seed)
    const parent = new HDPrivateKey(prvKey.xprivkey)
    return parent.deriveChild(1, true).deriveChild(0)
}
const getMultiWallet = (seed, i) => {
    const prvKey = HDPrivateKey.fromSeed(seed)
    const parent = new HDPrivateKey(prvKey.xprivkey)
    return parent
        .deriveChild(44, true)
        .deriveChild(0, true)
        .deriveChild(0, true)
        .deriveChild(0, false)
        .deriveChild(i, false)
}

const getSinglePrivateKey = seed => getSingleWallet(seed).privateKey
const getSinglePublicKey = seed => getSingleWallet(seed).publicKey
const getPublicKeyFromPrivateKey = prvKey => PrivateKey.fromBuffer(prvKey).publicKey
const generateSubPrivateKey = (seed, i) => getMultiWallet(seed, i).privateKey
const generateSubPublicKey = (seed, i) => getMultiWallet(seed, i).publicKey

// const prvKey = '1615CC0AB02168680354E07048F9CE54B2921847F68453586C4A2DBC23BA2C9D'
// const signature = ecdsa.sign(Buffer.from(hash.sha256('helloworld')), PrivateKey.fromString(prvKey), 'little')
//
// console.log(
//     generateSubPrivateKey(
//         '466cf12d6ee119bf15e26be50e4b3624d46457bf1051f2c0c1b61b4fb921a5b65cc54714ea8e9aa51c22ca2eb89913fb8dab5676c778516ca1a04a47693d8bef',
//         0,
//     ).toString(),
//     generateSubPublicKey(
//         '466cf12d6ee119bf15e26be50e4b3624d46457bf1051f2c0c1b61b4fb921a5b65cc54714ea8e9aa51c22ca2eb89913fb8dab5676c778516ca1a04a47693d8bef',
//         0,
//     ).toString(),
//     getAddress(Buffer.from('030f1ee41fe75591852c644ddb97b51dbff6d407cf39b402f19f3fb5932f1f26b1', 'hex')),
// )

module.exports = {
    getMasterPublicKey,
    getSinglePrivateKey,
    getSinglePublicKey,
    getPublicKeyFromPrivateKey,
    generateSubPrivateKey,
    generateSubPublicKey,
    getIdChainMasterPublicKey,
}
