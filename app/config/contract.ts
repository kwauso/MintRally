import { abi as NFT_CONTRACT_ABI } from '../../blockchain/artifacts/contracts/EventNFT.sol/EventNFT.json'

export const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS
export const NFT_CONTRACT = {
    abi: NFT_CONTRACT_ABI,
    address: NFT_CONTRACT_ADDRESS,
}