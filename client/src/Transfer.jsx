import { useState } from "react";
import server from "./server";
import { sha256 } from "ethereum-cryptography/sha256";
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils";
import { secp256k1 as secp } from "ethereum-cryptography/secp256k1";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const dataToSend = {
      sender: address,
      amount: parseInt(sendAmount),
      recipient,
    };
    const PRIVATE_KEY =
      "643b7effbe48d491bab7dc3839d841ec1bdf7b2942357964dad2bb839726dcd1";
    // Convert the data to a string and hash it
    const dataString = JSON.stringify(dataToSend);
    const dataBytes = utf8ToBytes(dataString);
    const hash = sha256(dataBytes);
    console.log(`Hash of data to send: ${toHex(hash)}`);

    const signature = secp.sign(hash, PRIVATE_KEY);
    console.log("signed msg: ", signature);

    try {
      const response = await server.post(`send`, {
        ...dataToSend,
        signature: toHex(signature),
      });
      const { balance } = response.data;
      setBalance(balance);
      alert("Data sent successfully!");
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
