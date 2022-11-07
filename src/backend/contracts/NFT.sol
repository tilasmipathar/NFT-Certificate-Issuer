// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {
    uint public tokenCount;
    uint public itemCount;
    // address owner;

    struct Item {
        uint tokenId;
        string serial;
        string tokenUri;
        address owner;
        address current_owner;
        address valid_owner;
        bool redeemed;
    }

    mapping(uint => Item) public items;
    // mapping(address=> bool) issuedWarranties;
    // mapping(address=> string) warrantyUri;

    constructor() ERC721("Warranty NFT", "WAR"){
        // owner = msg.sender;
    }

    // function issueWarranty (address to, string memory _uri) onlyOwner external {
    //     issuedWarranties[to]=true;
    //     warrantyUri[to]=_uri;
    // }

    function claimWarranty(uint itemNumber, string memory _uri) external returns(uint) {
        if (items[itemNumber].valid_owner == msg.sender) {
            tokenCount ++;
            _safeMint(msg.sender, tokenCount);
            _setTokenURI(tokenCount, _uri);
            // issuedWarranties[msg.sender]=false;
            items[itemNumber].tokenId = tokenCount;
            items[itemNumber].current_owner = msg.sender;
            items[itemNumber].redeemed = true;
            return(tokenCount);
        }
        revert("Not eligible"); 
    }

    function burn(uint256 tokenId, uint indx) external virtual {
        require(items[indx].current_owner == msg.sender, "Not the owner of the NFT");
        items[indx].current_owner = address(0);
        _burn(tokenId);
    }

    function completeBurn(uint256 tokenId, uint indx) external virtual {
        require(items[indx].current_owner == msg.sender, "Not the owner of the NFT");
        items[indx].current_owner = address(0);
        _burn(tokenId);
        delete items[indx];
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override virtual {
        require( from == address(0) || to == address(0), "You cant transfer this token");
    }

    function makeItem(string memory serial, string memory _tokenUri, address _validOwner) external {
        itemCount++;
        items[itemCount] = Item (
            0,
            serial,
            _tokenUri,
            msg.sender,
            msg.sender,
            _validOwner,
            false
        );
    }

    function updateUri(uint itemNumber, string memory newUri) external{
        items[itemNumber].tokenUri = newUri;
    }

    function updateValidOwner(uint itemNumber, address newOwner) external{
        items[itemNumber].valid_owner = newOwner;
    }
}