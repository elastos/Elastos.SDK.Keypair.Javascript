const { HDPrivateKey, HDPublicKey, PublicKey, PrivateKey, crypto } = require('bitcore-lib-curve')
const { Buffer } = require('buffer')
const { ecdsa, hash } = crypto
const { getSeedFromMnemonic } = require('./Mnemonic')
const { getAddress } = require('./Address')
const rs = require('jsrsasign')
const { uncompress } = require('./Utils')

const COIN_TYPE_ELA = 0
const COIN_TYPE_IDCHAIN = 1

const EXTERNAL_CHAIN = 0
const INTERNAL_CHAIN = 1

const ELA_ASSERT_ID = 'a3d0eaa466df74983b5d7c543de6904f4c9418ead5ffd6d25814234a96db37b0'

const getMasterPublicKey = (seed, coinType = COIN_TYPE_ELA) => {
    const prvKey = HDPrivateKey.fromSeed(seed)
    const parent = new HDPrivateKey(prvKey.xprivkey)

    const multiWallet = parent
        .deriveChild(44, true)
        .deriveChild(coinType, true)
        .deriveChild(0, true)

    return multiWallet.xpubkey
}

const getIdChainMasterPublicKey = seed => {
    const prvKey = HDPrivateKey.fromSeed(seed)
    const parent = new HDPrivateKey(prvKey.xprivkey)
    const idChain = parent.deriveChild(0, true)

    return idChain.publicKey
}

const getDidWallet = (seed, index) => {
    const prvKey = HDPrivateKey.fromSeed(seed)
    const parent = new HDPrivateKey(prvKey.xprivkey)

    const didWallet = parent
        .deriveChild(0, true)
        .deriveChild(0, false)
        .deriveChild(index, false)

    return didWallet
}

const generateIdChainSubPrivateKey = (seed, index) => getDidWallet(seed, index).privateKey
const generateIdChainSubPublicKey = (masterPublicKey, index) => getDidWallet(seed, index).publicKey

const getSingleWallet = seed => getMultiWallet(seed, COIN_TYPE_ELA, EXTERNAL_CHAIN, 0)

const getMultiWallet = (seed, coinType, changeChain, index) => {
    const prvKey = HDPrivateKey.fromSeed(seed)
    const parent = new HDPrivateKey(prvKey.xprivkey)
    return parent
        .deriveChild(44, true)
        .deriveChild(coinType ? coinType : COIN_TYPE_ELA, true)
        .deriveChild(0, true)
        .deriveChild(changeChain ? changeChain : EXTERNAL_CHAIN, false)
        .deriveChild(index ? index : 0, false)
}

const getSinglePrivateKey = seed => getSingleWallet(seed).privateKey
const getSinglePublicKey = seed => getSingleWallet(seed).publicKey
const getPublicKeyFromPrivateKey = prvKey => PrivateKey.fromBuffer(prvKey).publicKey
const generateSubPrivateKey = (seed, coinType, changeChain, index) => {
    return getMultiWallet(seed, coinType, changeChain, index).privateKey
}
const generateSubPublicKey = (masterPublicKey, changeChain, index) => {
    const parent = new HDPublicKey(masterPublicKey)
    return parent.deriveChild(changeChain ? changeChain : EXTERNAL_CHAIN).deriveChild(index).publicKey
}

const sign = (data, prvKey, hex = false) => {
    if (!hex) data = Buffer.from(data, 'utf8').toString('hex')
    var signer = new rs.KJUR.crypto.Signature({ alg: 'SHA256withECDSA' })
    signer.init({ d: prvKey, curve: 'secp256r1' })
    signer.updateHex(data)
    var signature = signer.sign()
    return rs.ECDSA.asn1SigToConcatSig(signature) // return a hex string
}

const verify = (data, signature, pubKey, hex = false) => {
    if (!hex) data = Buffer.from(data, 'utf8').toString('hex')
    const pubKeyObj = PublicKey.fromString(pubKey)

    const signer = new rs.KJUR.crypto.Signature({ alg: 'SHA256withECDSA' })
    signer.init({ xy: uncompress(pubKeyObj).toString('hex'), curve: 'secp256r1' })
    signer.updateHex(data)

    return signer.verify(rs.ECDSA.concatSigToASN1Sig(signature))
}

module.exports = {
    getMasterPublicKey,
    getSinglePrivateKey,
    getSinglePublicKey,
    getPublicKeyFromPrivateKey,
    generateSubPrivateKey,
    generateSubPublicKey,
    getIdChainMasterPublicKey,
    generateIdChainSubPrivateKey,
    generateIdChainSubPublicKey,
    sign,
    verify,
}
