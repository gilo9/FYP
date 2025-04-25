import React, {useState} from 'react';
import { mintNFT,burnNFT,getCID, viewNFTs } from '../utils/contractServices';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { create } from 'kubo-rpc-client';
import { kubo_url } from '../utils/constants';


function ContractActions(){

    const [tokenId, setTokenId] = useState("");
    const [nfts, setNfts] = useState([]);
    const[files,setFiles] = useState([]);
    const [fileName, setFileName] = useState("");
    const [fileType, setFileType] = useState("");
    const [fileSize, setFileSize] = useState(0);

    const mintNFTHandler = async (file) => {
        try{
            const client = create({
                port: 5001,
                host: "127.0.0.1",
                protocol: "http",
            });
            
            const cid = await client.add(file);
            console.log('File added to IPFS with CID: ',cid.cid.toString());

            const metadata = {
                name: fileName,
                type: fileType,
                size: fileSize,
                cid: cid.cid.toString(),
            };
            const jsonMetadata = JSON.stringify(metadata);
            const transaction = await mintNFT(jsonMetadata);
            console.log('NFT minted successfully');
            setFiles([]);
        }catch (error) {
            console.log("error -->", error);
            toast.error(error?.reason);
        }
    };
    const handleFileChange = (e) => {
        if (e.target.files.length == 0) {
            console.error('No file selected');
            return;
        }
        setFiles(e.target.files[0]);
        setFileName(e.target.files[0].name);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (files) {
            setFileType(files.type);
            setFileSize(files.size);
            console.log('File Type:', files.type);
            console.log('File Size:', files.size);
            
            mintNFTHandler(files);
            
        }else {
            console.error('No file selected');
        }
    };

    const burnNFTHandler = async () => {
        try {
            const transaction = await burnNFT(tokenId);
            console.log('NFT burned successfully');
        } catch (error) {
            console.error('Error burning NFT:', error.message);
        }
        setTokenId("");
        viewNFTHandler();
    }

    const viewNFTHandler = async () => {
        try {
            const nfts = await viewNFTs();
            console.log('NFTs:', nfts);
            setNfts(nfts);
            console.log('NFTs:');

        } catch (error) {
            console.error('Error viewing NFTs:', error.message);
        }
    }
    return (
        <div>
            <h2>Contract Actions</h2>
            <div>
                <form onSubmit={handleSubmit}>
                    <input type="file" onChange={(e) =>handleFileChange(e)}/>
                    <input type = "text" value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder = "Enter file name" />
                    <button type="submit" disabled ={!files}>Upload</button>
                </form>
            </div>
            <div class="center">
                <input
                    type = "text"
                    value = {tokenId}
                    onChange = {(e) => setTokenId(e.target.value)}
                    placeholder = "Enter token ID" 
                />
                <button onClick={burnNFTHandler}>Burn NFT</button>
            </div>
            <div>
                <button onClick={viewNFTHandler}>View NFTs</button>
                <table>
                            <thead>
                                <th> #</th>
                                <th>file name</th>
                                <th>file type</th>
                                <th>file size</th>
                                <th>view</th>
                            </thead>
                </table>

                {nfts && nfts.map((nft, index) => (
                <div>
                    
                    <div key={index}>
                        <table>
                            <tr><td>{index + 1}: {JSON.parse(nft).name}</td>
                            <td>{JSON.parse(nft).type}</td>
                            <td>{JSON.parse(nft).size}</td>
                            <td>
                                <a href={"http://localhost:8080/ipfs/" + JSON.parse(nft).cid} target="_blank" rel="noopener noreferrer">
                                    <button>View</button>
                                </a>
                            </td>
                            </tr>
                        </table>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default ContractActions;