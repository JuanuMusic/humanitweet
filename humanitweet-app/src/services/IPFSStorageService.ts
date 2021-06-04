// import ipfsHttpClient from 'ipfs-http-client';
import { NFTStorage, File } from 'nft.storage'
import fs from "fs";
import { TokenInput } from 'nft.storage/dist/src/lib/interface';
const client = new NFTStorage({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGM3MDJCNjVjYUJjMzk5MjRkYUFEMTllQmFGQjJkMDE0RjEzOTJjREIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYyMjMwNDMxMzA3MSwibmFtZSI6Ikh1bWFuaXR3ZWV0X3Rlc3QifQ.NP17BiIurQt5OUXqQMn7dLoQte3u99mVcJITNEw0L64" });

interface IStorageService {
    generateTweet(data: ITweetData) : Promise<Token>;
}

export default class IPFSStorageService implements IStorageService {
    //_ipfsClient;
    constructor() {
        
        //this._ipfsClient = ipfsHttpClient.create("/ip4/127.0.0.1/tcp/5001");
    }

    async generateTweet(data: ITweetData) {
        //fs.readFile("file", (err, data) => new File([data], "humanitweet")
        const tweetBytes = new TextEncoder().encode(JSON.stringify(data));

        const metadata = await client.store({
            name: 'Humanitweet',
            description: 'A Humanitweet NFT',
            image: new File(
                [tweetBytes],
                `humanitweet.json`
            ),
        })
        console.log(metadata.url)
        console.log(metadata)

        //const file = await this._ipfsClient.add(tweetBytes);
        return metadata;
    }
}