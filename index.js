const { generateMnemonic, getSeedFromMnemonic } = require('./src/Mnemonic')
const { getMultiSignAddress, getAddress, getDid, getAddressByInfo, getDidByInfo, } = require('./src/Address')
const Transaction = require('./src/Transaction')
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
    getAddressByInfo,
    getDidByInfo,
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
    Transaction,
}
