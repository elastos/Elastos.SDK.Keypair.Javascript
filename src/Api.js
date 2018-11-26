const HDPrivateKey = require('./HDPrivateKey')
const HDPublicKey = require('./HDPublicKey')
const PrivateKey = require('./PrivateKey')
const ecdsa = require('./crypto/ecdsa')
const hash = require('./crypto/hash')
const { getSeedFromMnemonic } = require('./Mnemonic')
const { getAddress } = require('./Address')

const rs = require('jsrsasign')
const bigInt = require("big-integer")

const getMasterPublicKey = seed => {
    const prvKey = HDPrivateKey.fromSeed(seed)
    const parent = new HDPrivateKey(prvKey.xprivkey)

    const multiWallet = parent
        .deriveChild(44, true)
        .deriveChild(0, true)
        .deriveChild(0, true)

    return multiWallet.xpubkey
}

const getIdChainMasterPublicKey = seed => {
    const prvKey = HDPrivateKey.fromSeed(seed)
    const parent = new HDPrivateKey(prvKey.xprivkey)
    const idChain = parent.deriveChild(0, true)

    return idChain.publicKey
}

const testSeed =
    '5fd595530517ae121ee90ff09e48977c2c07b39a6b51d61148154cc8c4fb086c2ccb27b823cbb2735b886298dc12ccaf321055adee14c0dd4f803bbc53893af3'

// rst pubkey = '0296a25e91434a17b323bdb9c944c96479f07ba06342bf8370ef5f8769f32150b7'
const m = getIdChainMasterPublicKey(testSeed)
console.log(m.toString('hex'))

const getDidWallet = (seed, i) => {
    const prvKey = HDPrivateKey.fromSeed(seed)
    const parent = new HDPrivateKey(prvKey.xprivkey)

    const didWallet = parent
        .deriveChild(0, true)
        .deriveChild(0, false)
        .deriveChild(i, false)

    return didWallet
}

const generateIdChainSubPrivateKey = (seed, i) => getDidWallet(seed, i).privateKey
const generateIdChainSubPublicKey = (masterPublicKey, i) => getDidWallet(seed, i).publicKey

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

const sign = (data, prvKey) => {
    var signer = new rs.KJUR.crypto.Signature({alg: "SHA256withECDSA"});
    signer.init({d: prvKey, curve: "secp256r1"});
    signer.updateString(data);
    var signature = signer.sign();
    return rs.ECDSA.asn1SigToConcatSig(signature); // return a hex string
}

function pad_with_zeroes(number, length) {
    var retval = '' + number;
    while (retval.length < length) {
        retval = '0' + retval;
    }
    return retval;
}

const two = new bigInt(2),
// 115792089210356248762697446949407573530086143415290314195533631308867097853951
prime = two.pow(256).subtract( two.pow(224) ).add( two.pow(192) ).add( two.pow(96) ).subtract(1),
b = new bigInt( '41058363725152142129326129780047268409114441015993725554835256314039467401291' ),
// Pre-computed value, or literal
// 28948022302589062190674361737351893382521535853822578548883407827216774463488
pIdent = prime.add(1).divide(4);

/**
 * Point decompress NIST curve
 * @param {string} Compressed representation in hex string
 * @return {string} Uncompressed representation in hex string
 */
function ECPointDecompress( comp ) {
    var signY = new Number(comp[1]) - 2;
    var x = new bigInt(comp.substring(2), 16);
    // y^2 = x^3 - 3x + b
    var y = x.pow(3).subtract( x.multiply(3) ).add( b ).modPow( pIdent, prime );
    // If the parity doesn't match it's the *other* root
    if( y.mod(2).toJSNumber() !== signY ) {
        // y = prime - y
        y = prime.subtract( y );
    }
    return '04' + pad_with_zeroes(x.toString(16), 64) + pad_with_zeroes(y.toString(16), 64);
}

const verify = (data, signature, pubKey) => {
    var decompressedKey = ECPointDecompress(pubKey);
    var signer = new rs.KJUR.crypto.Signature({alg: "SHA256withECDSA"});
    signer.init({xy: decompressedKey, curve: "secp256r1"});
    signer.updateString(data);
    var verified = signer.verify(rs.ECDSA.concatSigToASN1Sig(signature));
    return verified; // return a boolean
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
