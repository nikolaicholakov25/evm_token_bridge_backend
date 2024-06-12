const {
  ADDRESS,
  ETH_RPC_PROVIDER,
  BSC_RPC_PROVIDER,
  BSC_BRIDGE_ADDRESS,
  BSC_TOKEN_ADDRESS,
  ETH_BRIDGE_ADDRESS,
  ETH_TOKEN_ADDRESS,
} = require("./constants.json");
const ethers = require("ethers");

async function run() {
  const bscProvider = new ethers.JsonRpcProvider(BSC_RPC_PROVIDER);
  const ethProvider = new ethers.JsonRpcProvider(ETH_RPC_PROVIDER);
  const bscBalance = await bscProvider.getBalance(ADDRESS);
  const ethBalance = await ethProvider.getBalance(ADDRESS);
  console.log(bscBalance, ethBalance);
}

run().catch(console.log);
