import ipfsHttpClient from 'ipfs-http-client';
import fs from "fs";

/**
 * Interface to implement storage system of tweets.
 */
interface IStorageService {
    /**
     * Uploads the tweet json to IPFS and returns a string with the path
     * @param data Generates a tweet
     * 
     * @returns Path to the uploaded file.
     */
    uploadTweet(data: ITweetData): Promise<string>;
}

/**
 * An implementation of IStorageService for the IPFS protocol.
 */
const IPFSStorageService : IStorageService = {
    

    /**
     * Uploads the tweet json to IPFS and returns a string with the path
     * @param data Generates a tweet
     * 
     * @returns Path to the uploaded file.
     */
    async uploadTweet(data: ITweetData): Promise<string> {

        const ipfsClient = ipfsHttpClient.create({ url: "/ip4/127.0.0.1/tcp/5001" });

        const tweetBytes = new TextEncoder().encode(JSON.stringify(data));
        const file = await ipfsClient.add(tweetBytes);
        return file.path;
    }
}

export default IPFSStorageService;