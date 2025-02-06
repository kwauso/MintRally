import { BrowserProvider, Contract, Signer } from 'ethers'
import { NFT_CONTRACT } from '../../app/config/contract'
import { useState, useEffect } from 'react'
import type { MetaMaskInpageProvider } from '@metamask/providers'

export function useContract() {
    const [contract, setContract] = useState<Contract | null>(null)
    const [signer, setSigner] = useState<Signer | null>(null)

    useEffect(() => {
        const initContract = async () => {
            if (typeof window.ethereum !== 'undefined') {
                try {
                    const provider = new BrowserProvider(window.ethereum as MetaMaskInpageProvider)
                    await provider.send("eth_requestAccounts", [])
                    const signer = await provider.getSigner()
                    setSigner(signer)

                    const contract = new Contract(
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