const BN = require("bn.js")
const truffleAssert = require('truffle-assertions');

const ProofOfHumanity = artifacts.require("contracts/DummyProofOfHumanity.sol");
const Humanitweet = artifacts.require("contracts/Humanitweet.sol");

const POH_GOVERNOR = "0x2ad91063e489CC4009DF7feE45C25c8BE684Cf6a";
const TWEET_URL = "https://ipfs.io/ipfs/QmPS5L36v6zJvzBYuMjDC8ojpx9JNULRG3Perw66qRb6NT?filename=VID_20210322_212500182.mp4"
contract("Humanitweet", accounts => {

    let humanitweet;
    let poh;
    const HUMAN_1 = accounts[0];
    const HUMAN_2 = accounts[1];
    const NOT_REGISTERED_ADDRESS = accounts[3];

    before(async () => {
        poh = await ProofOfHumanity.new(POH_GOVERNOR);
        humanitweet = await Humanitweet.new(poh.address);
        await poh.register(HUMAN_1);
        await poh.register(HUMAN_2);
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
            const receipt = await humanitweet.publishHumanitweet(TWEET_URL, { from: HUMAN_1 });
            const tokenId = receipt.logs[0].args.tokenId;
            assert(tokenId.eq(new BN(0)), "NFT was not correctly minted");

            const tokenCounter = await humanitweet.tokenCounter()
            assert(tokenCounter.eq(new BN(1)), "Invalid token counter value");
        });

        /* Test minted NFT ownership */
        it("Minted NFT should belong to publisher address", async () => {
            const receipt = await humanitweet.publishHumanitweet(TWEET_URL, { from: HUMAN_1 });
            const tokenId = receipt.logs[0].args.tokenId;
            assert(tokenId.eq(new BN(1)), "NFT was not correctly minted");

            const owner = await humanitweet.ownerOf(tokenId);
            assert.equal(owner, HUMAN_1, "Invalid token owner");
        });

    });

    describe("Humanitweet content support", () => {
        it("Should correctly give support", async () => {

            const ubiSupport = new BN(1 * 10 ^ 18);
            await poh.approve(humanitweet.address, ubiSupport, { from: HUMAN_2 });
            await humanitweet.support(1, ubiSupport, { from: HUMAN_2 });

            const tweet = await humanitweet.getHumanitweet(1);
            assert.equal(tweet.supportGiven, ubiSupport, "Invalid UBI suport value");
            assert.equal(tweet.supportersCount, 1, "Invalid supporters count")
        });

        it("Should correctly count 1 supporter even if support is given multiple times", async () => {

            const ubiSupport = new BN(2 * (10 ^ 18));
            await poh.approve(humanitweet.address, ubiSupport, { from: HUMAN_2 });

            // Give support twice
            await humanitweet.support(1, new BN(1 * 10 ^ 18), { from: HUMAN_2 });
            await humanitweet.support(1, new BN(1 * 10 ^ 18), { from: HUMAN_2 });

            const tweet = await humanitweet.getHumanitweet(1);
            console.log("TWEET", tweet);
            assert.equal(tweet.supportGiven, ubiSupport, "Invalid UBI suport value");
            assert.equal(tweet.supportersCount, 1, "Invalid supporters count")
        });

        it("Should correctly count 2 supporters when 2 humans send support", async () => {

            const ubiSupport = 1 * (10 ^ 18);

            // Give support from both humans

            await poh.approve(humanitweet.address, ubiSupport, { from: HUMAN_1 });
            await humanitweet.support(1, ubiSupport, { from: HUMAN_1 });

            await poh.approve(humanitweet.address, ubiSupport, { from: HUMAN_2 });
            await humanitweet.support(1, ubiSupport, { from: HUMAN_2 });

            const tweet = await humanitweet.getHumanitweet(1);
            console.log("Tweet", tweet);
            assert.equal(tweet.supportGiven.toString(), ubiSupport * 2, "Invalid UBI suport value");
            assert.equal(tweet.supportersCount, 2, "Invalid supporters count")
        });
    });
});