import type { MetaMaskInpageProvider } from '@metamask/providers'

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

if (window.ethereum) {
  console.log('MetaMask is installed!');
}

// グローバルモジュールとして宣言するために必要
export {}