// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EventNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;
    mapping(uint256 => uint256) public eventIds;
    mapping(uint256 => address) public eventCreators;
    mapping(uint256 => string) public eventTokenURIs;

    constructor() ERC721("EventNFT", "EVNT") Ownable(msg.sender) {}

    function setEventNFT(uint256 eventId, string memory tokenURI) 
        public 
    {
        require(
            msg.sender == eventCreators[eventId] || msg.sender == owner(),
            "Not authorized to set NFT"
        );
        eventTokenURIs[eventId] = tokenURI;
    }

    function mintTo(address to, uint256 eventId) 
        public 
        onlyOwner 
        returns (uint256) 
    {
        require(bytes(eventTokenURIs[eventId]).length > 0, "NFT not set for this event");
        require(to != eventCreators[eventId], "Event creator cannot receive NFT");
        
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        
        _mint(to, newTokenId);
        _setTokenURI(newTokenId, eventTokenURIs[eventId]);
        eventIds[newTokenId] = eventId;

        return newTokenId;
    }

    function setEventCreator(uint256 eventId, address creator) 
        public 
        onlyOwner 
    {
        eventCreators[eventId] = creator;
    }
}
