// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IProofOfhumanity.sol";

contract Humanitweet is ERC721, Ownable {

    string HUMAN_NOT_REGISTERED = "HUMAN_NOT_REGISTERED";
    using Strings for uint256;
    address _ubi;

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

    address private _poh;
    // Base URI
    string private _baseURIextended;

    uint256 private _tokenCounter;
    

    /// Require that an address is a valid registered human.
    modifier isHuman(address _submission) {
        IProofOfHumanity.SubmissionInfo memory info = IProofOfHumanity(_poh).getSubmissionInfo(_submission);
        require(info.registered, HUMAN_NOT_REGISTERED);
        _;
    }

    /// Require that a token has been minted
    modifier tokenExists(uint256 tokenId) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        _;
    }

    constructor(address poh, address ubi) public ERC721("Humanitweet", "HTWT") {
        _tokenCounter = 0;
        _poh = poh;
        _ubi = ubi;
    }

    function publishHumanitweet(string memory newTokenURI) public isHuman(_msgSender()) returns(uint256)  {
        
        // Get the new token iD
        uint256 newItemId = _tokenCounter;

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
        _tokenCounter = _tokenCounter +1;

        // Return the new token ID
        return newItemId;
    }

     function setBaseURI(string memory baseURI_) external onlyOwner() {
        _baseURIextended = baseURI_;
    }
    
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseURIextended;
    }

    function _setHumanitweet(uint256 tokenId, HumanitweetData memory data) internal virtual tokenExists(tokenId) {
     _humanitweets[tokenId] = data;
    }
    
    function tokenURI(uint256 tokenId) public view virtual override tokenExists(tokenId) returns (string memory) {

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

    function getTokenCounter() public view returns(uint256) {
        return _tokenCounter;
    }

    function getHumanitweet(uint256 tokenId) public view virtual tokenExists(tokenId) returns (HumanitweetData memory) {
        return _humanitweets[tokenId];
    }

    /**
     * Gives support to this tweet and burns the UBI. 
     * Supporters count is only added once per human.
     * If a Human gives support multiple times it will only count as one supporter.
     */
    function support(uint256 tokenId, uint256 ubiAmount) public tokenExists(tokenId) {

        // Burn the UBI on behalf of the caller.
        ERC20Burnable(_ubi).burnFrom(_msgSender(), ubiAmount);
        
        // Add support based on ubi amount
        _addSupport(tokenId, ubiAmount, _msgSender());
        
    }

    function _addSupport(uint256 tokenId, uint256 amount, address supporter) private {
         // Add the amount of support given
        _humanitweets[tokenId].supportGiven += amount;

        // If is first support, add 1 supporter.
        if(!_supporters[tokenId][supporter]) {
            _supporters[tokenId][supporter] = true;
            _humanitweets[tokenId].supportersCount += 1;
        }
    }
}