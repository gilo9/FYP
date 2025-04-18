const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");

describe("DTK Contract", function() {
    async function deployTokenFixture() {
        const [owner, addr1] = await ethers.getSigners();
        const hardhatToken = await ethers.deployContract("DataToken");
        await hardhatToken.waitForDeployment();
        
        return { hardhatToken, owner, addr1 };
    }

    describe("Token Creation", function() {
        it("Should set the right owner", async function() {
            const { hardhatToken, owner} = await loadFixture(deployTokenFixture);

            const tx = await hardhatToken.mint(owner.address, "token 1");
            const receipt = await tx.wait();
            //console.log("Reciept:",receipt)
            // More reliable way to get events
            const filter = hardhatToken.filters.TokenMinted();
            const events = await hardhatToken.queryFilter(filter, receipt.blockNumber);
            const tokenId = events[0].args.tokenId;
            

            // Get the TokenMinted event
            //const event = receipt.events.find(e => e.event === "TokenMinted");
            //const tokenId = event.args.tokenId;

            const ownerADD = await hardhatToken.ownerOf(tokenId);
            expect(ownerADD).to.equal(owner.address);
        });

        it("Should assign token uri correctly", async function() {
            const { hardhatToken, owner } = await loadFixture(deployTokenFixture);
            const newTokenUri = "Token 2";

            const tx = await hardhatToken.mint(owner.address, newTokenUri);
            const receipt = await tx.wait();
            //console.log("Reciept:",receipt);

            const mintEvents = await hardhatToken.queryFilter(hardhatToken.filters.TokenMinted(),receipt.blockNumber)

            const tokenId = mintEvents[0].args.tokenId;
            
            const uri = await hardhatToken.tokenURI(tokenId);
            expect(uri).to.equal("http://127.0.0.1:8080/ipfs/" + newTokenUri);
        });
    });

    describe("Token Functions", function(){
        it("Should retrieve token from tokenId", async function(){
            const {hardhatToken, owner} = await loadFixture(deployTokenFixture);

            const tx = await hardhatToken.mint(owner.address,"token 1");
            const receipt = await tx.wait();

            const mintEvents = await hardhatToken.queryFilter(hardhatToken.filters.TokenMinted(),receipt.blockNumber);

            const tokenId = mintEvents[0].args.tokenId;


            const tokenURI = await hardhatToken.tokenURI(tokenId);

            expect(tokenURI).to.equal("http://127.0.0.1:8080/ipfs/token 1");

        });

    })
    describe("Token Events", function(){
        it("Should emit tokenMinted  when .mint() is called", async function(){
            const {hardhatToken, owner} = await loadFixture(deployTokenFixture);

            const tx = await hardhatToken.mint(owner.address,"token 1");
            const receipt = await tx.wait();

            const mintEvents = await hardhatToken.queryFilter(hardhatToken.filters.TokenMinted(),receipt.blockNumber);
            
            expect(mintEvents.length).to.be.greaterThan(0);

        });

        it("Should emit tokenBurned when _burn is called",async function name() {
            const {hardhatToken, owner} = await loadFixture(deployTokenFixture);

            const tx = await hardhatToken.mint(owner.address,"token 1");
            const receipt = await tx.wait();

            const mintEvents = await hardhatToken.queryFilter(hardhatToken.filters.TokenMinted(),receipt.blockNumber);

            const tokenId = mintEvents[0].args.tokenId;

            const burn = await hardhatToken.burnToken(tokenId);

            const receipt2 = await burn.wait();

            const burnEvents = await hardhatToken.queryFilter(hardhatToken.filters.TokenBurned(),receipt2.blockNumber);

            expect(burnEvents.length).to.be.greaterThan(0);
            
        });

        /* it("Should emit token transfered when _transfer is called", async function () {
            const { hardhatToken, owner } = await loadFixture(deployTokenFixture);

            const tx = await hardhatToken.mint(owner.address, "token 1");
            const receipt = await tx.wait();

            const mintEvents = await hardhatToken.queryFilter(hardhatToken.filters.TokenMinted(), receipt.blockNumber);

            const addr2 = hardhatToken.connect();

            const transfer = hardhatToken.transfer(owner.address,addr2,tokenId);

            const reciept2 = a




        }); */
    })
});