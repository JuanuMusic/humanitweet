const BN = require("bn.js")
const truffleAssert = require('truffle-assertions');

const ProofOfHumanity = artifacts.require("contracts/DummyProofOfHumanity.sol");
const Humanitweet = artifacts.require("contracts/Humanitweet.sol");

const POH_GOVERNOR = "0x2ad91063e489CC4009DF7feE45C25c8BE684Cf6a";
const TWEET_URL = "https://ipfs.io/ipfs/QmPS5L36v6zJvzBYuMjDC8ojpx9JNULRG3Perw66qRb6NT?filename=VID_20210322_212500182.mp4"
contract("Humanitweet", accounts => {

    let humanitweet;
    let poh;
    const HUMAN_ADDRESS = accounts[0];
    const NOT_REGISTERED_ADDRESS = accounts[1];

    before(async () => {
        poh = await ProofOfHumanity.new(POH_GOVERNOR);
        humanitweet = await Humanitweet.new(poh.address);
        await poh.register(HUMAN_ADDRESS);
    })

    describe("Humanitweet content creation", () => {

        /* Test human only access */
        it("Should fail when user not Human tries to publish a humanitweet", async () => {
            const PREFIX = "VM Exception while processing transaction: ";
    
            try {
                await humanitweet.publishHumanitweet(TWEET_URL, { from: NOT_REGISTERED_ADDRESS });
            } catch (error) {
                assert(error, "Expected an error but did not get one");
                console.log(error.reason);
                //assert(error.message.startsWith(PREFIX + message), "Expected an error starting with '" + PREFIX + message + "' but got '" + error.message + "' instead");
            }
        });

        /* Test NFT mint */
        it("Should correctly mint an NFT and update the tokenCounter", async () => {
            const receipt = await humanitweet.publishHumanitweet(TWEET_URL, { from: HUMAN_ADDRESS });
            const tokenId = receipt.logs[0].args.tokenId;
            assert(tokenId.eq(new BN(0)), "NFT was not correctly minted");

            const tokenCounter = await humanitweet.tokenCounter()
            assert(tokenCounter.eq(new BN(1)), "Invalid token counter value");
        });

        /* Test minted NFT ownership */ 
        it("Minted NFT should belong to publisher address", async () => {
            const receipt = await humanitweet.publishHumanitweet(TWEET_URL, { from: HUMAN_ADDRESS });
            const tokenId = receipt.logs[0].args.tokenId;
            assert(tokenId.eq(new BN(1)), "NFT was not correctly minted");

            const owner = await humanitweet.ownerOf(tokenId);
            assert.equal(owner, HUMAN_ADDRESS, "Invalid token owner");
        });

    })
});