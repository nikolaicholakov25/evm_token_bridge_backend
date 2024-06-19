const { ethers } = require("ethers");
const {
  ethBridge,
  bscBridge,
  ethToken,
  ADDRESS,
  ethProvider,
  bscProvider,
  bscToken,
} = require("./index");

async function lockTokens() {
  const CHAIN = "ETH";
  //   const CHAIN = "BSC";

  const isEthChain = CHAIN === "ETH";
  const sourceChain = isEthChain ? "ETH" : "BSC";

  const token = isEthChain ? ethToken : bscToken;
  const provider = isEthChain ? ethProvider : bscProvider;
  const bridge = isEthChain ? ethBridge : bscBridge;

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
  const lockTx = await bridge.lock(
    ADDRESS,
    tokenAddress,
    ethers.parseUnits("20", tokenDecimals),
    {
      value: bridgeFee,
      gasPrice: BigInt(Math.floor(Number(feeData.gasPrice) * 2)),
    }
  );
  console.log(`Lock Transacation ${lockTx.hash} was sent on ${sourceChain}`);
}

lockTokens().catch(console.log);
