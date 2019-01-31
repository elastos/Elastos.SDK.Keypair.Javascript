const { getSeedFromMnemonic } = require('../src/Mnemonic')
const { getMultiSignAddress, getAddressFromPrivateKey, getAddress, getDid, getMultiSign } = require('../src/Address')
const Transaction = require('../src/Transaction')
const {
    getMasterPublicKey,
    getSinglePrivateKey,
    getSinglePublicKey,
    generateSubPrivateKey,
    generateSubPublicKey,
    getIdChainMasterPublicKey,
    generateIdChainSubPrivateKey,
    generateIdChainSubPublicKey,
    getPublicKeyFromPrivateKey,
    sign,
    verify,
} = require('../src/Api')

describe('getSeedFromMnemonic', function() {
    it('works with english', function() {
        const wordlist = 'obtain pill nest sample caution stone candy habit silk husband give net'
        const seed =
            'de7bc75b0c29b1f543d9ef884acc508a3daef9844ce3c69c450b2e10748276b99203e682ea806189b1f08d25be93e1728b98493574e16f35f38e30a68382d463'
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
            'de7bc75b0c29b1f543d9ef884acc508a3daef9844ce3c69c450b2e10748276b99203e682ea806189b1f08d25be93e1728b98493574e16f35f38e30a68382d463'
        const masterPublicKey =
            'xpub6D9hB6pdNw9VcM1vpR1Qz1ZNuxjmfK8mYnr87XkpBB87YRKTpbYMfyjEEsCCc6t8n2Yz2vQZdQk3tiyfbB3Hc2H2NgwMub96VKpJDVbj9CL'

        expect(getMasterPublicKey(seed)).toBe(masterPublicKey)
    })
})

describe('getSinglePrivateKey', function() {
    it('should generate a master extended public key', function() {
        const seed =
            'de7bc75b0c29b1f543d9ef884acc508a3daef9844ce3c69c450b2e10748276b99203e682ea806189b1f08d25be93e1728b98493574e16f35f38e30a68382d463'
        const privateKey = '1a25bf0687b7734ac943755b35fcc0339d26a89bfb68d93461194a72040441c6'

        expect(getSinglePrivateKey(seed).toString('hex')).toBe(privateKey)
    })
})

describe('getSinglePublicKey', function() {
    it('should generate a master extended public key', function() {
        const seed =
            'de7bc75b0c29b1f543d9ef884acc508a3daef9844ce3c69c450b2e10748276b99203e682ea806189b1f08d25be93e1728b98493574e16f35f38e30a68382d463'
        const publicKey = '03167e98a7cb23cc84a86b93dbdac56a264e938dde2cfbcb2b9ee1895b5ffbe57d'

        expect(getSinglePublicKey(seed).toString('hex')).toBe(publicKey)
    })
})

describe('getAddress', function() {
    it('should get valid address from a public key', function() {
        const publicKey = '03167e98a7cb23cc84a86b93dbdac56a264e938dde2cfbcb2b9ee1895b5ffbe57d'
        expect(getAddress(publicKey)).toBe('EMSAMkHMTfridY9ftkXn781RSFc37xydXK')
    })
})

describe('getAddressFromPrivateKey', function() {
    it('should get address from private key', function() {
        const seed =
            'de7bc75b0c29b1f543d9ef884acc508a3daef9844ce3c69c450b2e10748276b99203e682ea806189b1f08d25be93e1728b98493574e16f35f38e30a68382d463'
        const prvKey = '1a25bf0687b7734ac943755b35fcc0339d26a89bfb68d93461194a72040441c6'

        const pubKey = getSinglePublicKey(seed).toString('hex')
        expect(getAddressFromPrivateKey(prvKey)).toBe(getAddress(pubKey))
    })
})

describe('generateSubPrivateKey & generateSubPublicKey', function() {
    it('should work', function() {
        const seed =
            'de7bc75b0c29b1f543d9ef884acc508a3daef9844ce3c69c450b2e10748276b99203e682ea806189b1f08d25be93e1728b98493574e16f35f38e30a68382d463'
        const vectors = [
            {
                prvKey: '1a25bf0687b7734ac943755b35fcc0339d26a89bfb68d93461194a72040441c6',
                pubKey: '03167e98a7cb23cc84a86b93dbdac56a264e938dde2cfbcb2b9ee1895b5ffbe57d',
                address: 'EMSAMkHMTfridY9ftkXn781RSFc37xydXK',
            },
            {
                prvKey: '7c2e177fcdb1131fe85fc597e6116e0e0c7b0f2ed299d991946c935df567fe34',
                pubKey: '03d66e965ae63c1cc79981e9775dfeb78c9b17abde05d0c73397eeb5b04729bfac',
                address: 'EQjamGkeG76zMMEUzERha6J2Wtz8UXLr8j',
            },
            {
                prvKey: 'fc12cbf8266ab082bf588710f44121d2e97e85f66a6e667b5d929391954e62d4',
                pubKey: '02181c5998c70d2d66b3193bf7d7047f7897a57a5918b820ee5c22fc7e43e1cc0e',
                address: 'EchCmx9Wjz5ee8kq4tr5UgGwFc8jfdxzbo',
            },
            {
                prvKey: 'e678cca78175db8f345641f017b0ab0a0803ca5d4dae4ed45068d6aa34021981',
                pubKey: '03460c9b845cf8e337ff83cbf2c0f0c2257409c48f5822bf18c994304125c99d39',
                address: 'EaW9frWtEPv6JACXayFm94Bw9hTuSZPYRr',
            },
            {
                prvKey: '8b1b326e3150e25844def99d89136e975cf853366838a15fd24dce4e3444e139',
                pubKey: '0296cea0134507f4ca97d88e12dc50be28fe7f99de184b9ccb93e35ab52fdd52e2',
                address: 'ELnM8M5665UbERrw9CuKTJAeWr3BZ9qWtz',
            },
            {
                prvKey: 'd3fe1de1e3b2901836225904eb4489c591ad48d14e95bdc989ba54ce56525188',
                pubKey: '035d9b096c2be3cdc78147a578aa2c3af929652ef341f8758a1a4a382b134c4f11',
                address: 'ERNoDpkG3MpuUG41XniePUHdBVGihF3iAR',
            },
            {
                prvKey: 'c5a5ee7dad79a46cd3989978dc9482a7615888704534c7bf1bff90f601186d5e',
                pubKey: '02d8eee2e4330584f22c0d031dad18ee232bf727725e5a48f6bdefcb33fa1f2ad9',
                address: 'EQ5ZN1zmNLoqZbJzzahGXKng2PTS6dAeHh',
            },
            {
                prvKey: '9ea0dd63c4d79137ba67676eefe845c79388e02f90156fee20f53ca634981eaf',
                pubKey: '02ce538f9eecc6400f77eb96b2a6202ded3d07f0732fe68a387456ded55565903f',
                address: 'EfsGmHF1cf9YFB1W4QWavaUjycdpSQ2AhB',
            },
            {
                prvKey: 'de74dfe6edf8d6bc0a800f7ccda378fc26170588011fe736c2d771d02f422292',
                pubKey: '026e2623a9fc57a5a85a141c3530be06388b7c714f71f39d6cf3b58793dea1bad0',
                address: 'EV7KTa2KxydJcRL5yJPnGc2mjodGdHjTSN',
            },
            {
                prvKey: '611faad346ec7f0e20c2145dcf4635eabee3135d63765cc3eb0b30d9fbf13140',
                pubKey: '03ea642553bd7d18166ceeeea75c45c3b6071dd21a43f60c894a0b61414f866603',
                address: 'EQX3buSSYhYtfcJshScYvDgRVJZyCAJmax',
            },
        ]

        vectors.forEach(({ prvKey, pubKey, address }, i) => {
            expect(generateSubPrivateKey(seed, coinType = undefined, changeChain = undefined, index = i).toString('hex')).toBe(prvKey)
            expect(generateSubPublicKey(getMasterPublicKey(seed), coinType = undefined, index = i).toString('hex')).toBe(pubKey)
        })
    })
})

describe('did', function() {
    const seed =
        '6bb1807b90f9a4aef6e526784b5cb173455998772db58d58f6cf99d81ad53e9ffacfcce471937dae2194073ac1ea81bdd9b35a245860aa9471ae2e24059cca67'
    const didMasterPublicKey =
        '423bdad6d7e9e282596c449936257d5ca85f249925b6330cbe9e42735fcecb5206a02bf602462b3d2b426bdebdc82c5750fff81591bd1afa1252c0bf999d16ba'
    xit('generateIdChainMasterPublicKey', function() {
        const data = [
            {
                seed:
                    'be67ff091cf88dc74f7988463aa2607990d2e13638dd6b9863d39d2e27abe88e564e6ce82b200b0e3a03cf1169531499d02882ccd11534246f863be7a96a27c1',
                pubKey: '0296a25e91434a17b323bdb9c944c96479f07ba06342bf8370ef5f8769f32150b7',
            },
            {
                seed:
                    '5fd595530517ae121ee90ff09e48977c2c07b39a6b51d61148154cc8c4fb086c2ccb27b823cbb2735b886298dc12ccaf321055adee14c0dd4f803bbc53893af3',
                pubKey: '03c69709274fc92662144ad702d117d7e7131c236f8eb892dec685e76c94873a5c',
            },
            {
                seed:
                    'c42f919fd7147983a45b60947b6dca382006a3aef39143bb1a11255b8dccfca937d3414b52b7f7e9b5546c5d123ad2134bfd985de3a74f370045f1f52983ca05',
                pubKey: '020b3b468f511f387a1494aa360f67d17ef4aaab8e44e6c37d973ffaf3f59e1a9f',
            },
        ]
        for (let { seed, pubKey } of data) {
            expect(getIdChainMasterPublicKey(seed).publicKey).toBe(pubKey)
        }
    })

    it('generateIdChainSubPrivateKey', function() {
        const seed =
            '6bb1807b90f9a4aef6e526784b5cb173455998772db58d58f6cf99d81ad53e9ffacfcce471937dae2194073ac1ea81bdd9b35a245860aa9471ae2e24059cca67'
        expect(generateIdChainSubPrivateKey(seed, 0).toString()).toBe(
            '09a617f1b1245806783595e1d6689e57a8acf89cebe2c5883e79d9656cf0467e',
        )

        expect(generateIdChainSubPrivateKey(seed, 1).toString()).toBe(
            'aeeeb7b01afac7fa9a0499c9d7b73c4eb6f11d5424554c1f1c35c25891348400',
        )
    })

    it('getDid', function() {
        expect(getDid('03b72e5fd9cc42e29a30f093e57269dce61173c0507808d6861f6ddb8016b342e7')).toBe(
            'ibcDsUaFm49dK7BRXLDu4AcWun8VF9QwA9',
        )
        expect(getDid('02bc9ca50c7a4b470340818795e3d6d071bc4860b9cc3abe769bb114dddf1e4db1 ')).toBe(
            'ibHSeAhRHMXzVvAjYE2heSWgNJhn434kJD',
        )
    })
})

describe('getMutiSignAddress', function() {
    const pubKeys = [
        '02bc11aa5c35acda6f6f219b94742dd9a93c1d11c579f98f7e3da05ad910a48306',
        '031a9d45859da69dbc444723048932b8f56bb9937c5260238b4821a3b1ccfd78b6',
        '02746aa551414e16921a3249ddd5e49923299c97102c7e7c5b9c6e81dd3949556d',
    ]
    it('should work', function() {
        expect(getMultiSignAddress(pubKeys, 2)).toBe('8NJ7dbKsG2NRiBqdhY6LyKMiWp166cFBiG')
    })
})

describe('signAndVerify', function() {
    it('should be true', function() {
        const privateKey = '0eb7aa4fa4053475f6106f8914cbbb3883b7e96b344de12817a851a1beb63d9b'
        const publicKey = '0387603f569e848e4d23d949cc4b3b5e747a252a375fafad15d0d45e74d694a5d0'
        const message = 'hello'
        expect(verify(message, sign(message, privateKey), publicKey)).toBe(true)
    })
    it('should be true with leading 0', function() {
        const privateKey = '6a0827b159a58305b7891d039b14bac61de59145bd42b195152e6c0377d34d26'
        const publicKey = '020adf178b95000cb20a8a384c920b2e3eaf875ca7a23475c397816ab18be2567c'
        const message = 'hello'
        expect(verify(message, sign(message, privateKey), publicKey)).toBe(true)
    })
    it('should be true with hex message', function() {
        const privateKey = '6a0827b159a58305b7891d039b14bac61de59145bd42b195152e6c0377d34d26'
        const publicKey = '020adf178b95000cb20a8a384c920b2e3eaf875ca7a23475c397816ab18be2567c'
        const message = '020001910b74657374206120746573740172af965a1e095a6b659fc7c6eba16465403addaf9a92189e92e7645d4c61119201000000000002a3d0eaa466df74983b5d7c543de6904f4c9418ead5ffd6d25814234a96db37b0e8030000000000000000000021cdbf1cb9e63d691f6fd19af6fa2a4615495b195ab037db964a231458d2d6ffd5ea18944c4f90e63d547c5d3b9874df66a4ead0a354859a3b0000000000000000211221d5f34275cbf9a4d9bc4c57022c5dcd0a7e2a00000000'
        expect(verify(message, sign(message, privateKey, hex = true), publicKey, hex = true)).toBe(true)
    })
})

describe('verifyTransaction', function() {
    it('should be true', function() {
        const privateKey = '492f67d441f563aa4746497eb77c89906a3d3c06b242030ba966bc5604482ef7'
        const api_endpoint = 'https://api-wallet-ela-testnet.elastos.org'
        const from = 'EJonBz8U1gYnANjSafRF9EAJW9KTwRKd6x'
        const to = 'EbunxcqXie6UExs5SXDbFZxr788iGGvAs9'
        const amount = 1000
        var tx = new Transaction()
        tx.createTx(api_endpoint, from, to, amount)
        tx.generateRawTransaction(privateKey)
        var message = tx.serializeUnsigned().concat().toString('hex')
        var signedData = tx.Programs[0].parameter.slice(1).toString('hex')
        var publicKey = tx.Programs[0].code.slice(1,34).toString('hex')
        expect(verify(message, signedData, publicKey, hex = true)).toBe(true)
    })
    it('should be true with memo', function() {
        const privateKey = '492f67d441f563aa4746497eb77c89906a3d3c06b242030ba966bc5604482ef7'
        const api_endpoint = 'https://api-wallet-ela-testnet.elastos.org'
        const from = 'EJonBz8U1gYnANjSafRF9EAJW9KTwRKd6x'
        const to = 'EbunxcqXie6UExs5SXDbFZxr788iGGvAs9'
        const amount = 1000
        const memo = 'hello'
        var tx = new Transaction()
        tx.createTx(api_endpoint, from, to, amount, memo)
        tx.generateRawTransaction(privateKey)
        var message = tx.serializeUnsigned().concat().toString('hex')
        var signedData = tx.Programs[0].parameter.slice(1).toString('hex')
        var publicKey = tx.Programs[0].code.slice(1,34).toString('hex')
        expect(verify(message, signedData, publicKey, hex = true)).toBe(true)
    })
})
