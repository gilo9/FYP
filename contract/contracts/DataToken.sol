// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
import "hardhat/console.sol";

import { ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { ERC721Burnable } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import { ERC721Enumerable } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract DataToken is ERC721,ERC721Enumerable, ERC721URIStorage, ERC721Burnable{
    uint256 private _nextTokenId;

    event TokenMinted(uint256 tokenId, address to, string uri);
    event TokenTransferred(uint256 tokenId, address to, address from);
    event TokenBurned(uint256 tokenId);

    constructor() 
     ERC721("DataToken", "DTK")
     {
        
    }
    function _baseURI() internal view virtual override returns (string memory) {
        return "http://127.0.0.1:8080/ipfs/";
        }

    function mint(address to, string memory uri) 
        public
        returns (uint256) 
    {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        console.log("Minting token with ID: %s", tokenId);
        console.log("Minting token with URI: %s", uri);
        console.log("Minting token to address: %s", to);

        emit TokenMinted(tokenId, to, uri);
        console.log("Token minted successfully");

        return tokenId;
    }

    function burnToken(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Token does not exist");
        _burn(tokenId);
        console.log("Burning token with ID: %s", tokenId);
        emit TokenBurned(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        require(ownerOf(tokenId) == msg.sender, "Token does not exist");
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    function totalSupply() public view override(ERC721Enumerable) returns (uint256) {
        return super.totalSupply();
    }
    function tokenOfOwnerByIndex(address owner, uint256 index)
        public
        view
        override(ERC721Enumerable)
        returns (uint256)
    {
        return super.tokenOfOwnerByIndex(owner, index);
    }
    function tokenByIndex(uint256 index)
        public
        view
        override(ERC721Enumerable)
        returns (uint256)
    {
        return super.tokenByIndex(index);
    }
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

}