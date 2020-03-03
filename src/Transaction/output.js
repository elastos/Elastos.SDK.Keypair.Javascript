'use strict';

const _ = require('lodash');
const { reverseByteBuffer } = require('../Utils')
const { crypto, encoding } = require('bitcore-lib-curve')
const { Base58Check, BufferWriter } = encoding
const { BN } = crypto

const DEFAULT_OUTPUT_LOCK = 0;
const DESTROY_ADDRESS = '0000000000000000000000000000000000';

function Output(params) {
  if (!(this instanceof Output)) {
    return new Output(params);
  }
  if (params) {
    return this._fromObject(params);
  }
}

Output.DEFAULT_OUTPUT_LOCK = DEFAULT_OUTPUT_LOCK;
Output.DESTROY_ADDRESS = DESTROY_ADDRESS;

Output.fromObject = function(obj) {
  var output = new Output();
  return output._fromObject(obj);
};

Output.prototype._fromObject = function(params) {
  var assetId;
  if (_.isUndefined(params.AssetId)) {
    assetId = reverseByteBuffer(Buffer('a3d0eaa466df74983b5d7c543de6904f4c9418ead5ffd6d25814234a96db37b0', 'hex'));
  } else {
    assetId = reverseByteBuffer(Buffer(params.AssetId, 'hex'));
  }
  this.AssetId = assetId;
  this.amount = _.isUndefined(params.amount) ? 0 : params.amount;
  this.OutputLock = _.isUndefined(params.OutputLock) ? 0 : params.OutputLock;
  this.address = _.isUndefined(params.address) ? DESTROY_ADDRESS : params.address;
  this.ProgramHash = (this.address === DESTROY_ADDRESS) ? 0 : Base58Check.decode(this.address);
  return this;
};

Output.prototype.toObject = Output.prototype.toJSON = function toObject() {
  var obj = {
    address: this.address,
    amount: this.amount,
    OutputLock: this.OutputLock,
    AssetId: reverseByteBuffer(this.AssetId).toString('hex'),
  };
  return obj;
};

Output.prototype.toBufferWriter = function(writer) {
  if (!writer) {
    writer = new BufferWriter();
  }
  writer.write(this.AssetId);
  writer.writeUInt64LEBN(BN.fromString(this.amount.toString()));
  writer.writeUInt32LE(this.OutputLock);
  writer.write(this.ProgramHash);
  return writer;
};

module.exports = Output;
