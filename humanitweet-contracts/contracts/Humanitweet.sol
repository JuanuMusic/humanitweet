// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IProofOfHumanity.sol";

contract Humanitweet is ERC721, Ownable {

    string HUMAN_NOT_REGISTERED = "HUMAN_NOT_REGISTERED";
    using Strings for uint256;

    struct HumanitweetData {
        
        // URI of the NFT data
        string tokenURI;
        
        // Date at which the tweet was minted
        uint256 date;
        
        // Ammount given as support
        uint256 supportGiven;
        
        // Total number of unique humans that support this tweet
        uint256 supportersCount;
    }
    
    // Mapping for NFTS
    mapping (uint256 => HumanitweetData) private _humanitweets;

    // Mapping for humans that support each tweet
    mapping(uint256 => mapping(address => bool)) supporters;

    IProofOfHumanityProxy public pohProxy;
    // Base URI
    string private _baseURIextended;

    uint256 public tokenCounter;

    modifier isHuman(address _submission) {
        require(pohProxy.isRegistered(_submission), HUMAN_NOT_REGISTERED);
        _;
    }

    constructor(address pPohProxy) public ERC721("Humanitweet", "HTWT") {
        tokenCounter = 0;
        pohProxy = IProofOfHumanityProxy(pPohProxy);
    }

    function publishHumanitweet(string memory newTokenURI) public isHuman(_msgSender()) returns(uint256)  {
        
        // Get the new token iD
        uint256 newItemId = tokenCounter;

        // Mint the NFT with the new ID
        _safeMint(_msgSender(), newItemId);

        // Generate the humanitweet NFT storage data
        HumanitweetData memory humanitweet = HumanitweetData({
            date: block.timestamp,
            tokenURI: newTokenURI,
            supportGiven: 0,
            supportersCount: 0
        });

        // Set the humanitweet dat to the token
        _setHumanitweet(newItemId, humanitweet);
        
        // Update the token counter
        tokenCounter = tokenCounter +1;

        // Return the new token ID
        return newItemId;
    }

     function setBaseURI(string memory baseURI_) external onlyOwner() {
        _baseURIextended = baseURI_;
    }
    
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseURIextended;
    }

    function _setHumanitweet(uint256 tokenId, HumanitweetData memory data) internal virtual {
     require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
     _humanitweets[tokenId] = data;
    }
    
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        HumanitweetData memory humanitweet = _humanitweets[tokenId];
        string memory base = _baseURI();
        
        // If there is no base URI, return the token URI.
        if (bytes(base).length == 0) {
            return humanitweet.tokenURI;
        }
        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
        if (bytes(humanitweet.tokenURI).length > 0) {
            return string(abi.encodePacked(base, humanitweet.tokenURI));
        }
        // If there is a baseURI but no tokenURI, concatenate the tokenID to the baseURI.
        return string(abi.encodePacked(base, tokenId.toString()));
    }

    function getHumanitweet(uint256 tokenId) public view virtual returns (HumanitweetData memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return _humanitweets[tokenId];
    }
}