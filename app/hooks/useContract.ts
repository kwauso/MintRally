import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { NFT_CONTRACT } from '../../app/config/contract'

export function useContract() {
    const [contract, setContract] = useState<ethers.Contract | null>(null)
    const [signer, setSigner] = useState<ethers.Signer | null>(null)

    useEffect(() => {
        const initContract = async () => {
            if (typeof window.ethereum !== 'undefined') {
                try {
                    const provider = new ethers.providers.Web3Provider(window.ethereum)
                    await provider.send("eth_requestAccounts", [])
                    const signer = provider.getSigner()
                    setSigner(signer)

                    const contract = new ethers.Contract(
                        NFT_CONTRACT.address!,
                        NFT_CONTRACT.abi,
                        signer
                    )
                    setContract(contract)
                } catch (error) {
                    console.error('Contract initialization error:', error)
                }
            }
        }

        initContract()
    }, [])

    return { contract, signer }
}