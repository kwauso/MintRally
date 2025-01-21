import { ethers } from "hardhat";

async function main() {
  const EventNFT = await ethers.getContractFactory("EventNFT");
  const eventNFT = await EventNFT.deploy();
  await eventNFT.waitForDeployment();

  const address = await eventNFT.getAddress();
  console.log("EventNFT deployed to:", address);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});