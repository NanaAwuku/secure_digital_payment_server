const {secp256k1: secp} = require( "ethereum-cryptography/secp256k1")
const { keccak256 } = require( "ethereum-cryptography/keccak")
const { toHex } = require("ethereum-cryptography/utils")
const fs = require( 'fs')
const path = require( 'path')

function getAddress(publicKey) {
    const newPubKey = publicKey.slice(1)
    const hash = toHex(keccak256(newPubKey))
    return hash.slice(-20)
  }

const getNewWallet = () => {
    const pik = secp.utils.randomPrivateKey();
    const addr = getAddress(secp.getPublicKey(pik));

    const record = {
      "wallet": addr, 
      "pik": toHex(pik),
      "balance": 200
    }

    const filePath = path.join(__dirname, '..', 'records.json'); // The file path in the directory above the current directory
    let records = [];
    fs.readFile(filePath, (err, data) => { // get the data from the file
        if(data != ''){
            records = JSON.parse(data);
        }
        records.push(record);
        fs.writeFile(filePath, JSON.stringify(records), (err) => {
            console.log(err);
        });            
    });
  }

 getNewWallet()