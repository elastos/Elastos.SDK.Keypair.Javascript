'use strict';

const _ = require('lodash');

const { encoding } = require('bitcore-lib-p256')
const { BufferWriter } = encoding

const Usage = {
    Nonce: 0x00,
    Script: 0x20,
    Memo: 0x81,
    Description: 0x90,
    DescriptionUrl: 0x91,
    Confirmations: 0x92
};

function Attribute(memo) {
  if (!(this instanceof Attribute)) {
    return new Attribute(memo);
  }
  return this._init(memo);
}

Attribute.prototype._init = function(memo) {
  this.usage = (_.isString(memo) && memo.length > 0) ? Usage.Memo : Usage.Nonce;
  this.data = (_.isString(memo) && memo.length > 0)
    ? Buffer.from(memo)
    : Buffer.from((Math.floor(Math.random() * Math.floor(2147483647)).toString()));
  return this;
}

Attribute.prototype.toObject = Attribute.prototype.toJSON = function toObject() {
  var obj = {
    usage: this.usage,
    data: this.data.toString('hex'),
  };
  return obj;
};

Attribute.prototype.toBufferWriter = function(writer) {
  if (!writer) {
    writer = new BufferWriter();
  }
  writer.writeVarintNum(this.usage);
  writer.writeVarintNum(this.data.byteLength);
  writer.write(this.data);
  return writer;
};

module.exports = Attribute;
