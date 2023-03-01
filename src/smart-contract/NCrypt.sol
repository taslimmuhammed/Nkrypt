// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;


contract NCrypt {
    uint counter;
    constructor(){
        counter= 3135995786;
    } 
    
     mapping(uint256=> URI) public  tokenUris;
     mapping (uint256=> address) public owner;
     mapping(address => uint256[]) public ownings; 

     event Minted(uint256 tokenId, string  owner);

    struct URI{
        string name;
        string Creator;
        string description;
        string Type;
        string url;
        uint timeStamp;
    }
    function getCount() public view returns(uint256){
        return counter;
    }
     function safeMint(address to, string memory name,string memory _owner, string memory description, string memory Type, string memory url) public returns(uint256){
          counter = counter+1;
          uint256 count = counter;
          owner[count]= to;
          tokenUris[count]=  URI( name,_owner, description, Type, url, block.timestamp);
          ownings[to].push(count);
          emit Minted(count, _owner);
          return count;
     } 

     function burn(uint256 _tokenId) public returns (bool){
         require(owner[_tokenId]==msg.sender, "Only true owner can transfer patents");
          delete owner[_tokenId] ;
          for(uint j = 0; j < ownings[msg.sender].length; j++){
              if(ownings[msg.sender][j]==_tokenId){
                  delete ownings[msg.sender][j];
              }
          }
          delete tokenUris[counter]; 
          return true;  
     }

     function transfer(uint256 tokenId, address to) public  returns(bool){
         require(owner[tokenId]==msg.sender, "Only true owner can transfer patents");
         owner[tokenId]= to;
            for(uint j = 0; j < ownings[msg.sender].length; j++){
              if(ownings[msg.sender][j]==tokenId){
                  delete ownings[msg.sender][j];
              }
          }
          ownings[to].push(tokenId);
         return true ; 
     }

   

      function getTokens(address ownerAddress) public view returns( uint256[] memory){
        return ownings[ownerAddress];
    }

}
