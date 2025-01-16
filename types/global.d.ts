import { MetaMaskInpageProvider } from '@metamask/providers';

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

if (window.ethereum) {
  console.log('MetaMask is installed!');
}