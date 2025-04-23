import React, {useState} from 'react';
import { mintNFT,burnNFT,getCID } from '../utils/contractServices';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function ContractActions(){

    const [tokenId, setTokenId, tokenURI, setTokenURI] = useState("");

    const mintNFTHandler = async () => {
        try{
            const transaction = await mintNFT(tokenURI);
            console.log('NFT minted successfully');
        }catch (error) {
            console.log("error -->", error);
            toast.error(error?.reason);
        }
        setTokenURI("");
    };

    const burnNFTHandler = async () => {
        try {
            const transaction = await burnNFT(tokenId);
            console.log('NFT burned successfully');
        } catch (error) {
            console.error('Error burning NFT:', error.message);
        }
        setTokenId("");
    }

    const viewNFTHandler = async () => {
        try {
            const nfts = await getCID();
            console.log('NFTs:', nfts);
        } catch (error) {
            console.error('Error viewing NFTs:', error.message);
            
        }
    }
    // const transferNFTHandler = async () => {
    //     try {
    //         const transaction = await transferNFT(owner, from);
    //         console.log('NFT transferred successfully');
    //     } catch (error) {
    //         console.error('Error transferring NFT:', error.message);
    //     }
    
    // const handleFileChange = (event) => {
    //     const file = event.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             const base64String = reader.result.split(',')[1];
    //             setTokenURI(base64String);
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // }
    return (
        <div>
            <h2>Contract Actions</h2>
            <div>
                <input
                    type = "text"
                    value = {tokenURI}
                    onChange = {(e) => setTokenURI(e.target.value)}
                    placeholder = "Enter token URI" 
                />
                <button onClick={mintNFTHandler}>Mint NFT</button>
            </div>
            <div>
                <input
                    type = "text"
                    value = {tokenId}
                    onChange = {(e) => setTokenId(e.target.value)}
                    placeholder = "Enter token ID" 
                />
                <button onClick={burnNFTHandler}>Burn NFT</button>
            </div>
        </div>
    );
}
export default ContractActions;