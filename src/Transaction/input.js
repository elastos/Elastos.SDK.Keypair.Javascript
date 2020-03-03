'use strict';

const _ = require('lodash');

const { encoding } = require('bitcore-lib-curve')
const { BufferWriter } = encoding

const MAXINT = 0xffffffff; // Math.pow(2, 32) - 1;
const DEFAULT_SEQNUMBER = 0;
const DEFAULT_LOCKTIME_SEQNUMBER = MAXINT - 1;

function Input(params) {
  if (!(this instanceof Input)) {
    return new Input(params);
  }
  if (params) {
    return this._fromObject(params);
  }
}

Input.MAXINT = MAXINT;
Input.DEFAULT_SEQNUMBER = DEFAULT_SEQNUMBER;
Input.DEFAULT_LOCKTIME_SEQNUMBER = DEFAULT_LOCKTIME_SEQNUMBER;

Input.fromObject = function(obj) {
  var input = new Input();
  return input._fromObject(obj);
};

Input.prototype._fromObject = function(params) {
  var txid;
  if (_.isString(params.txid)) {
    txid = Buffer.from(params.txid, 'hex');
  } else {
    txid = params.txid;
  }
  var privateKey;
  if (_.isString(params.privateKey)) {
    privateKey = Buffer.from(params.privateKey, 'hex');
  } else {
    privateKey = params.privateKey;
  }
  this.address = params.address;
  this.txid = txid;
  this.privateKey = privateKey;
  this.index = _.isUndefined(params.index) ? 0 : params.index;
  this.sequence = _.isUndefined(params.sequence) ? DEFAULT_SEQNUMBER : params.sequence;
  return this;
};

Input.prototype.toObject = Input.prototype.toJSON = function toObject() {
  var obj = {
    address: this.address,
    txid: this.txid.toString('hex'),
    //privateKey: this.privateKey.toString('hex'),
    index: this.index,
    sequence: this.sequence,
  };
  return obj;
};

Input.prototype.toBufferWriter = function(writer) {
  if (!writer) {
    writer = new BufferWriter();
  }
  writer.writeReverse(this.txid);
  writer.writeUInt16LE(this.index);
  writer.writeUInt32LE(this.sequence);
  return writer;
};

module.exports = Input;
