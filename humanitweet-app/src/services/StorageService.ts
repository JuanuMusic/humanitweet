import ipfsHttpClient from 'ipfs-http-client';

export default class StorageService {
    _ipfsClient;
    constructor() {
        
        this._ipfsClient = ipfsHttpClient.create("/ip4/127.0.0.1/tcp/5001");
    }

    async uploadTweet(data: ITweetData) {
        const tweetBytes = new TextEncoder().encode(JSON.stringify(data));
        const file = await this._ipfsClient.add(tweetBytes);
        return file;
    }
}