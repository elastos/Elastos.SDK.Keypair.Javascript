const { getSeedFromMnemonic } = require('./src/Mnemonic')
const { getMultiSignAddress, getAddress, getDid, getMultiSign } = require('./src/Address')
const {
    getMasterPublicKey,
    getSinglePrivateKey,
    getSinglePublicKey,
    generateSubPrivateKey,
    generateSubPublicKey,
    getIdChainMasterPublicKey,
    generateIdChainSubPrivateKey,
    generateIdChainSubPublicKey,
    sign,
    verify,
} = require('./src/Api')

module.exports = {
    getSeedFromMnemonic,
    getMultiSignAddress,
    getAddress,
    getDid,
    getMultiSign,
    getMasterPublicKey,
    getSinglePrivateKey,
    getSinglePublicKey,
    generateSubPrivateKey,
    generateSubPublicKey,
    getIdChainMasterPublicKey,
    generateIdChainSubPrivateKey,
    generateIdChainSubPublicKey,
    sign,
    verify,
}
