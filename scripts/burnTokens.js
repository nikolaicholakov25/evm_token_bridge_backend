const { ethers } = require("ethers");
const {
  ethBridge,
  bscBridge,
  ethToken,
  ADDRESS,
  ethProvider,
  BSC_CHAIN_ID,
  SEPOLIA_CHAIN_ID,
  bscProvider,
  bscToken,
  T0KEN_BASE,
  ethSigner,
  bscSigner,
} = require("./index");

async function burnTokens() {
  const CHAIN = "ETH";
  //   const CHAIN = "BSC";

  const wrappedTokenOnEth = "0x7c29d60d48baa02a9c430b07acc28084667f527e";
  const wrappedTokenOnBsc = "0x756b296ea9518068775df3bfee421e5d6951d2db";

  const isEthChain = CHAIN === "ETH";
  const sourceChain = isEthChain ? "ETH" : "BSC";

  const provider = isEthChain ? ethProvider : bscProvider;
  const bridge = isEthChain ? ethBridge : bscBridge;
  const signer = isEthChain ? ethSigner : bscSigner;

  const token = new ethers.Contract(
    isEthChain ? wrappedTokenOnEth : wrappedTokenOnBsc,
    T0KEN_BASE.abi,
    signer
  );

  const bridgeAddress = await bridge.getAddress();
  const tokenAddress = await token.getAddress();
  const tokenName = await token.name();
  const tokenDecimals = await token.decimals();

  const gasPriceApprove = await provider.getFeeData();
  const approveTx = await token.approve(
    bridgeAddress,
    ethers.parseUnits("20", tokenDecimals),
    {
      gasPrice: BigInt(Math.floor(Number(gasPriceApprove.gasPrice) * 2)),
    }
  );
  console.log(
    `Approve Transacation ${approveTx.hash} was sent on ${sourceChain}`
  );
  await provider.waitForTransaction(approveTx.hash);
  console.log(
    `Approved ${bridgeAddress} to spend 20 ${tokenName} from ${ADDRESS} on ${sourceChain}`
  );
  const bridgeFee = await bridge.fee();
  const feeData = await provider.getFeeData();
  const burnTx = await bridge.burn(
    ADDRESS,
    tokenAddress,
    ethers.parseUnits("20", tokenDecimals),
    {
      value: bridgeFee,
      gasPrice: BigInt(Math.floor(Number(feeData.gasPrice) * 2)),
    }
  );
  console.log(`Burn Transacation ${burnTx.hash} was sent on ${sourceChain}`);
}

burnTokens().catch(console.log);
