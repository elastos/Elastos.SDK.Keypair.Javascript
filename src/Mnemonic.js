const bip39 = require('bip39')
const randombytes = require('randombytes')

const generateMnemonic = (lang = 'en', wordlist = []) => {
    const wordListMap = {
        en: bip39.wordlists.english,
        cn: bip39.wordlists.chinese_simplified,
        fr: bip39.wordlists.french,
        it: bip39.wordlists.italian,
        jp: bip39.wordlists.japanese,
        sp: bip39.wordlists.spanish,
    }

    return bip39.generateMnemonic(128, randombytes, wordlist.length > 0 ? wordlist : wordListMap[lang])
}

const getSeedFromMnemonic = (mnemonic, password = '') => bip39.mnemonicToSeed(mnemonic, password)

module.exports = {
    generateMnemonic,
    getSeedFromMnemonic,
}
