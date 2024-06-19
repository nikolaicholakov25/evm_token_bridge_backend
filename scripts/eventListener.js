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

ethBridge.on("TokenLocked", async (from, erc20token, ammount) => {
  await tokenLockedHandler(from, erc20token, ammount, "bsc");
});
bscBridge.on("TokenLocked", async (from, erc20token, ammount) => {
  await tokenLockedHandler(from, erc20token, ammount, "eth");
});

ethBridge.on("TokenBurned", async (from, erc20token, ammount) => {
  await tokenBurnedHandler(from, erc20token, ammount, "bsc");
});
bscBridge.on("TokenBurned", async (from, erc20token, ammount) => {
  await tokenBurnedHandler(from, erc20token, ammount, "eth");
});

ethBridge.on("TokenMinted", async (to, erc20token, ammount) => {
  await tokenMintedHandler(to, erc20token, ammount, "eth");
});
bscBridge.on("TokenMinted", async (to, erc20token, ammount) => {
  await tokenMintedHandler(to, erc20token, ammount, "bsc");
});

ethBridge.on("TokenReleased", async (to, erc20token, ammount) => {
  await tokenReleasedHandler(to, erc20token, ammount, "eth");
});
bscBridge.on("TokenReleased", async (to, erc20token, ammount) => {
  await tokenReleasedHandler(to, erc20token, ammount, "bsc");
});

async function tokenLockedHandler(from, erc20token, ammount, targetBridge) {
  try {
    const isEthChain = targetBridge === "eth";
    const sourceChain = isEthChain ? "BSC" : "ETH";
    const targetChain = isEthChain ? "ETH" : "BSC";
    const bridge = isEthChain ? ethBridge : bscBridge;
    const provider = isEthChain ? ethProvider : bscProvider;
    const gasPrice = await provider.getFeeData();

    const nativeToken = isEthChain ? bscToken : ethToken;
    const nativeTokenName = await nativeToken.name();
    const nativeTokenSymbol = await nativeToken.symbol();

    console.log(
      `Locked ${ethers.formatUnits(
        ammount,
        BigInt(18)
      )} ${nativeTokenName}, from ${from} on ${sourceChain}`
    );

    const tx = await bridge.mint(
      from,
      erc20token,
      ammount,
      nativeTokenName,
      nativeTokenSymbol,
      {
        chainId: isEthChain ? SEPOLIA_CHAIN_ID : BSC_CHAIN_ID,
        gasPrice: BigInt(Math.floor(Number(gasPrice.gasPrice) * 2)),
      }
    );
    console.log(`Mint Transaction sent ${tx.hash} on ${targetChain}`);
  } catch (err) {
    console.log(err);
  }
}

async function tokenBurnedHandler(from, erc20token, ammount, targetBridge) {
  try {
    const isEthChain = targetBridge === "eth";
    const sourceChain = isEthChain ? "BSC" : "ETH";
    const targetChain = isEthChain ? "ETH" : "BSC";
    const bridge = isEthChain ? ethBridge : bscBridge;
    const provider = isEthChain ? ethProvider : bscProvider;
    const gasPrice = await provider.getFeeData();

    const nativeToken = isEthChain ? bscToken : ethToken;
    const nativeTokenName = await nativeToken.name();
    const nativeTokenSymbol = await nativeToken.symbol();

    const tx = await bridge.release(from, erc20token, ammount, {
      chainId: isEthChain ? SEPOLIA_CHAIN_ID : BSC_CHAIN_ID,
      gasPrice: BigInt(Math.floor(Number(gasPrice.gasPrice) * 2)),
    });
    console.log(`Release Transaction sent ${tx.hash} on ${targetChain}`);
  } catch (err) {
    console.log(err);
  }
}

async function tokenMintedHandler(to, erc20token, ammount, targetBridge) {
  const isEthChain = targetBridge === "eth";
  const provider = isEthChain ? ethProvider : bscProvider;

  const tokenMinted = new ethers.Contract(erc20token, T0KEN_BASE.abi, provider);

  const tokenName = await tokenMinted.name();
  console.log(
    `Minted ${ethers.formatUnits(ammount, BigInt(18))} ${tokenName}, to ${to}`
  );
}

async function tokenReleasedHandler(to, erc20token, ammount, targetBridge) {
  const isEthChain = targetBridge === "eth";
  const provider = isEthChain ? ethProvider : bscProvider;

  const tokenMinted = new ethers.Contract(erc20token, T0KEN_BASE.abi, provider);

  const tokenName = await tokenMinted.name();
  console.log(
    `Released ${ethers.formatUnits(ammount, BigInt(18))} ${tokenName}, to ${to}`
  );
}
