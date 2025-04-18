import React from 'react';
import { useState } from 'react';
import { mintNFT } from '../utils/contractServices';
import { viewNFT } from '../utils/contractServices';
import { transferNFT } from '../utils/contractServices';

function ContractActions(){

    const [tokenURI, owner , from] = useState("");

    const mintNFTHandler = async () => {}

    const viewNFTHandler = async () => {
        try {
            const nfts = await viewNFT();
            console.log('NFTs:', nfts);
        } catch (error) {
            console.error('Error viewing NFTs:', error.message);
        }
    }
    const transferNFTHandler = async () => {
        try {
            const transaction = await transferNFT(owner, from);
            console.log('NFT transferred successfully');
        } catch (error) {
            console.error('Error transferring NFT:', error.message);
        }
    }
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result.split(',')[1];
                setTokenURI(base64String);
            };
            reader.readAsDataURL(file);
        }
    }
    return (
        <div>
            <h2>Contract Actions</h2>
            <button onClick={mintNFTHandler}>Mint NFT</button>
            <button onClick={viewNFTHandler}>View NFTs</button>
            <button onClick={transferNFTHandler}>Transfer NFT</button>
        </div>
    );

}