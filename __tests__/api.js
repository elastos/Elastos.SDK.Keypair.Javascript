const { getSeedFromMnemonic } = require('../src/Mnemonic')
const { getAddress } = require('../src/Address')
const { getMasterPublicKey, getSinglePrivateKey, getSinglePublicKey } = require('../src/Api')

describe('getSeedFromMnemonic', function() {
    it('works with english', function() {
        const wordlist = 'carbon isolate core citizen ignore admit grant cannon toe address stuff chest fly siege wing'
        const seed =
            'a65f0804f89ec98189bc37df9e178317cde9566f2f954bc92285c33cf814fe1dd49c815f78ff6c0f8733a548706c3e157f7c8c013bc297e2ac4a788c6ab99f87'
        expect(getSeedFromMnemonic(wordlist).toString('hex')).toBe(seed)
    })
    it('works with chinese', function() {
        const wordlist = '海 岁 音 达 垂 出 善 治 弓 地 辞 花 苦 籍 酱'
        const seed =
            '92300305ca623bcbd09ba73fc6e29c92b060c82f42d52c8374653bfdd25adb7941bf5f9f76949e33bbb67d11173903ec96f46cd45fc35ce4be807c070765aaac'
        expect(getSeedFromMnemonic(wordlist).toString('hex')).toBe(seed)
    })
    it('works when protected with a passphrase', function() {
        const wordlist = 'carbon isolate core citizen ignore admit grant cannon toe address stuff chest fly siege wing'
        const passphrase = '1234'
        const seed =
            'cfb0c98f568b2de1a2752fe47fe0342da60f9c1bcd9af2e36a48422c232b917f95ae080554231408ac83bf53f61e377b3b31517e2b82dfc6926b19d9863e0c01'
        expect(getSeedFromMnemonic(wordlist, passphrase).toString('hex')).toBe(seed)
    })
})

describe('getMasterPublicKey', function() {
    it('should generate a master extended public key', function() {
        const seed =
            '466cf12d6ee119bf15e26be50e4b3624d46457bf1051f2c0c1b61b4fb921a5b65cc54714ea8e9aa51c22ca2eb89913fb8dab5676c778516ca1a04a47693d8bef'
        const masterPublicKey =
            'xpub6CXfUrz3N8N7CUygs4gSjbygC2NC1yi6gVPnTCRYJSNArh3nEeqbr7h1u7Q91tgzZmVpUt7SY5cJxJeL3Q69fR7GrJUTLQQ7rFY9sveEQ2a'

        expect(getMasterPublicKey(seed)).toBe(masterPublicKey)
    })
})

describe('getSinglePrivateKey', function() {
    it('should generate a master extended public key', function() {
        const seed =
            '466cf12d6ee119bf15e26be50e4b3624d46457bf1051f2c0c1b61b4fb921a5b65cc54714ea8e9aa51c22ca2eb89913fb8dab5676c778516ca1a04a47693d8bef'
        const privateKey = 'f1f64a2472653087ebdaf4849b99809b4637d28381dd910a5fe94ca6b2ebe9ba'

        expect(getSinglePrivateKey(seed).toString('hex')).toBe(privateKey)
    })
})

describe('getSinglePublicKey', function() {
    it('should generate a master extended public key', function() {
        const seed =
            '466cf12d6ee119bf15e26be50e4b3624d46457bf1051f2c0c1b61b4fb921a5b65cc54714ea8e9aa51c22ca2eb89913fb8dab5676c778516ca1a04a47693d8bef'
        const publicKey = '0215fd6783fb8a9d8819ac68e62f20dee0d9ab58123ed532e3d4308066bf8fff2e'

        expect(getSinglePublicKey(seed).toString('hex')).toBe(publicKey)
    })
})

describe('getAddress', function() {
    it('should get valid address from a public key', function() {
        const publicKey = '0215fd6783fb8a9d8819ac68e62f20dee0d9ab58123ed532e3d4308066bf8fff2e'
        expect(getAddress(publicKey)).toBe('EKc8u9BZFUwKZnsfjPT2zNNTTQbFymYsLY')
    })
})
