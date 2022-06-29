// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

contract NFTArt is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    Pausable,
    ERC721Burnable,
    Ownable
{
    uint256 private tokenIdTracker = 1;
    string[] public nftList;
    mapping(string => bool) nftExists;
    string[] public nftWords;
    uint256 public MAX_SUPPLY;
    string public baseTokenURI;

    // Events
    event greet(uint256 indexed id);

    bool public publicMintStatus = true;

    // Set wallet restriction
    bool public walletRestriction = true;
    uint256 public walletRestrictionCount = 10;
    uint256 private nftAmount = 0;

    constructor(
        string memory name,
        string memory symbol,
        address ownerAddress
    ) ERC721(name, symbol) {
        transferOwnership(ownerAddress);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        baseTokenURI = baseURI;
    }

    function setPublicMint(bool _status) public onlyOwner {
        publicMintStatus = _status;
    }

    function setWalletRestriction(uint256 _count, bool _status)
        public
        onlyOwner
    {
        walletRestriction = _status;
        walletRestrictionCount = _count;
    }

    function setMaxSupply(uint256 _maxSupply) public onlyOwner {
        MAX_SUPPLY = _maxSupply;
    }

    function setNFTAmount(uint256 _amount) public onlyOwner {
        nftAmount = _amount;
    }

    function safeMint(
        address _to,
        string memory _tokenURI,
        string memory _nftWord
    ) external onlyOwner {
        require(!nftExists[_tokenURI], "Token already exists");

        nftList.push(_tokenURI);
        uint256 tokenId = tokenIdTracker;

        _safeMint(_to, tokenId);

        tokenIdTracker = tokenIdTracker + 1;
        nftExists[_tokenURI] = true;

        _setTokenURI(tokenId, _tokenURI);
        nftWords.push(_nftWord);

        emit greet(tokenId);
    }

    function publicMinting(
        address _to,
        string memory _tokenURI,
        string memory _nftWord
    ) external payable {
        require(publicMintStatus, "Public mint is disabled");
        require(
            balanceOf(_to) < walletRestrictionCount,
            "Already minted your NFT."
        );
        require(!nftExists[_tokenURI], "Token already exists");
        require(nftAmount <= (msg.value), "Minting fee is not correct..");
        payable(owner()).transfer(msg.value);
        mintingInternal(_to, _tokenURI, _nftWord);
    }

    function mintingInternal(
        address _to,
        string memory _tokenURI,
        string memory _nftWord
    ) internal {
        nftList.push(_tokenURI);

        uint256 tokenId = tokenIdTracker;
        _safeMint(_to, tokenId);

        tokenIdTracker = tokenIdTracker + 1;
        nftExists[_tokenURI] = true;

        _setTokenURI(tokenId, _tokenURI);
        nftWords.push(_nftWord);

        emit greet(tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function burnToken(uint256 tokenId) public onlyOwner {
        _burn(tokenId);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
        onlyOwner
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
