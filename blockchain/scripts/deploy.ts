import { ethers } from "hardhat";

async function main() {
  const EventNFT = await ethers.getContractFactory("EventNFT");
  const eventNFT = await EventNFT.deploy();
  await eventNFT.waitForDeployment();

  const address = await eventNFT.getAddress();
  console.log("EventNFT deployed to:", address);

  const fs = require("fs");
  const envContent = `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=${address}`;
  fs.writeFileSync('../.env.local', envContent);

  console.log("Contract address saved to .env.local");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});