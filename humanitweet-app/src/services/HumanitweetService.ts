import { providers, Contract, ethers } from "ethers";
import BN from "bn.js";
import IPFSStorageService from "./IPFSStorageService";
//const { providers, Contract } = require('ethers');
import configService from "./configService";
import contractProvider, { EthersProviders } from "./ContractProvider";
const Humanitweet = require('../contracts/Humanitweet.json');
//const humanitweetContract = Humanitweet.deployed();
// const registry = Registry.deployed();
// const registryWrapper = new Contract(Registry.address, registryAbi.abi, signer);

interface IHumanitweetService {
  giveSupport(tokenID: number, amount: BN, from: string, provider: ethers.providers.Web3Provider): Promise<void>;
  publishTweet(tweetData: ITweetData, provider: ethers.providers.Web3Provider): Promise<void>;
  getLatestTweets(maxRecords: number, provider: ethers.providers.Web3Provider): Promise<IHumanitweetNft[]>;
}


const HumanitweetService: IHumanitweetService = {

  /**
   * Burn UBIs to support a users NFT.
   * @param tokenID IUD of the NFT to give support
   * @param amount amount of UBIs to be burned
   * @param from Human burning their UBIs.
   * @param provider Web3Provider
   */
  async giveSupport(tokenID: number, amount: BN, from: string, provider: ethers.providers.Web3Provider) {

    console.log("TokenID", tokenID);
    console.log("Amount", amount);
    // Create as NFT on the humanitweet contract

    const contract = await contractProvider.getHumanitweetContractForWrite(from, provider);
    const tx = await contract.support(tokenID, amount);
    console.log("SUPPORT TX", tx);
  },

  /**
   * Takes care of publishing a tween. 
   * It first uploads the tweet to a Decentralized service and then mints the NFT with the URL to it.
   * @param tweetData Data of the tweet
   * @param drizzle 
   */
  async publishTweet(tweetData: ITweetData, provider: ethers.providers.Web3Provider) {

    // upload the tweet to the storage service and get the path to the uploaded file
    const uploadedPath = await IPFSStorageService.uploadTweet(tweetData);
    console.log("UPOADED FILE TO IPFS: ", uploadedPath)
    // Create as NFT on the humanitweet contract

    try {
      const humanitweetContract = await contractProvider.getHumanitweetContractForWrite(tweetData.author, provider);
      const tx = await humanitweetContract.publishHumanitweet(`${uploadedPath}`);
      console.log("Humanitweet published. TX:", tx);
    }
    catch (error) {
      console.log("error", error);
    }
  },

  /**
   * Get the latest tweets
   * @param provider 
   * @param maxRecords Max number of records to fetch.
   * @returns 
   */
  async getLatestTweets(maxRecords: number, provider: ethers.providers.Web3Provider): Promise<IHumanitweetNft[]> {
    const humanitweetContract = await contractProvider.getHumanitweetContractForRead(provider);
    console.log("HTWT CONTRACT", humanitweetContract)
    const counter = await humanitweetContract.tokenCounter();

    console.log("TOTAL HTWTs", counter);
    const tweetNFTs: IHumanitweetNft[] = [];

    // Loop from the last
    for (let tokenId = counter - 1; tokenId >= Math.max(tokenId - maxRecords, 0); tokenId--) {
      // Get NFT data from the contract and add it to the collection of tweets
      const humanitweetNft = await humanitweetContract.getHumanitweet(tokenId);

      console.log("NFT", humanitweetNft);

      // Add the NFT to the list of nfts
      tweetNFTs.push({
        tokenId: tokenId,
        tokenURI: humanitweetNft.tokenURI,
        creationDate: new Date(parseInt(humanitweetNft.date, 10) * 1000),
        supportGiven: humanitweetNft.supportGiven,
        supportCount: humanitweetNft.supportCount
      });
    }
    return tweetNFTs;
  }
}

export default HumanitweetService;