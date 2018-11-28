const { generateMnemonic, getSeedFromMnemonic } = require('./src/Mnemonic')
const { getMultiSignAddress, getAddress, getDid } = require('./src/Address')
const {
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
} = require('./src/Api')

module.exports = {
    generateMnemonic,
    getSeedFromMnemonic,
    getMultiSignAddress,
    getAddress,
    getDid,
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
