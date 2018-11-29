import React from "react";
import ReactDOM from "react-dom";
import Elastos from "elastos-wallet-js";

function getAddress() {
  var mnem = Elastos.generateMnemonic();
  var seed = Elastos.getSeedFromMnemonic(mnem);
  var privateKey = Elastos.getSinglePrivateKey();
  var publicKey = Elastos.getSinglePublicKey();
  return Elastos.getAddress(publicKey.toString('hex'));
}

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <div>Your ELA wallet is created, wallet address is:</div>
        <div>{getAddress()}</div>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
