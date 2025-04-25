// Updated ContractActions.jsx with better structure
import React, {useState} from 'react';
import { mintNFT, burnNFT, viewNFTs, transferNFT } from '../utils/contractServices';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { create } from 'kubo-rpc-client';

function ContractActions() {
    const [nfts, setNfts] = useState([]);
    const [files, setFiles] = useState([]);
    const [fileName, setFileName] = useState("");
    const [fileType, setFileType] = useState("");
    const [fileSize, setFileSize] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [recipientAddress, setRecipientAddress] = useState("");
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [tokenIndex, setTokenIndex] = useState(null);


    const mintNFTHandler = async (file) => {
        setIsLoading(true);
        try {
            const client = create({ port: 5001, host: "127.0.0.1", protocol: "http" });
            const cid = await client.add(file);
            
            const metadata = {
                name: fileName,
                type: fileType,
                size: fileSize,
                cid: cid.cid.toString(),
            };
            
            await mintNFT(JSON.stringify(metadata));
            toast.success("NFT minted successfully!");
            setFiles([]);
            setFileName("");
            setFileType("");
            setFileSize(0);
            await viewNFTHandler();
        } catch (error) {
            console.error("Error:", error);
            toast.error(error?.reason || "Failed to mint NFT");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files.length === 0) return;
        setFiles(e.target.files[0]);
        setFileName(e.target.files[0].name);
        setFileType(e.target.files[0].type);
        setFileSize(e.target.files[0].size);
    }

    const transferNFTHandler = async (to, tokenIndex) => {
        try {
            await transferNFT(to, tokenIndex);
            toast.success("NFT transferred successfully!");
            await viewNFTHandler();
        } catch (error) {
            toast.error(error?.reason || "Failed to transfer NFT");
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (files) {
            mintNFTHandler(files);
        } else {
            toast.error('Please select a file first');
        }
    };

    const burnNFTHandler = async (tokenId) => {
        try {
            await burnNFT(tokenId);
            toast.success("NFT burned successfully!");
            await viewNFTHandler();
        } catch (error) {
            toast.error(error?.reason || "Failed to burn NFT");
        }
    }

    const viewNFTHandler = async () => {
        try {
            const nfts = await viewNFTs();
            setNfts(nfts);
        } catch (error) {
            toast.error("Failed to load NFTs");
        }
    }

    return (
        <div className="contract-actions">
            <div className="upload-section">
                <h2>Blockahin Data Sharing Platform</h2>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="file" 
                        onChange={handleFileChange}
                        required
                    />
                    <input 
                        type="text" 
                        value={fileName} 
                        onChange={(e) => setFileName(e.target.value)} 
                        placeholder="File name"
                        required
                    />
                    <button type="submit" disabled={!files || isLoading}>
                        {isLoading ? 'Minting...' : 'Upload & Mint NFT'}
                    </button>
                </form>
            </div>

            <div className="nft-container">
                <div className="flex-center">
                    <button onClick={viewNFTHandler} className="reload-btn">
                        Reload NFTs
                    </button>
                </div>
                
                <h2 className="text-center">Your NFTs</h2>
                
                {nfts.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>File Name</th>
                                <th>Type</th>
                                <th>Size</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {nfts.map((nft, index) => {
                                const parsedNft = JSON.parse(nft);
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{parsedNft.name}</td>
                                        <td>{parsedNft.name.split(".")[1]}</td>
                                        <td>{parsedNft.size} bytes</td>
                                        <td className="flex-center">
                                            <a 
                                                href={`http://localhost:8080/ipfs/${parsedNft.cid}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                            >
                                                <button className="table-button">View</button>
                                            </a>
                                            <button 
                                                onClick={() => burnNFTHandler(index)}
                                                className="table-button"
                                            >
                                                Delete
                                            </button>
                                            <button onClick={() => {
                                                setShowTransferModal(true);
                                                setTokenIndex(index);
                                            }}
                                            className='table-button'>
                                              Transfer
                                            </button>

                                        </td>
                                    </tr>
                                    
                                    

                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center mt-2">
                        <h3>You have no NFTs yet</h3>
                        <p>Upload a file to mint your first NFT</p>
                    </div>
                )}
                {showTransferModal && (
                    <div className="modal">
                    <div className="modal-content">
                    <h3>Transfer Token #{tokenIndex}</h3>
                    <h3>FileName: {nfts[tokenIndex] ? JSON.parse(nfts[tokenIndex]).name : ''}</h3>
      <input
        type="text"
        placeholder="Recipient address"
        value={recipientAddress}
        onChange={(e) => setRecipientAddress(e.target.value)}
      />
      <button
        onClick={async () => {
            await transferNFTHandler(recipientAddress, tokenIndex);
            setShowTransferModal(false);
            setRecipientAddress("");
        }}
      >
        Submit
      </button>
      <button onClick={() => setShowTransferModal(false)}>Cancel</button>
    </div>
  </div>
)}

            </div>
        </div>
    );
}

export default ContractActions;