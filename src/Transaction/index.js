'use strict';

const _ = require('lodash')
const { encoding, PrivateKey, crypto } = require('bitcore-lib-p256')
const { toCode } = require('../Address')
const { sign } = require('../Api')

const Attribute = require('./attribute')
const Input = require('./input')
const Output = require('./output')
const Program = require('./program')

const { BufferWriter } = encoding

const request = require('sync-request')
const { BN } = crypto

const Type = {
        CoinBase                : 0x00,
        RegisterAsset           : 0x01,
        TransferAsset           : 0x02,
        Record                  : 0x03,
        Deploy                  : 0x04,
        SideMining              : 0x05,
        IssueToken              : 0x06,
        WithdrawAsset           : 0x07,
        TransferCrossChainAsset : 0x08,
        RegisterIdentification  : 0x09,
};

const TxVersion = {
    TxVersionDefault:   0x00,
    TxVersion09:        0x09,
};

const DEFAULT_TYPE = Type.TransferAsset;
const PAYLOAD_VERSION = 0;
const DEFAULT_NLOCKTIME = 0;

/**
 * Represents a transaction, a set of inputs and outputs to change ownership of tokens
 *
 * @constructor
 */
function Transaction() {
  if (!(this instanceof Transaction)) {
    return new Transaction();
  }
  this.TxVersion = TxVersion.TxVersionDefault;
  this.Type = DEFAULT_TYPE;
  this.PayloadVer = PAYLOAD_VERSION;
  this.LockTime = DEFAULT_NLOCKTIME;
  this.Attributes = [];
  this.UTXOInputs = [];
  this.Outputs = [];
  this.Payload = [];
  this.Programs = [];
  this.Amount = undefined;
  this.Memo = undefined;
  this.Fee = undefined;
  this.json = undefined;
  this.rawTx = undefined;
  this.LockedAddress = undefined;
}

Transaction.prototype.getMemo = function() {
  return this.Memo
}

Transaction.prototype.setMemo = function(memo) {
  this.Memo = memo
}

//createTx('https://api-wallet-ela-testnet.elastos.org', 'EJonBz8U1gYnANjSafRF9EAJW9KTwRKd6x', 'EbunxcqXie6UExs5SXDbFZxr788iGGvAs9', 1000)
Transaction.prototype.createTx = function(api_endpoint, input, output, amount, memo = undefined, crossChainTransfer = false, lockedAddress= "") {
    if(crossChainTransfer) {
        if(lockedAddress === "") {
            throw new Error("LockedAddress can not be empty")
        }
        this.Type = Type.TransferCrossChainAsset;
        this.TxVersion = TxVersion.TxVersion09;
        this.LockedAddress = lockedAddress;
    }
    var tx = {
        inputs: [input],
        outputs: [{ addr: output, amt: amount }]
    }
    this.Amount = amount

    if (memo && memo.length > 0) this.setMemo(memo)
    this.Attributes.push(new Attribute(this.Memo))

    var res = request('POST', api_endpoint + '/api/1/createTx', { json: tx, timeout: 10000 })
    var result = JSON.parse(res.getBody('utf8')).result
    this.json = result
    this.getRawObject()
}

Transaction.prototype.getRawObject = function(rawJson) {
    if (rawJson) this.json = rawJson

    var inputs = [];
    this.json.Transactions[0].UTXOInputs.forEach(function(input) { inputs.push(new Input(input)) })
    this.UTXOInputs = inputs;
    var outputs = [];
    let payload = [];
    let outputTotalAmount = 0;
    let Outputs = this.json.Transactions[0].Outputs;
    for(let x = 0; x < Outputs.length; x++) {
        if(this.Type === Type.TransferCrossChainAsset){
            if(x < Outputs.length - 1) {
                let realPayAmount = Outputs[x].amount - 10001
                outputTotalAmount += Outputs[x].amount;
                payload.push({address: Outputs[x].address, amount: realPayAmount, outputIndex: x})
                continue;
            }
        }
        outputs.push(new Output({address: Outputs[x].address, amount: Outputs[x].amount - 10001}));
    }
    if(this.Type === Type.TransferCrossChainAsset) {
        outputs.unshift(new Output({address: this.LockedAddress, amount: outputTotalAmount}));
    }
    this.Payload = payload;
    this.Outputs = outputs;
}

Transaction.prototype.generateRawTransaction = function(privateKeys) {
    let dataWriter = this.serializeUnsigned(undefined, this.TxVersion);
    var programs = []
    privateKeys.forEach(function(privateKey) {
        let dataSigned = sign(dataWriter.concat().toString('hex'), privateKey, true)
        programs.push(new Program(
            {
                code: toCode(Buffer.from(PrivateKey.fromBuffer(privateKey).publicKey.toString(), 'hex'), 0xac),
                parameter: Buffer.from((dataSigned.length / 2).toString(16) + dataSigned, 'hex')
            }
        ))
    })
    this.Programs = programs

    dataWriter.writeVarintNum(this.Programs.length)
    _.each(this.Programs, function(program) {
        program.toBufferWriter(dataWriter)
    })

    this.rawTx = dataWriter.concat().toString('hex')

    return this.rawTx
}

Transaction.prototype.serializeUnsigned = function(writer, txVersion) {
    if (!writer) {
        writer = new BufferWriter();
    }

    if(this.TxVersion >= TxVersion.TxVersion09) {
        writer.writeVarintNum(this.TxVersion)
    }

    writer.writeVarintNum(this.Type)
    writer.writeVarintNum(this.PayloadVer)

    if(this.Type === Type.TransferCrossChainAsset) {
        if(this.Payload.length === 0) {
            throw new Error("Invalid Crosschain transfer payload data")
        }
        writer.writeVarintNum(this.Payload.length)
        _.each(this.Payload, function(payLoadItem) {
            writer.writeVarintNum(Buffer(payLoadItem.address).length);
            writer.write(Buffer(payLoadItem.address));
            writer.writeVarintNum(payLoadItem.outputIndex)
            writer.writeUInt64LEBN(BN.fromString(payLoadItem.amount.toString()));
        })
    }

    writer.writeVarintNum(this.Attributes.length)
    _.each(this.Attributes, function(attribute) {
        attribute.toBufferWriter(writer)
    })

    writer.writeVarintNum(this.UTXOInputs.length)
    _.each(this.UTXOInputs, function(input) {
        input.toBufferWriter(writer)
    })

    writer.writeVarintNum(this.Outputs.length)
    _.each(this.Outputs, function(output) {
        output.toBufferWriter(writer, txVersion)
    })

    writer.writeUInt32LE(this.LockTime)
    return writer;
}

Transaction.prototype.sendRawTx = function(api_endpoint) {
    var rawTx = { data: this.rawTx }
    var res = request('POST', api_endpoint + '/api/1/sendRawTx', { json: rawTx, timeout: 10000 })
    var txHash = JSON.parse(res.getBody('utf8')).result
    return txHash
}

module.exports = Transaction;
