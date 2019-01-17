'use strict';

const _ = require('lodash');

const { encoding } = require('bitcore-lib-p256')
const { BufferWriter } = encoding

function Program(params) {
  if (!(this instanceof Program)) {
    return new Program(params);
  }
  return this._init(params);
}

Program.prototype._init = function(params) {
  this.parameter = params.parameter
  this.code = params.code
  return this;
}

Program.prototype.toObject = Program.prototype.toJSON = function toObject() {
  var obj = {
    parameter: this.parameter.toString('hex'),
    code: this.code.toString('hex'),
  };
  return obj;
};

Program.prototype.toBufferWriter = function(writer) {
  if (!writer) {
    writer = new BufferWriter();
  }
  writer.writeVarintNum(this.parameter.byteLength);
  writer.write(this.parameter);
  writer.writeVarintNum(this.code.byteLength);
  writer.write(this.code);
  return writer;
};

module.exports = Program;
