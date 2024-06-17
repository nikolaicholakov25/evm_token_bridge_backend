const { ethers } = require("ethers");
const { ethToken, bscToken, ethProvider, bscProvider } = require("./index");

const { ADDRESS } = process.env;

async function run() {
  try {
    const ethTokenName = await ethToken.name();
    const ethTokenMintTx = await ethToken.mint(ADDRESS, 100);
    const ethTxReceipt = await ethProvider.waitForTransaction(
      ethTokenMintTx.hash
    );
    console.log(
      `Minted 100 ${ethTokenName} to ${ADDRESS} on Sepolia\nGas used: ${Number(
        ethTxReceipt.gasUsed
      )}\nGas price: ${Number(ethTxReceipt.gasPrice)}`
    );
    const bscTokenName = await bscToken.name();
    const bscTokenMintTx = await bscToken.mint(ADDRESS, 100);
    const bscTxReceipt = await bscProvider.waitForTransaction(
      bscTokenMintTx.hash
    );
    console.log(
      `Minted 100 ${bscTokenName} to ${ADDRESS} on BSC Testnet\nGas used: ${Number(
        bscTxReceipt.gasUsed
      )}\nGas price: ${Number(bscTxReceipt.gasPrice)}`
    );
  } catch (err) {
    console.error(err);
  }
}

run().catch(console.log);
