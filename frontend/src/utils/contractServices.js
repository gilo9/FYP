import DTK_ABI from '../DataToken.json';
import {BrowserProvider, Contract} from 'ethers';
import {CONTRACT_ADDRESS} from'../constraints.js';

let provider;
let contract;
let signer;

const initialise = async() =>{
   if (typeof window.Ethereum !== 'undefined') {
      provider = new BrowserProvider(window.ethereum);
      signer = await provider.getSigner();
      contract = new Contract(CONTRACT_ADDRESS, DTK_ABI, signer);
   }else{
        console.error('MetaMask is not installed');
   }
};

initialise();

export const requestAccount = async() => {
    try{
    const accounts = await provider.send('eth_requestAccounts', []);
    return accounts[0];
}catch (error) {
    console.error('Error requesting accounts:', error.message);
    return null;
  }
};


export const mintNFT = async (CID) => {
    try {
        const transaction = await contract.mint(CID);

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
        const metadata = await contract.getNFTMetadata(tokenId);
        return metadata;
    } catch (error) {
        console.error('Error fetching NFT metadata:', error.message);
        return null;
    }
}

export const burnNFT = async (tokenId) => {
    try {
        const transaction = await contract.burnToken(tokenId);
        await transaction.wait();
        console.log('NFT burned successfully');
    } catch (error) {
        console.error('Error burning NFT:', error.message);
    }
}