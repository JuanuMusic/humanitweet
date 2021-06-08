// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
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
    mapping(uint256 => mapping(address => bool)) _supporters;

    IProofOfHumanity public _poh;
    // Base URI
    string private _baseURIextended;

    uint256 public tokenCounter;

    modifier isHuman(address _submission) {
        require(_poh.isRegistered(_submission), HUMAN_NOT_REGISTERED);
        _;
    }

    constructor(address poh) public ERC721("Humanitweet", "HTWT") {
        tokenCounter = 0;
        _poh = IProofOfHumanity(poh);
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

    /**
     * Gives support to this tweet and burns the UBI. 
     * Supporters count is only added once per human.
     * If a Human gives support multiple times it will only count as one supporter.
     */
    function support(uint256 tokenId, uint256 ubiAmount) public {
        
        // Add the amount of support given
        _humanitweets[tokenId].supportGiven += ubiAmount;

        // If is first support, add 1 supporter.
        if(!_supporters[tokenId][_msgSender()]) {
            _supporters[tokenId][_msgSender()] = true;
            _humanitweets[tokenId].supportersCount += 1;
        }

        // Burn the UBI.
        bool success = _poh.transferFrom(_msgSender(), address(_poh), ubiAmount);
        require(success, "sell failed");
    }
}