import { providers, Contract, ethers, BigNumber } from "ethers";
import IPFSStorageService from "./IPFSStorageService";
//const { providers, Contract } = require('ethers');
import configService from "./configService";
import contractProvider, { EthersProviders } from "./ContractProvider";
import PohAPI from "../DAL/PohAPI";
import moment from "moment";
const Humanitweet = require('../contracts/Humanitweet.json');
//const humanitweetContract = Humanitweet.deployed();
// const registry = Registry.deployed();
// const registryWrapper = new Contract(Registry.address, registryAbi.abi, signer);

interface IHumanitweetService {
  giveSupport(tokenID: string, amount: BigNumber, from: string, provider: ethers.providers.Web3Provider): Promise<void>;
  publishTweet(tweetData: ITweetData, provider: ethers.providers.Web3Provider): Promise<void>;
  getLatestTweets(maxRecords: number, provider: ethers.providers.Web3Provider): Promise<IHumanitweetNft[]>;
  loadHumanitweetFromNFT(tweetNft: IHumanitweetNft): Promise<HumanitweetData>;
  requestBurnApproval(from: string, amount: BigNumber, provider: ethers.providers.Web3Provider): Promise<void>;
}

interface HumanitweetData extends IHumanitweetNft {
  authorImage: string | undefined;
  authorDisplayName: string;
  authorFullName: string;
  text: string;
}

const DEFAULT_CONFIRMATIONS = 5;


const HumanitweetService: IHumanitweetService = {

  /**
   * Requests approval to burn UBIs on the humanitweet contract.
   * @param from Human address that burns their UBIs
   * @param provider Web3Provider
   * @param waitConfirmation Wait for this confirmations to complete transaction.
   */
  async requestBurnApproval(from: string, amount: BigNumber, provider: ethers.providers.Web3Provider) {
    const ubiContract = await contractProvider.getUBIContractForWrite(from, provider);
    const approvalTx = await ubiContract.approve(await contractProvider.getHumanitweetContractAddress(provider), amount);    
    return await approvalTx.wait(DEFAULT_CONFIRMATIONS);
  },

  /**
   * Burn UBIs to support a users NFT.
   * @param tokenID IUD of the NFT to give support
   * @param amount amount of UBIs to be burned
   * @param from Human burning their UBIs.
   * @param provider Web3Provider
   */
  async giveSupport(tokenID: string, amount: BigNumber, from: string, provider: ethers.providers.Web3Provider) {

    try {      
      // Give support using the Humanitweet contract (which burns half of the UBI)
      const contract = await contractProvider.getHumanitweetContractForWrite(from, provider);
      const tx = await contract.support(tokenID, amount);
      return await tx.wait(DEFAULT_CONFIRMATIONS);
    }
    catch (error) {
      console.log()
    }



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
      await tx.wait(7);
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
    const counter = await humanitweetContract.getTokenCounter();

    console.log("TOTAL HTWTs", counter);
    const tweetNFTs: IHumanitweetNft[] = [];

    // Loop from the last
    for (let tokenId = counter - 1; tokenId >= Math.max(tokenId - maxRecords, 0); tokenId--) {
      // Get NFT data from the contract and add it to the collection of tweets
      const humanitweetNft = await humanitweetContract.getHumanitweet(tokenId);

      console.log("NFT", humanitweetNft);

      // Add the NFT to the list of nfts
      tweetNFTs.unshift({
        tokenId: tokenId.toString(),
        tokenURI: humanitweetNft.tokenURI,
        creationDate: new Date(parseInt(humanitweetNft.date, 10) * 1000),
        supportGiven: humanitweetNft.supportGiven,
        supportCount: humanitweetNft.supportCount
      });
    }
    return tweetNFTs;
  },

  /**Load a humanitweet data from the token URI
   * @param tweetNft NFT to load the data from.
   */
  async loadHumanitweetFromNFT(tweetNft: IHumanitweetNft): Promise<HumanitweetData> {
    const tweetFile = await fetch(`http://127.0.0.1:8080/ipfs/${tweetNft.tokenURI.replace("ipfs://", "")}`);
    const data: ITweetData = await tweetFile.json();

    // Get the user registration data or an empty object
    const userRegistration = (await PohAPI.profiles.getByAddress(data.author)) || ({} as POHProfileModel);

    // Build the return value.
    const retVal: HumanitweetData = {
      ...tweetNft,
      authorDisplayName: userRegistration.display_name || data.author,
      authorFullName: `${userRegistration.first_name} ${userRegistration.last_name}`,
      authorImage: userRegistration.photo,
      text: data.text,
    };

    return retVal;

  }
}

export default HumanitweetService;