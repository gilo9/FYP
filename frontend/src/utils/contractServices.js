import DTK_ABI from './DataTokenModule#DataToken.json'
import {BrowserProvider, Contract} from 'ethers';
import {CONTRACT_ADDRESS} from'./constants.js';

let provider;
let contract;
let signer;
//const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
//const abi = DTK_ABI.parse(process.env.REACT_APP_ABI);

export const initialize = async () => {
    if (typeof window.ethereum !== "undefined") {
      provider = new BrowserProvider(window.ethereum);
      signer = await provider.getSigner();
      contract = new Contract(CONTRACT_ADDRESS, DTK_ABI.abi, signer);
      return { provider, contract, signer };
    } else {
      console.error("Please install MetaMask!");
    }
  };
  initialize();


export const viewNFTs = async(owner) => {
    tr

}
  
  



export const requestAccount = async () => {
    if (!provider) {
      await initialize();
    }
    try {
      const accounts = await provider.send("eth_requestAccounts", []);
      return accounts[0]; // Return the first account
    } catch (error) {
      console.error("Error requesting account:", error.message);
      return null;
    }
  };


export const mintNFT = async (CID) => {
    try {
        const transaction = await contract.mint(signer, CID);
        await transaction.wait();
        console.log('NFT minted successfully');
    } catch (error) {
        console.error('Error minting NFT:', error.message);
    }
}

/*export const getURIs = async () => {
    try {
        const URI = await contract.tokenURI(signer);
        return URI;
    } catch (error) {
        console.error('Error fetching NFTs:', error.message);
        return [];
    }
}*/

export const getCID = async (tokenId) => {
    try {
        const metadata = await contract.tokenURI(tokenId);
        return metadata;
    } catch (error) {
        console.error('Error fetching NFT metadata:', error.message);
        return null;
    }
}

export const burnNFT = async (tokenId) => {
    try {
        const transaction = await contract.burnToken(tokenId);
        console.log('NFT burned successfully');
        return transaction;
    } catch (error) {
        console.error('Error burning NFT:', error.message);
    }
}