import IPFSStorageService from "./IPFSStorageService";

interface IHumanitweetService {
    publishTweet(tweetData: ITweetData, drizzle: any) : Promise<void>;
}

const HumanitweetService: IHumanitweetService = {
    async publishTweet(tweetData: ITweetData, drizzle: any) {
        
          const storage = new IPFSStorageService();
      
          const result = await storage.uploadTweet(tweetData);
      
          // Create as NFT
          const tweetContract = drizzle.contracts["Humanitweet"];
          await tweetContract.methods
            .publishHumanitweet(`http://127.0.0.1:8080/ipfs/${result.path}`)
            .send({ from: this.publishTweet });
      
    }
}

export default HumanitweetService;