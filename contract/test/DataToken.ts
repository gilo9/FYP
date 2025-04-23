import DataTokenModule from "../ignition/modules/DataToken";

const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");
const { ignition } = require("hardhat");

describe("DTK Contract", function() {
    async function deployTokenFixture() {
       // ignition.deploy(DataTokenModule);
        const [owner, addr1] = await ethers.getSigners();
        const hardhatToken = await ethers.deployContract("DataToken");
        await hardhatToken.waitForDeployment();
        const tx = await hardhatToken.mint(owner.address, "token 1");
        const receipt = await tx.wait();
        const mintEvents = await hardhatToken.queryFilter(hardhatToken.filters.TokenMinted(),receipt.blockNumber);
        
        return { hardhatToken, owner, addr1,tx,mintEvents };
    } 

    describe("Token Creation", function() {
        it("Should set the right owner", async function() {
            const { hardhatToken, owner, mintEvents } = await loadFixture(deployTokenFixture);
            //console.log("Reciept:",receipt)
            const tokenId = mintEvents[0].args.tokenId;

            const ownerADD = await hardhatToken.ownerOf(tokenId);
            expect(ownerADD).to.equal(owner.address);
        });

        it("Should assign token uri correctly", async function() {
            const { hardhatToken, mintEvents } = await loadFixture(deployTokenFixture);
            const newTokenUri = "token 1";
            //console.log("Reciept:",receipt);

            const tokenId = mintEvents[0].args.tokenId;
            
            const uri = await hardhatToken.tokenURI(tokenId);
            expect(uri).to.equal("http://127.0.0.1:8080/ipfs/" + newTokenUri);
        });
    });

    describe("Token Functions", function(){
        it("Should retrieve token from tokenId", async function(){
            const {hardhatToken, mintEvents} = await loadFixture(deployTokenFixture);


            const tokenId = mintEvents[0].args.tokenId;


            const tokenURI = await hardhatToken.tokenURI(tokenId);

            expect(tokenURI).to.equal("http://127.0.0.1:8080/ipfs/token 1");

        });
        it("Should retrieve the total supply of DTK ", async function(){
            const { hardhatToken } = await loadFixture(deployTokenFixture);
            const totalSupply = await hardhatToken.totalSupply();
            var count =0;
            for (let i = 0; i < totalSupply; i++) {
                const tokenId = await hardhatToken.tokenByIndex(i);
                count++;
            }
            expect(totalSupply).to.equal(count);
        });

        it("Should list all tokens owner by a specified address", async function(){
            const { hardhatToken, mintEvents ,owner} = await loadFixture(deployTokenFixture);
            const tx = await hardhatToken.mint(owner.address, "token 2");
            await tx.wait(); 
            const tokens = await hardhatToken.tokensOfOwner(owner.address);
            console.log("Tokens of owner:",tokens);
            expect(tokens.length).to.equal(2);
            expect(tokens[0]).to.equal("http://127.0.0.1:8080/ipfs/token 1");
        });

       // it("Should retrieve tokenId from tokenURI", async function(){});

        // it("Should retrieve tokenId from tokenURI", async function(){});








    })
    describe("Token Events", function(){
        it("Should emit tokenMinted  when .mint() is called", async function(){
            const { owner, mintEvents} = await loadFixture(deployTokenFixture);
            console.log("Reciept:",mintEvents[0].args);
            expect(mintEvents.length).to.be.greaterThan(0);
            expect(mintEvents[0].args.to).to.equal(owner.address);
            expect(mintEvents[0].args.tokenId).to.equal(0)
            expect(mintEvents[0].args.uri).to.equal("token 1"); //ipfs base uri appended when uri is called from hardhatToken.tokenURI()

        });

        it("Should emit tokenBurned when _burn is called",async function name() {
            const {hardhatToken,mintEvents} = await loadFixture(deployTokenFixture);
           

            const tokenId = mintEvents[0].args.tokenId;

            const burn = await hardhatToken.burnToken(tokenId);

            const receipt2 = await burn.wait();

            const burnEvents = await hardhatToken.queryFilter(hardhatToken.filters.TokenBurned(),receipt2.blockNumber);

            expect(burnEvents.length).to.be.greaterThan(0);
            expect(burnEvents[0].args.tokenId).to.equal(tokenId);
            
        });

         it("Should emit token transferred when _transfer is called", async function () {
            const { hardhatToken, owner, addr1, mintEvents } = await loadFixture(deployTokenFixture);

            const tokenId = mintEvents[0].args.tokenId;


            const transfer = await hardhatToken.transferToken(addr1,tokenId);

            const transferEvents = await hardhatToken.queryFilter(hardhatToken.filters.TokenTransferred(), transfer.blockNumber);
            expect(transferEvents.length).to.be.greaterThan(0);
            expect(transferEvents[0].args.to).to.equal(addr1.address);
            expect(transferEvents[0].args.from).to.equal(owner.address);
             expect(transferEvents[0].args.tokenId).to.equal(tokenId);


        }); 
    })
});