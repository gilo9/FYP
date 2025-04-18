import DTK_ABI from '../DTK.json';
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
    const accoounts = await provider.send('eth_requestAccounts', []);
    return account[0];
}catch (error) {
    console.error('Error requesting accounts:', error.message);
    return null;
  }
};


export const mintNFT = async (tokenURI) => {
    try {
        const transaction = await contract.mint(tokenURI, signer);

        await transaction.wait();
        console.log('NFT minted successfully');
    } catch (error) {
        console.error('Error minting NFT:', error.message);
    }
}

export const getURIs = async () => {
    try {
        const URI = await contract.getNFTs(signer);
        return nfts;
    } catch (error) {
        console.error('Error fetching NFTs:', error.message);
        return [];
    }
}
export const getNFTMetadata = async (tokenURI) => {
    try {
        const metadata = await contract.getNFTMetadata(tokenURI);
        return metadata;
    } catch (error) {
        console.error('Error fetching NFT metadata:', error.message);
        return null;
    }
}
export const transferNFT = async (to, tokenId) => {
    try {
        const transaction = await contract.transfer(signer,to, tokenId);
        await transaction.wait();
        console.log('NFT transferred successfully');
    } catch (error) {
        console.error('Error transferring NFT:', error.message);
    }
}