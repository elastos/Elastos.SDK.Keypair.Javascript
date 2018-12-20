const { getAddressFromPrivateKey } = require('../Address')
const UtxoTxInput = require('./UtxoTxInput')
const tx = {
    Transactions: [
        {
            UTXOInputs: [
                {
                    txid: '61c22a83bb96d958f473148fa64f3b2be02653c66ede506e83b82e522200d446',
                    index: 0,
                    privateKey: '5FA927E5664E563F019F50DCD4D7E2D9404F2D5D49E31F9482912E23D6D7B9EB',
                },
                {
                    txid: 'a91b63ba6ffdb13379451895c51abd25c54678bc89268db6e6c3dcbb7bb07062',
                    index: 0,
                    privateKey: 'A65E9FB6735C5FD33F839036B15D2DA373E15AED38054B69386E322C6BE52994',
                },
            ],
            Outputs: [
                {
                    address: 'ERz34iKa4nGaGYVtVpRWQZnbavJEe6PRDt',
                    amount: 200,
                },
                {
                    address: 'EKjeZEmLSXyyJ42xxjJP4QsKJYWwEXabuC',
                    amount: 240,
                },
            ],
        },
    ],
}
const parseUxtoInputs = uxtoInputs => {
    const processed = []
    for (const { txid, index, privateKey } of uxtoInputs) {
        processed.push(new UtxoTxInput(txid, index, privateKey))
    }
    return processed
}

// genRawTransaction
const genRawTransaction = raw => {
    const { Transactions: transactions } = raw
    const [transaction] = transactions
    const { UTXOInputs: utxoInputs, Outputs: outputs, Memo: memo } = transaction

    // parse uxtoInputs
    const utxoTxInputs = parseUxtoInputs(utxoInputs)
    console.log('ff', utxoTxInputs.map(String))

    // parse outputs

    // handle memo
    const hasMemo = Boolean(memo)
    console.assert(hasMemo === false, 'should have memo')

    return {
        rawTx: '',
        txHash: '',
    }
}

genRawTransaction(tx)
