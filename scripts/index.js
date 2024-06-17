require("dotenv").config();

const {
  BSC_RPC_PROVIDER,
  ETH_RPC_PROVIDER,
  ETH_TOKEN_ADDRESS,
  ETH_BRIDGE_ADDRESS,
  BSC_BRIDGE_ADDRESS,
  BSC_TOKEN_ADDRESS,
  ETH_RPC_WS_PROVIDER,
  BSC_RPC_WS_PROVIDER,
  ADDRESS,
  PRIVATE_KEY,
} = process.env;

const { BRIDGE, T0KEN_BASE } = require("../abis.json");
const ethers = require("ethers");

const bscWSProvider = new ethers.WebSocketProvider(BSC_RPC_WS_PROVIDER);
const bscProvider = new ethers.JsonRpcProvider(BSC_RPC_PROVIDER);
const ethWSProvider = new ethers.WebSocketProvider(ETH_RPC_WS_PROVIDER);
const ethProvider = new ethers.JsonRpcProvider(ETH_RPC_PROVIDER);
const ethSigner = new ethers.Wallet(PRIVATE_KEY, ethProvider);
const bscSigner = new ethers.Wallet(PRIVATE_KEY, bscProvider);

const ethToken = new ethers.Contract(
  ETH_TOKEN_ADDRESS,
  T0KEN_BASE.abi,
  ethSigner
);

const bscToken = new ethers.Contract(
  BSC_TOKEN_ADDRESS,
  T0KEN_BASE.abi,
  bscSigner
);

const ethBridge = new ethers.Contract(
  ETH_BRIDGE_ADDRESS,
  BRIDGE.abi,
  ethSigner
);
const bscBridge = new ethers.Contract(
  BSC_BRIDGE_ADDRESS,
  BRIDGE.abi,
  bscSigner
);

module.exports = {
  ethBridge,
  bscBridge,
  bscToken,
  ethToken,
  ethProvider,
  bscProvider,
  ethWSProvider,
  bscWSProvider,
};
