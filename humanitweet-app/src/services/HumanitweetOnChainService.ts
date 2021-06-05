import IPFSStorageService from "./IPFSStorageService";

interface IHumanitweetService {
    publishTweet(tweetData: ITweetData, drizzle: any) : Promise<void>;
}

const HumanitweetService: IHumanitweetService = {
    
    /**
     * Takes care of publishing a tween. 
     * It first uploads the tweet to a Decentralized service and then mints the NFT with the URL to it.
     * @param tweetData Data of the tweet
     * @param drizzle 
     */
    async publishTweet(tweetData: ITweetData, drizzle: any) {
        
        // upload the tweet to the storage service and get the path to the uploaded file
        const uploadedPath = await IPFSStorageService.uploadTweet(tweetData);
      
          // Create as NFT on the humanitweet contract
          const tweetContract = drizzle.contracts["Humanitweet"];
          await tweetContract.methods
            .publishHumanitweet(`http://127.0.0.1:8080/ipfs/${uploadedPath}`)
            .send({ from: tweetData.author });
      
    }
}

export default HumanitweetService;