const { ethers } = require("ethers");
const {
  ethToken,
  bscToken,
  ethProvider,
  bscProvider,
  ADDRESS,
} = require("./index");

async function run() {
  try {
    const ethTokenName = await ethToken.name();
    const ethTokenDecimals = await ethToken.decimals();
    const gasPrice = await ethProvider.getFeeData();
    const ethTokenMintTx = await ethToken.mint(
      ADDRESS,
      ethers.parseUnits("300", ethTokenDecimals)
    );
    const ethTxReceipt = await ethProvider.waitForTransaction(
      ethTokenMintTx.hash
    );
    console.log(
      `Minted 300 ${ethTokenName} to ${ADDRESS} on Sepolia\nGas used: ${Number(
        ethTxReceipt.gasUsed
      )}\nGas price: ${Number(ethTxReceipt.gasPrice)}`
    );
    const bscTokenName = await bscToken.name();
    const bscTokenDecimals = await bscToken.decimals();
    const bscTokenMintTx = await bscToken.mint(
      ADDRESS,
      ethers.parseUnits("300", bscTokenDecimals)
    );
    const bscTxReceipt = await bscProvider.waitForTransaction(
      bscTokenMintTx.hash
    );
    console.log(
      `Minted 300 ${bscTokenName} to ${ADDRESS} on BSC Testnet\nGas used: ${Number(
        bscTxReceipt.gasUsed
      )}\nGas price: ${Number(bscTxReceipt.gasPrice)}`
    );
  } catch (err) {
    console.error(err);
  }
}

run().catch(console.log);
