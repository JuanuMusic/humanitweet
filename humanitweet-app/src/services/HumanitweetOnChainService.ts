import { providers, Contract, ethers } from "ethers";
import BN from "bn.js";
import IPFSStorageService from "./IPFSStorageService";
//const { providers, Contract } = require('ethers');
import configService from "./configService";
import contractProvider from "./ContractProvider";
const Humanitweet = require('../contracts/Humanitweet.json');
//const humanitweetContract = Humanitweet.deployed();
// const registry = Registry.deployed();
// const registryWrapper = new Contract(Registry.address, registryAbi.abi, signer);

interface IHumanitweetService {
  giveSupport(tokenID: number, amount: BN, from: string, drizzle: any): Promise<void>;
  publishTweet(tweetData: ITweetData, provider: any): Promise<void>;
}

async function getContractForWrite(provider: any, signerAddress: string) {

  // console.log("HUMANITWEET CONTRACT", Humanitweet);
  const ethersProvider = new ethers.providers.Web3Provider(provider);
  const network = await ethersProvider.getNetwork();
  const config = configService.getConfig(network.chainId);
  const signer = ethersProvider.getSigner(signerAddress);
  const humanitweetWrapper = new Contract(config.HumanitweetAddress, Humanitweet.abi, signer);
  return humanitweetWrapper.connect(signer);
}



const HumanitweetService: IHumanitweetService = {

  async giveSupport(tokenID: number, amount: BN, from: string, provider: any) {

    console.log("TokenID", tokenID);
    console.log("Amount", amount);
    // Create as NFT on the humanitweet contract

    const contract = await getContractForWrite(provider, from);
    const tx = await contract.support(tokenID, amount);
    console.log("SUPPORT TX", tx);
  },

  /**
   * Takes care of publishing a tween. 
   * It first uploads the tweet to a Decentralized service and then mints the NFT with the URL to it.
   * @param tweetData Data of the tweet
   * @param drizzle 
   */
  async publishTweet(tweetData: ITweetData, provider: any) {

    // upload the tweet to the storage service and get the path to the uploaded file
    const uploadedPath = await IPFSStorageService.uploadTweet(tweetData);
    console.log("UPOADED FILE TO IPFS: ", uploadedPath)
    // Create as NFT on the humanitweet contract

    try {
      const humanitweetContract = await contractProvider.getHumanitweetContractForWrite(tweetData.author, provider);
      const tx = await humanitweetContract.publishHumanitweet(`ipfs://${uploadedPath}`);
      console.log("Humanitweet published. TX:", tx);
    }
    catch (error) {
      console.log("error", error);
    }
  }
}

export default HumanitweetService;