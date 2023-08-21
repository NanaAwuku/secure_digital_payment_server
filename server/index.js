const fs = require('fs')
const path = require( 'path')

const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;


app.use(cors());
app.use(express.json());

const filePath = path.join(__dirname, '..', 'records.json'); // The file path in the directory above the current directory
const fsLines = fs.readFileSync(filePath, 'utf8')
const balances = JSON.parse(fsLines)

const getOwnerBalance = (owner) => {
  const record = balances.find((record) => record.wallet === owner)
  return record.balance
}

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = getOwnerBalance(address) || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;
console.log(recipient, amount)
  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
