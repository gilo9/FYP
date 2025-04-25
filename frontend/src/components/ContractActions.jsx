import React, {useState} from 'react';
import { mintNFT,burnNFT,getCID, viewNFTs } from '../utils/contractServices';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { create } from 'kubo-rpc-client';
import { kubo_url } from '../utils/constants';


function ContractActions(){


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
            setFileName("");
            setFileType("");
            setFileSize(0);
            viewNFTHandler();
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
        setFileType(e.target.files[0].type);
        setFileSize(e.target.files[0].size);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (files) {
            mintNFTHandler(files);
            
            toast.success("File uploaded and NFT minted successfully!");
        }else {
            console.error('No file selected');
        }
    };

    const burnNFTHandler = async (tokenId) => {
        try {
            const transaction = await burnNFT(tokenId);
            console.log('NFT burned successfully');
        } catch (error) {
            console.error('Error burning NFT:', error.message);
        }
        ;
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

    function nftTable(){
        const bool = nfts.length > 0;
        if (bool) {
            return (
                <div>
                    <table>
                       
                    </table>

                    {nfts && nfts.map((nft, index) => (
                    <div>
                        
                        <div >
                        <table>
                            <thead>
                            <th> #</th>
                            <th>file name</th>
                            <th>file type</th>
                            <th>file size</th>
                            <th>view</th>
                            <th>delete</th>
                        </thead>
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                   <td>  {JSON.parse(nft).name}</td>
                                <td>{JSON.parse(nft).type}</td>
                                <td>{JSON.parse(nft).size}</td>
                                <td>
                                    <a href={"http://localhost:8080/ipfs/" + JSON.parse(nft).cid} target="_blank" rel="noopener noreferrer">
                                        <button>View</button>
                                    </a>
                                </td>
                                <td>
                                    <button onClick={() => burnNFTHandler(index)}>Delete</button>
                                </td>
                                </tr>
                            </table>
                            </div>
                        </div>
                    ))}
                </div>);
        }
        else {
            return (
                <div>
                    <h2>You have no NFTs</h2>
                </div>
            );
        }
    }
    

    return (
        <div>
            <h2>BLOCK STORAGE</h2>
            <h2>Upload your files to IPFS and mint an NFT</h2>
            <div>
                <form onSubmit={handleSubmit} name = "upload-form">
                    <input type="file" onChange={(e) =>handleFileChange(e)}/>
                    <input type = "text" value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder = "Enter file name" />
                    <button type="submit" disabled ={!files}>Upload</button>
                </form>
            </div>
            <div>
                <button onClick={viewNFTHandler}>Reload</button>
                <h2>Your NFTs</h2>
                {nftTable()}
            </div>
        </div>
    );
}
export default ContractActions;