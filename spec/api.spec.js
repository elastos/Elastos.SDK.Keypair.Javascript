const { getSeedFromMnemonic } = require('../src/Mnemonic')
const { getMultiSignAddress, getAddressFromPrivateKey, getAddress, getDid, getMultiSign } = require('../src/Address')
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

describe('getAddressFromPrivateKey', function() {
    it('should get address from private key', function() {
        const seed =
            '466cf12d6ee119bf15e26be50e4b3624d46457bf1051f2c0c1b61b4fb921a5b65cc54714ea8e9aa51c22ca2eb89913fb8dab5676c778516ca1a04a47693d8bef'
        const prvKey = 'f1f64a2472653087ebdaf4849b99809b4637d28381dd910a5fe94ca6b2ebe9ba'

        const pubKey = getSinglePublicKey(seed).toString('hex')
        expect(getAddressFromPrivateKey(prvKey)).toBe(getAddress(pubKey))
    })
})

describe('generateSubPrivateKey & generateSubPublicKey', function() {
    it('should work', function() {
        const seed =
            '466cf12d6ee119bf15e26be50e4b3624d46457bf1051f2c0c1b61b4fb921a5b65cc54714ea8e9aa51c22ca2eb89913fb8dab5676c778516ca1a04a47693d8bef'
        const vectors = [
            {
                prvKey: 'b50b31f1068b31ce2c5c29828b78c5420813750e3cd7bf5184284025e0000a59',
                pubKey: '030f1ee41fe75591852c644ddb97b51dbff6d407cf39b402f19f3fb5932f1f26b1',
                address: 'Ed9KxcwsL43f9r8y8x913wWn8StHXwJnCN',
            },
            {
                prvKey: '4061009549f38d258e543e16e1159d1da010b5c351b12014fb1325a900c62491',
                pubKey: '03384a6832de3e2cd020d1f96b37d356c7b65d153d664c484ae41194a3cf9e4401',
                address: 'EbQyigzDXiFjc2rynGuzCmu77kYhaneJme',
            },
            {
                prvKey: '93862a94342ce0052cd8052a9734f7dbd6ab5c311a31f7712852110ee85cbffe',
                pubKey: '021fa413906a018e2125fb5f638f60cdc9e15159ee80d7167f2da464c6a118e22a',
                address: 'EgD6M62juhHccBf6ecaqXriZ5LvMHGJpek',
            },
            {
                prvKey: 'e6a54f367325c854d7ecc10fd2672c7468eb02dee32e62fa936a65771b4cf06d',
                pubKey: '03e3b4afa3727be6ca2da0086e209812d3c78c86ab3a5b3a7346d34f80426ebd22',
                address: 'EKSd6srY98fuSSKsbpktrcdPhEurJu74Z5',
            },
            {
                prvKey: 'f71ae54cdf32040a80f45e1156eddd5c66e45c2414cc2b2943b8bf20a747cd4b',
                pubKey: '026833413e414ee781da737c2dafec489a3ecb884932b0adb7e08e397126f5b878',
                address: 'EMpL9iwNopTpVCzruXM2nr6exeha2VcbJK',
            },
            {
                prvKey: '29c8dfc95a5abd4e0d9bec3355caec3296da4f8024639b5dc38ffd617bec0963',
                pubKey: '025e366d1c53c6317c34b03d59713d3780c8bf478bcd3948edaa8dde0428cef82c',
                address: 'EYPSjaBBC5YEDTszmqsuCeaLfdZ5TyuRzX',
            },
            {
                prvKey: 'ceb5641ab1f1dd1afd2d28037efae72d9c99bca8e6c8096bf1c4828089e8f804',
                pubKey: '02e78ab07d70f5ba56f6568c0cc5c78c203d09de564e465eb058d12bcefd7893a7',
                address: 'EVho83TLPhDkSMadL2yzPT8zBeR4Jss5Bd',
            },
            {
                prvKey: '8434b3553af78023650c74f8fddd3524d925956c32c737e1970ef7d017d3bd5b',
                pubKey: '0354ac72eca391a4a3da72f134e5a0f00b3228d2cf17ff6d22978debe3953eccab',
                address: 'ENZf4MMQcsoV9W17p7XsuA6BwvmKek1K35',
            },
            {
                prvKey: '8760d69f5ed341ddc951f7d44c242f2f355b63ca9415cbff5082efa2bd48530d',
                pubKey: '03a5dacce2aa9d56648d5affebe08a05e33f5d26412db3b46b1d624745efb3bdcb',
                address: 'Eg9AQoDxRcUYh36tj17gNQxQBKKMgVq6p5',
            },
            {
                prvKey: 'f694cac42de1c954997862518ec198bfdfcc7b59c8c4445a527f07720b74eb0f',
                pubKey: '03dca23cd1a5b6f3f2149330582c403d3b4838295012145552eec0277d32a99658',
                address: 'EdAfFofHBFXXsgQoSs1S28r86N37jgNXze',
            },
        ]

        vectors.forEach(({ prvKey, pubKey, address }, i) => {
            expect(generateSubPrivateKey(seed, i).toString('hex')).toBe(prvKey)
            expect(generateSubPublicKey(seed, i).toString('hex')).toBe(pubKey)
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
})
